from app.repositories import booking_repo
from app.schemas.booking_schema import BookingCreate, BookingUpdate
from bson import ObjectId
from datetime import datetime
from fastapi import HTTPException
from app.utils.serilizer import serialize_mongo

async def create_booking(booking: BookingCreate, client_id: str) -> dict:
    booking_dict = booking.model_dump()
    booking_dict["provider_id"] = ObjectId(booking.provider_id)
    booking_dict["client_id"] = ObjectId(client_id)
    booking_dict["service_id"] = ObjectId(booking.service_id)
    booking_dict["status"] = "pending"
    # In a real scenario, fetch service price from DB and save it here.
    booking_dict["price"] = {"amount": 0.0, "currency": "EUR"}
    booking_dict["created_at"] = datetime.utcnow()
    booking_dict["updated_at"] = datetime.utcnow()
    
    result = await booking_repo.create_booking(booking_dict)
    return serialize_mongo(result)

async def get_client_bookings(client_id: str) -> list[dict]:
    results = await booking_repo.get_bookings_by_client(ObjectId(client_id))
    return serialize_mongo(results)

async def get_provider_bookings(provider_id: str, current_user_id: str) -> list[dict]:
    # Should verify if current_user_id is the owner of provider_id
    results = await booking_repo.get_bookings_by_provider(ObjectId(provider_id))
    return serialize_mongo(results)

async def update_booking(booking_id: str, update: BookingUpdate, current_user_id: str) -> dict:
    update_dict = update.model_dump(exclude_unset=True)
    update_dict["updated_at"] = datetime.utcnow()
    
    result = await booking_repo.update_booking(ObjectId(booking_id), update_dict)
    if not result:
        raise HTTPException(status_code=404, detail="Booking not found")
    return serialize_mongo(result)
