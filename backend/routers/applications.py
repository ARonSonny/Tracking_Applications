from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Application
from schemas import ApplicationCreate, ApplicationUpdate, ApplicationOut
from routers.auth import get_current_user
from fastapi.security import OAuth2PasswordBearer
from typing import List
from uuid import UUID

router = APIRouter(prefix="/applications", tags=["applications"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user_from_token(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    return get_current_user(token, db)

@router.get("/", response_model=List[ApplicationOut])
def get_applications(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_from_token)
):
    return db.query(Application).filter(Application.user_id == current_user.id).all()

@router.post("/", response_model=ApplicationOut)
def create_application(
    application: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_from_token)
):
    new_app = Application(**application.dict(), user_id=current_user.id)
    db.add(new_app)
    db.commit()
    db.refresh(new_app)
    return new_app

@router.get("/{app_id}", response_model=ApplicationOut)
def get_application(
    app_id: UUID,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_from_token)
):
    app = db.query(Application).filter(
        Application.id == app_id,
        Application.user_id == current_user.id
    ).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    return app

@router.patch("/{app_id}", response_model=ApplicationOut)
def update_application(
    app_id: UUID,
    updates: ApplicationUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_from_token)
):
    app = db.query(Application).filter(
        Application.id == app_id,
        Application.user_id == current_user.id
    ).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    for field, value in updates.dict(exclude_unset=True).items():
        setattr(app, field, value)
    db.commit()
    db.refresh(app)
    return app

@router.delete("/{app_id}")
def delete_application(
    app_id: UUID,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_from_token)
):
    app = db.query(Application).filter(
        Application.id == app_id,
        Application.user_id == current_user.id
    ).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    db.delete(app)
    db.commit()
    return {"message": "Application deleted"}