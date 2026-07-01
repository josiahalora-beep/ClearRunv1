import os
import logging
from pathlib import Path
from datetime import datetime, UTC

from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

from models import LeadSubmission, LeadSubmissionCreate

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

mongo_url = os.environ["MONGO_URL"]
db_name = os.environ["DB_NAME"]
client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

app = FastAPI(title="ClearRun Records API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@api_router.get("/health")
async def health_check():
    return {"status": "ok", "service": "ClearRun Records API"}


@api_router.post("/leads", response_model=LeadSubmission, status_code=201, response_model_by_alias=False)
async def create_lead(payload: LeadSubmissionCreate):
    valid_types = {"trial", "mockup", "contact", "partner", "pilot", "checklist"}
    if payload.lead_type not in valid_types:
        raise HTTPException(status_code=400, detail="Invalid lead_type")
    lead = LeadSubmission(**payload.model_dump())
    result = await db.leads.insert_one(lead.to_mongo())
    created = await db.leads.find_one({"_id": result.inserted_id})
    return LeadSubmission.from_mongo(created)


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
