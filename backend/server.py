from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr
from typing import List, Annotated
from datetime import datetime, timezone
import os
import uuid

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
