import os
import logging
from pathlib import Path
from datetime import datetime, UTC, timedelta

from fastapi import FastAPI, APIRouter, HTTPException, BackgroundTasks, Depends
from fastapi.security import APIKeyHeader
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import PyMongoError
from pymongo import ReturnDocument
from bson import ObjectId
from bson.errors import InvalidId
from dotenv import load_dotenv

from models import LeadSubmission, LeadSubmissionCreate, LeadStatusUpdate

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

from email_service import send_lead_emails

mongo_url = os.environ["MONGO_URL"]
db_name = os.environ["DB_NAME"]
client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

app = FastAPI(title="ClearRun Records API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

VALID_LEAD_TYPES = {"trial", "mockup", "proof_snapshot", "contact", "partner", "pilot", "checklist"}
VALID_LEAD_STATUSES = {"New", "Reviewed", "Followed Up", "Trial Started", "Not Fit", "Closed"}

ADMIN_ACCESS_ENABLED = os.environ.get("ADMIN_ACCESS_ENABLED", "false").lower() == "true"
ADMIN_ACCESS_KEY = os.environ.get("ADMIN_ACCESS_KEY")
admin_key_header = APIKeyHeader(name="X-Admin-Key", auto_error=False)


async def verify_admin_access(provided_key: str = Depends(admin_key_header)):
    """
    Guards every /api/admin/* route with a shared-secret header. Never logs or
    echoes back the provided or configured key.
    """
    if not ADMIN_ACCESS_ENABLED or not ADMIN_ACCESS_KEY:
        raise HTTPException(status_code=403, detail="Admin access is disabled")
    if provided_key is None:
        raise HTTPException(status_code=401, detail="X-Admin-Key header is required")
    if provided_key != ADMIN_ACCESS_KEY:
        raise HTTPException(status_code=403, detail="Invalid admin key")
    return True


admin_router = APIRouter(prefix="/api/admin", dependencies=[Depends(verify_admin_access)])


@api_router.get("/health")
async def health_check():
    return {"status": "ok", "service": "ClearRun Records API"}


@api_router.post("/leads", response_model=LeadSubmission, status_code=201, response_model_by_alias=False)
async def create_lead(payload: LeadSubmissionCreate, background_tasks: BackgroundTasks):
    if payload.lead_type not in VALID_LEAD_TYPES:
        raise HTTPException(status_code=400, detail="Invalid lead_type")

    if payload.hp_website:
        # Honeypot field was filled in - almost certainly a bot. Respond as if the
        # submission succeeded so the bot gets no signal, but never persist or email it.
        fake_payload = payload.model_dump(exclude={"hp_website"})
        return LeadSubmission(id=str(ObjectId()), **fake_payload)

    try:
        # Idempotency guard: avoid creating duplicate rows if the same person
        # double-submits the same form within a short window.
        window_start = datetime.now(UTC) - timedelta(hours=24)
        existing = await db.leads.find_one({
            "email": payload.email,
            "lead_type": payload.lead_type,
            "created_at": {"$gte": window_start},
        })
        if existing:
            lead = LeadSubmission.from_mongo(existing)
            # Emails are only sent for new submissions, never for duplicates.
            background_tasks.add_task(send_lead_emails, lead, True)
            return lead

        lead = LeadSubmission(**payload.model_dump())
        result = await db.leads.insert_one(lead.to_mongo())
        created = await db.leads.find_one({"_id": result.inserted_id})
        new_lead = LeadSubmission.from_mongo(created)
        # Fired after the HTTP response is sent - never blocks or breaks lead submission.
        background_tasks.add_task(send_lead_emails, new_lead, False)
        return new_lead
    except PyMongoError:
        logger.exception("Failed to persist lead submission")
        raise HTTPException(status_code=500, detail="Unable to save your submission right now. Please try again.")


@api_router.get("/leads/count")
async def count_leads():
    count = await db.leads.count_documents({})
    return {"total_leads": count}


@admin_router.get("/leads", response_model=list[LeadSubmission], response_model_by_alias=False)
async def list_leads_admin():
    """Powers the /admin/leads inbox. Protected by verify_admin_access via admin_router."""
    cursor = db.leads.find().sort("created_at", -1).limit(500)
    docs = await cursor.to_list(length=500)
    return [LeadSubmission.from_mongo(doc) for doc in docs]


@admin_router.patch("/leads/{lead_id}/status", response_model=LeadSubmission, response_model_by_alias=False)
async def update_lead_status(lead_id: str, payload: LeadStatusUpdate):
    if payload.status not in VALID_LEAD_STATUSES:
        raise HTTPException(status_code=400, detail="Invalid status")
    try:
        object_id = ObjectId(lead_id)
    except (InvalidId, TypeError):
        raise HTTPException(status_code=404, detail="Lead not found")

    try:
        result = await db.leads.find_one_and_update(
            {"_id": object_id},
            {"$set": {"status": payload.status}},
            return_document=ReturnDocument.AFTER,
        )
    except PyMongoError:
        logger.exception("Failed to update lead status")
        raise HTTPException(status_code=500, detail="Unable to update lead status right now.")

    if result is None:
        raise HTTPException(status_code=404, detail="Lead not found")
    return LeadSubmission.from_mongo(result)


app.include_router(api_router)
app.include_router(admin_router)

cors_origins = os.environ.get("CORS_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
