from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PaymentCreate(BaseModel):
    booking_id: str
    amount_total: float
    currency: str = "EUR"

class PaymentOut(BaseModel):
    id: str
    booking_id: str
    client_id: str
    provider_id: str
    amount_total: float
    amount_provider: float
    amount_platform: float
    currency: str
    status: str
    stripe_payment_intent_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
