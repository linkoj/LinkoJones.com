from fastapi import FastAPI, APIRouter, HTTPException, BackgroundTasks, Request
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, timezone, timedelta
import os
import re
import uuid
import asyncio
import logging
import resend

from audit import fetch_site, generate_audit
from audit_pdf import build_pdf

logger = logging.getLogger("uvicorn.error")
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
from dotenv import load_dotenv
load_dotenv(os.path.join(ROOT_DIR, ".env"))

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]
resend.api_key = os.environ.get("RESEND_API_KEY")
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "onboarding@resend.dev")
AUDIT_MAX_PER_HOUR = int(os.environ.get("AUDIT_MAX_PER_HOUR", "3"))
AUDIT_MAX_PER_DAY = int(os.environ.get("AUDIT_MAX_PER_DAY", "10"))

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
async def create_audit(payload: AuditRequest, request: Request, background_tasks: BackgroundTasks):
    # Identify the caller (respect proxy headers from the k8s ingress).
    fwd = request.headers.get("x-forwarded-for")
    ip = (fwd.split(",")[0].strip() if fwd else (request.client.host if request.client else "unknown"))

    now = datetime.now(timezone.utc)
    hour_ago = (now - timedelta(hours=1)).isoformat()
    day_ago = (now - timedelta(days=1)).isoformat()
    per_hour = await db.audits.count_documents({"ip": ip, "created_at": {"$gte": hour_ago}})
    per_day = await db.audits.count_documents({"ip": ip, "created_at": {"$gte": day_ago}})
    if per_hour >= AUDIT_MAX_PER_HOUR or per_day >= AUDIT_MAX_PER_DAY:
        raise HTTPException(
            status_code=429,
            detail=f"You've reached the audit limit ({AUDIT_MAX_PER_HOUR}/hour, {AUDIT_MAX_PER_DAY}/day). Please try again later.",
        )

    audit_id = str(uuid.uuid4())
    doc = {
        "id": audit_id,
        "status": "processing",
        "url": payload.url,
        "industry": payload.industry,
        "business_goal": payload.business_goal,
        "ip": ip,
        "created_at": now.isoformat(),
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


async def _completed_audit(audit_id: str):
    doc = await db.audits.find_one({"id": audit_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Audit not found")
    if doc.get("status") != "complete" or not doc.get("report"):
        raise HTTPException(status_code=409, detail="Audit not ready")
    return doc


@api.get("/audit/{audit_id}/pdf")
async def audit_pdf(audit_id: str):
    doc = await _completed_audit(audit_id)
    pdf_bytes = build_pdf(doc["report"], doc.get("url"), doc.get("industry"), doc.get("business_goal"))
    filename = "LinkoJones-UX-Audit.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'inline; filename="{filename}"'},
    )


class LeadRequest(BaseModel):
    email: str = Field(..., min_length=3, max_length=200)
    report_url: Optional[str] = Field(None, max_length=500)


def _audit_email_html(url: str, report_url: str) -> str:
    link = report_url or "https://linkojones.com"
    return f"""
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f6fc;padding:32px 0;font-family:Arial,Helvetica,sans-serif;">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:14px;overflow:hidden;">
      <tr><td style="background:#004bc8;padding:22px 28px;color:#ffffff;font-size:13px;letter-spacing:2px;">LINKOJONES &nbsp;/&nbsp; UX AUDIT</td></tr>
      <tr><td style="padding:28px;">
        <h1 style="margin:0 0 8px;font-size:22px;color:#0c1630;">Your UX audit is ready</h1>
        <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#3a4256;">
          Thanks for using the LinkoJones UX audit. We've attached the full report for
          <strong>{url}</strong> as a PDF, structured around our 10-step consultancy framework.
        </p>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#3a4256;">
          You can also view the live, shareable version online:
        </p>
        <a href="{link}" style="display:inline-block;background:#004bc8;color:#ffffff;text-decoration:none;padding:13px 26px;border-radius:10px;font-size:15px;">View the live report</a>
        <p style="margin:26px 0 0;font-size:13px;line-height:1.6;color:#7a8298;">
          Want to act on these findings? Reply to this email and we'll help you turn the
          audit into a focused optimisation or redesign.
        </p>
      </td></tr>
      <tr><td style="padding:18px 28px;background:#0c1630;color:#9aa3bd;font-size:12px;">LinkoJones &nbsp;-&nbsp; Senior UX Consultancy &nbsp;-&nbsp; linkojones.com</td></tr>
    </table>
  </td></tr>
</table>
"""


@api.post("/audit/{audit_id}/lead")
async def capture_lead(audit_id: str, payload: LeadRequest):
    email = payload.email.strip().lower()
    if not EMAIL_RE.match(email):
        raise HTTPException(status_code=422, detail="Please enter a valid email address.")
    doc = await _completed_audit(audit_id)

    # Save / upsert into the mailing list.
    await db.leads.update_one(
        {"email": email, "audit_id": audit_id},
        {"$set": {"email": email, "audit_id": audit_id, "url": doc.get("url"),
                  "report_url": payload.report_url, "created_at": datetime.now(timezone.utc).isoformat()}},
        upsert=True,
    )

    email_sent = False
    error = None
    try:
        pdf_bytes = build_pdf(doc["report"], doc.get("url"), doc.get("industry"), doc.get("business_goal"))
        if not resend.api_key:
            error = "Email delivery is not configured."
        else:
            params = {
                "from": SENDER_EMAIL,
                "to": [email],
                "subject": f"Your UX audit for {doc.get('url')}",
                "html": _audit_email_html(doc.get("url"), payload.report_url),
                "attachments": [{"filename": "LinkoJones-UX-Audit.pdf", "content": list(pdf_bytes)}],
            }
            result = await asyncio.to_thread(resend.Emails.send, params)
            email_sent = bool(result and result.get("id"))
    except Exception as e:
        logger.error(f"Resend send failed: {e}")
        error = str(e)

    return {"saved": True, "email_sent": email_sent, "error": error, "pdf_path": f"/api/audit/{audit_id}/pdf"}


@api.get("/leads")
async def list_leads():
    docs = await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return {"count": len(docs), "leads": docs}


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
