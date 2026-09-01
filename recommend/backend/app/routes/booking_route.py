from fastapi import APIRouter, Depends, status, HTTPException
from typing import List
from app.schemas.booking_schema import BookingCreate, BookingOut, BookingUpdate
from app.core.security import get_current_user
from app.services import booking_service

router = APIRouter(
    prefix="/bookings",
    tags=["Bookings"],
)

@router.post("", response_model=BookingOut, status_code=status.HTTP_201_CREATED)
async def create_booking(booking: BookingCreate, user_id: str = Depends(get_current_user)):
    return await booking_service.create_booking(booking, user_id)

@router.get("/me", response_model=List[BookingOut])
async def get_my_bookings(user_id: str = Depends(get_current_user)):
    return await booking_service.get_client_bookings(user_id)

@router.get("/provider/{provider_id}", response_model=List[BookingOut])
async def get_provider_bookings(provider_id: str, user_id: str = Depends(get_current_user)):
    return await booking_service.get_provider_bookings(provider_id, user_id)

@router.patch("/{booking_id}", response_model=BookingOut)
async def update_booking_status(booking_id: str, update: BookingUpdate, user_id: str = Depends(get_current_user)):
    return await booking_service.update_booking(booking_id, update, user_id)
