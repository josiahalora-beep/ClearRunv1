import os
import logging
from pathlib import Path
from datetime import datetime, UTC, timedelta

from fastapi import FastAPI, APIRouter, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import PyMongoError
from dotenv import load_dotenv

from models import LeadSubmission, LeadSubmissionCreate

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

VALID_LEAD_TYPES = {"trial", "mockup", "contact", "partner", "pilot", "checklist"}


@api_router.get("/health")
async def health_check():
    return {"status": "ok", "service": "ClearRun Records API"}


@api_router.post("/leads", response_model=LeadSubmission, status_code=201, response_model_by_alias=False)
async def create_lead(payload: LeadSubmissionCreate, background_tasks: BackgroundTasks):
    if payload.lead_type not in VALID_LEAD_TYPES:
        raise HTTPException(status_code=400, detail="Invalid lead_type")

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


app.include_router(api_router)

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
