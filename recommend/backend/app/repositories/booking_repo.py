from app.database.mongodb import database
from bson import ObjectId
from typing import List, Dict, Any

bookings_collection = database["bookings"]

async def create_booking(booking_data: Dict[str, Any]) -> Dict[str, Any]:
    result = await bookings_collection.insert_one(booking_data)
    booking_data["_id"] = result.inserted_id
    return booking_data

async def get_booking_by_id(booking_id: ObjectId) -> Dict[str, Any] | None:
    return await bookings_collection.find_one({"_id": booking_id})

async def get_bookings_by_client(client_id: ObjectId) -> List[Dict[str, Any]]:
    cursor = bookings_collection.find({"client_id": client_id}).sort("created_at", -1)
    return await cursor.to_list(length=None)

async def get_bookings_by_provider(provider_id: ObjectId) -> List[Dict[str, Any]]:
    cursor = bookings_collection.find({"provider_id": provider_id}).sort("created_at", -1)
    return await cursor.to_list(length=None)

async def update_booking(booking_id: ObjectId, update_data: Dict[str, Any]) -> Dict[str, Any] | None:
    result = await bookings_collection.find_one_and_update(
        {"_id": booking_id},
        {"$set": update_data},
        return_document=True
    )
    return result
