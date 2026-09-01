from app.database.mongodb import providers_collection
from app.utils.serilizer import serialize_mongo
from bson import ObjectId
from datetime import datetime, timezone

from app.database.mongodb import profile_views_collection


async def create_provider(provider: dict) -> dict:

    result = await providers_collection.insert_one(provider)

    provider["_id"] = result.inserted_id

    return serialize_mongo(provider)


async def get_provider(provider_id):
    return await providers_collection.find_one({"_id": provider_id})


async def get_top_providers_by_categories(
    category_ids: list[str],
    limit: int = 10,
) -> list[dict]:

    cursor = (
        providers_collection.find(
            {
                "categories.id": {"$in": category_ids},
                "status": "active",
            }
        )
        .sort("rating.average", -1)
        .limit(limit)
    )
    providers = await cursor.to_list(length=limit)

    print("PROVIDERS =", providers)

    return serialize_mongo(providers)


async def update_provider_rating(
    provider_id: ObjectId,
    rating: float,
) -> None:

    await providers_collection.update_one(
        {"_id": provider_id},
        [
            {
                "$set": {
                    "rating.sum": {
                        "$add": [
                            {"$ifNull": ["$rating.sum", 0]},
                            rating,
                        ]
                    },
                    "rating.count": {
                        "$add": [
                            {"$ifNull": ["$rating.count", 0]},
                            1,
                        ]
                    },
                }
            },
            {
                "$set": {
                    "rating.average": {
                        "$divide": [
                            "$rating.sum",
                            "$rating.count",
                        ]
                    }
                }
            },
        ],
    )


async def get_provider_services(
    provider_id: ObjectId,
) -> list[dict] | None:

    provider = await providers_collection.find_one(
        {"_id": provider_id},
        {
            "_id": 0,
            "services": 1,
        },
    )

    if provider is None:
        return None

    return provider.get("services", [])


async def add_service_to_provider(
    provider_id: ObjectId,
    service_data: dict,
) -> dict | None:

    result = await providers_collection.update_one(
        {
            "_id": provider_id,
        },
        {"$push": {"services": service_data}},
    )

    if result.matched_count == 0:
        return None

    return await providers_collection.find_one({"_id": provider_id})


async def get_service_by_id(
    provider_id: ObjectId,
    service_id: ObjectId,
) -> dict | None:

    provider = await providers_collection.find_one(
        {
            "_id": provider_id,
            "services.id": service_id,
        },
        {
            "services": 1,
        },
    )

    if provider is None:
        return None

    for service in provider.get("services", []):
        if service["id"] == service_id:
            return service

    return None


async def update_service(
    service_id: ObjectId,
    owner_id: ObjectId,
    service_data: dict,
) -> dict | None:

    result = await providers_collection.update_one(
        {
            "owner_id": owner_id,
            "services.id": service_id,
        },
        {
            "$set": {
                "services.$.name": service_data["name"],
                "services.$.description": service_data["description"],
                "services.$.price": service_data["price"],
                "services.$.updated_at": service_data["updated_at"],
            }
        },
    )

    if result.matched_count == 0:
        return None

    provider = await providers_collection.find_one(
        {
            "owner_id": owner_id,
            "services.id": service_id,
        },
        {
            "services": 1,
        },
    )

    if provider is None:
        return None

    for service in provider.get("services", []):
        if service["id"] == service_id:
            return service

    return None


async def patch_service(
    service_id: ObjectId,
    owner_id: ObjectId,
    update_data: dict,
) -> dict | None:

    mongo_update = {}

    for field, value in update_data.items():
        mongo_update[f"services.$.{field}"] = value

    if not mongo_update:
        return None

    result = await providers_collection.update_one(
        {
            "owner_id": owner_id,
            "services.id": service_id,
        },
        {"$set": mongo_update},
    )

    if result.matched_count == 0:
        return None

    provider = await providers_collection.find_one(
        {
            "owner_id": owner_id,
            "services.id": service_id,
        },
        {
            "services": 1,
        },
    )

    if provider is None:
        return None

    for service in provider.get("services", []):
        if service["id"] == service_id:
            return service

    return None


