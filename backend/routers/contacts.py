from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Contact
from schemas import ContactCreate, ContactOut
from routers.auth import get_current_user
from fastapi.security import OAuth2PasswordBearer
from typing import List
from uuid import UUID

router = APIRouter(prefix="/contacts", tags=["contacts"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user_from_token(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    return get_current_user(token, db)

@router.get("/", response_model=List[ContactOut])
def get_contacts(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_from_token)
):
    return db.query(Contact).all()

@router.post("/", response_model=ContactOut)
def create_contact(
    contact: ContactCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_from_token)
):
    new_contact = Contact(**contact.dict())
    db.add(new_contact)
    db.commit()
    db.refresh(new_contact)
    return new_contact

@router.patch("/{contact_id}", response_model=ContactOut)
def update_contact(
    contact_id: UUID,
    updates: ContactCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_from_token)
):
    contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    for field, value in updates.dict(exclude_unset=True).items():
        setattr(contact, field, value)
    db.commit()
    db.refresh(contact)
    return contact

@router.delete("/{contact_id}")
def delete_contact(
    contact_id: UUID,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_from_token)
):
    contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    db.delete(contact)
    db.commit()
    return {"message": "Contact deleted"}