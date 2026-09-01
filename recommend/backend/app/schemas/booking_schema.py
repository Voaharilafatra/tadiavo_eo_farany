from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class BookingCreate(BaseModel):
    provider_id: str
    service_id: str
    scheduled_at: datetime
    notes: Optional[str] = None

class BookingUpdate(BaseModel):
    status: Optional[str] = None
    scheduled_at: Optional[datetime] = None
    notes: Optional[str] = None

class BookingOut(BaseModel):
    id: str
    provider_id: str
    client_id: str
    service_id: str
    status: str
    scheduled_at: datetime
    price: dict
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
