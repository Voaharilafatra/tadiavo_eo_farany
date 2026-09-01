from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.schemas.service import ServiceCreate

class UserProfile(BaseModel):
    bio: Optional[str] = None
    address: Optional[dict] = None
    contact: Optional[dict] = None
    features: Optional[List[str]] = []
    images: Optional[List[str]] = []

class UserOut(BaseModel):
    id: str
    email: str
    name: str
    role: str
    status: str
    picture: Optional[str] = None
    profile: Optional[UserProfile] = None
    services: Optional[list] = []
    rating: Optional[dict] = {"average": 0.0, "count": 0}
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class GoogleLoginRequest(BaseModel):
    credential: str
