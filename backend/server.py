from fastapi import FastAPI, APIRouter, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, timezone
import os
import uuid
import logging

from audit import fetch_site, generate_audit

logger = logging.getLogger("uvicorn.error")

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
from dotenv import load_dotenv
load_dotenv(os.path.join(ROOT_DIR, ".env"))

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

app = FastAPI(title="UX Museum Portfolio API")
api = APIRouter(prefix="/api")


class ContactCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    email: str = Field(..., min_length=3, max_length=200)
    message: str = Field(..., min_length=1, max_length=4000)


class Contact(ContactCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


@api.get("/")
async def root():
    return {"status": "ok", "service": "ux-museum-portfolio"}


@api.get("/health")
async def health():
    return {"status": "healthy"}


@api.post("/contact", response_model=Contact)
async def create_contact(payload: ContactCreate):
    doc = Contact(**payload.model_dump())
    await db.contacts.insert_one(doc.model_dump())
    return doc


@api.get("/contact", response_model=List[Contact])
async def list_contacts():
    docs = await db.contacts.find().sort("created_at", -1).to_list(200)
    return [Contact(**{k: v for k, v in d.items() if k != "_id"}) for d in docs]


# ---------------- UX Audit ----------------

class AuditRequest(BaseModel):
    url: str = Field(..., min_length=3, max_length=500)
    industry: Optional[str] = Field(None, max_length=160)
    business_goal: Optional[str] = Field(None, max_length=240)


async def _run_audit(audit_id: str, payload: AuditRequest):
    try:
        signals = await fetch_site(payload.url)
        report = await generate_audit(signals, payload.industry, payload.business_goal)
        await db.audits.update_one(
            {"id": audit_id},
            {"$set": {
                "status": "complete",
                "report": report,
                "site_title": signals.get("title") or signals.get("og_title"),
                "fetched": signals.get("fetched", False),
                "completed_at": datetime.now(timezone.utc).isoformat(),
            }},
        )
    except Exception as e:
        logger.exception("audit failed")
        await db.audits.update_one(
            {"id": audit_id},
            {"$set": {"status": "error", "error": f"{type(e).__name__}: {e}"}},
        )


@api.post("/audit")
async def create_audit(payload: AuditRequest, background_tasks: BackgroundTasks):
    audit_id = str(uuid.uuid4())
    doc = {
        "id": audit_id,
        "status": "processing",
        "url": payload.url,
        "industry": payload.industry,
        "business_goal": payload.business_goal,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.audits.insert_one(doc)
    background_tasks.add_task(_run_audit, audit_id, payload)
    return {"id": audit_id, "status": "processing"}


@api.get("/audit/{audit_id}")
async def get_audit(audit_id: str):
    doc = await db.audits.find_one({"id": audit_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Audit not found")
    doc.pop("_id", None)
    return doc


app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown():
    client.close()
