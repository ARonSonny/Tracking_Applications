from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date, datetime
from uuid import UUID
from models import AppStatus

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None

class UserOut(BaseModel):
    id: UUID
    email: EmailStr
    full_name: Optional[str]
    created_at: datetime
    is_active: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class ApplicationCreate(BaseModel):
    company: str
    role_title: str
    status: AppStatus = AppStatus.WISHLIST
    location: Optional[str] = None
    date_applied: Optional[date] = None
    job_url: Optional[str] = None
    salary_range: Optional[str] = None
    notes: Optional[str] = None

class ApplicationUpdate(BaseModel):
    company: Optional[str] = None
    role_title: Optional[str] = None
    status: Optional[AppStatus] = None
    location: Optional[str] = None
    date_applied: Optional[date] = None
    job_url: Optional[str] = None
    salary_range: Optional[str] = None
    notes: Optional[str] = None

class ApplicationOut(BaseModel):
    id: UUID
    user_id: UUID
    company: str
    role_title: str
    status: AppStatus
    location: Optional[str]
    date_applied: Optional[date]
    job_url: Optional[str]
    salary_range: Optional[str]
    notes: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class ContactCreate(BaseModel):
    app_id: UUID
    name: str
    role: Optional[str] = None
    email: Optional[str] = None
    linkedin: Optional[str] = None
    notes: Optional[str] = None

class ContactOut(BaseModel):
    id: UUID
    app_id: UUID
    name: str
    role: Optional[str]
    email: Optional[str]
    linkedin: Optional[str]
    notes: Optional[str]

    class Config:
        from_attributes = True