async def delete_service(
    service_id: ObjectId,
    owner_id: ObjectId,
) -> bool:

    result = await providers_collection.update_one(
        {
            "owner_id": owner_id,
            "services.id": service_id,
        },
        {"$pull": {"services": {"id": service_id}}},
    )

    return result.modified_count > 0


async def get_provider_by_id(
    provider_id: ObjectId,
) -> dict | None:

    return await providers_collection.find_one(
        {
            "_id": provider_id,
            "status": "active",
        }
    )

async def add_image(provider_id: ObjectId, owner_id: ObjectId, image_url: str) -> bool:
    result = await providers_collection.update_one(
        {"_id": provider_id, "owner_id": owner_id},
        {"$push": {"images": image_url}}
    )
    return result.modified_count > 0

async def remove_provider_rating(
    provider_id: ObjectId,
    rating: float,
) -> bool:

    result = await providers_collection.update_one(
        {
            "_id": provider_id,
            "rating.count": {"$gt": 0},
        },
        [
            {
                "$set": {
                    "rating.sum": {
                        "$subtract": [
                            {"$ifNull": ["$rating.sum", 0]},
                            rating,
                        ]
                    },
                    "rating.count": {
                        "$subtract": [
                            "$rating.count",
                            1,
                        ]
                    },
                }
            },
            {
                "$set": {
                    "rating.average": {
                        "$cond": [
                            {
                                "$gt": [
                                    "$rating.count",
                                    0,
                                ]
                            },
                            {
                                "$divide": [
                                    "$rating.sum",
                                    "$rating.count",
                                ]
                            },
                            0,
                        ]
                    }
                }
            },
        ],
    )

    return result.modified_count > 0


async def remove_service_rating(
    provider_id: ObjectId,
    service_id: ObjectId,
    rating: float,
) -> bool:

    provider = await providers_collection.find_one(
        {
            "_id": provider_id,
            "services.id": service_id,
        }
    )

    if provider is None:
        return False

    service = next(
        (item for item in provider.get("services", []) if item["id"] == service_id),
        None,
    )

    if service is None:
        return False

    old_rating = service.get(
        "rating",
        {
            "sum": 0,
            "count": 0,
            "average": 0.0,
        },
    )

    old_sum = old_rating.get("sum", 0)
    old_count = old_rating.get("count", 0)

    if old_count <= 0:
        return False

    new_sum = old_sum - rating
    new_count = old_count - 1

    new_average = new_sum / new_count if new_count > 0 else 0.0

    result = await providers_collection.update_one(
        {
            "_id": provider_id,
            "services.id": service_id,
        },
        {
            "$set": {
                "services.$.rating.sum": new_sum,
                "services.$.rating.count": new_count,
                "services.$.rating.average": new_average,
            }
        },
    )

    return result.modified_count > 0


async def create_profile_view(
    provider_id,
    user_id=None,
) -> None:

    await profile_views_collection.insert_one(
        {
            "provider_id": provider_id,
            "user_id": user_id,
            "created_at": datetime.now(timezone.utc),
        }
    )


async def get_providers_by_owner(owner_id: ObjectId) -> list[dict]:
    cursor = providers_collection.find({"owner_id": owner_id, "status": "active"})
    return await cursor.to_list(length=None)

async def get_all_providers(skip: int = 0, limit: int = 100) -> list[dict]:
    cursor = providers_collection.find({"status": "active"}).skip(skip).limit(limit)

    return await cursor.to_list(length=limit)

async def delete_provider(provider_id: ObjectId) -> bool:
    result = await providers_collection.delete_one({"_id": provider_id})
    return result.deleted_count > 0

