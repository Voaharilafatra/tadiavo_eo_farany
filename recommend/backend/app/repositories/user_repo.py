from bson import ObjectId
from app.database.mongodb import users_collection


async def get_user_by_google_id(
    google_id: str,
) -> dict | None:

    return await users_collection.find_one({"google_id": google_id})


async def get_user_by_id(
    user_id: ObjectId,
) -> dict | None:

    return await users_collection.find_one({"_id": user_id})


async def create_user(
    user_data: dict,
) -> dict:
    if "status" not in user_data:
        user_data["status"] = "active"
    result = await users_collection.insert_one(user_data)
    return await users_collection.find_one({"_id": result.inserted_id})

async def add_provider_role(
    user_id: ObjectId,
) -> bool:
    result = await users_collection.update_one(
        {"_id": user_id},
        {"$set": {"role": "prestataire"}}
    )
    return result.modified_count > 0

async def toggle_favorite(user_id: ObjectId, provider_id: ObjectId, add: bool) -> bool:
    if add:
        result = await users_collection.update_one(
            {"_id": user_id},
            {"$addToSet": {"favorites": provider_id}}
        )
    else:
        result = await users_collection.update_one(
            {"_id": user_id},
            {"$pull": {"favorites": provider_id}}
        )
    return result.modified_count > 0

async def get_all_users() -> list[dict]:
    cursor = users_collection.find()
    return await cursor.to_list(length=None)

async def update_role(user_id: ObjectId, role: str) -> bool:
    result = await users_collection.update_one(
        {"_id": user_id},
        {"$set": {"role": role}}
    )
    return result.modified_count > 0

async def update_status(user_id: ObjectId, status: str) -> bool:
    result = await users_collection.update_one(
        {"_id": user_id},
        {"$set": {"status": status}}
    )
    return result.modified_count > 0

async def update_user_profile(user_id: ObjectId, update_data: dict) -> bool:
    result = await users_collection.update_one(
        {"_id": user_id},
        {"$set": update_data}
    )
    return result.modified_count > 0
