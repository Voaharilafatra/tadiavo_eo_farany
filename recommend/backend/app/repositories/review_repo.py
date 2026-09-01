from app.utils.serilizer import serialize_mongo
from app.database.mongodb import reviews_collection
from bson import ObjectId


async def create_review(review_data: dict) -> dict:

    result = await reviews_collection.insert_one(review_data)

    review = await reviews_collection.find_one({"_id": result.inserted_id})

    return serialize_mongo(review)


async def get_review_by_id(
    review_id: ObjectId,
) -> dict | None:

    return await reviews_collection.find_one({"_id": review_id})


async def delete_review(
    review_id: ObjectId,
) -> bool:

    result = await reviews_collection.delete_one({"_id": review_id})

    return result.deleted_count == 1


async def get_reviews_by_provider(
    provider_id: ObjectId,
) -> list[dict]:

    cursor = reviews_collection.find(
        {
            "provider_id": provider_id,
            "comment": {
                "$exists": True,
                "$nin": [None, ""],
            },
        },
        {
            "_id": 1,
            "user_id": 1,
            "rating": 1,
            "comment": 1,
            "created_at": 1,
        },
    ).sort("created_at", -1)

    reviews = await cursor.to_list(length=None)

    return serialize_mongo(reviews)
