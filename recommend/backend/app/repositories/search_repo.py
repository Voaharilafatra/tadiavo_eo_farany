from bson import ObjectId

from app.database.mongodb import searches_collections
from app.database.mongodb import providers_collection
from app.utils.serilizer import serialize_mongo

from datetime import datetime, timedelta, timezone


async def get_most_searched_categories(
    user_id: ObjectId,
    limit: int = 3,
    days: int = 30,
) -> list[dict]:

    date_limit = datetime.now(timezone.utc) - timedelta(days=days)

    pipeline = [
        # 1. Recherches de cet utilisateur et récentes
        {
            "$match": {
                "user_id": user_id,
                "created_at": {"$gte": date_limit},
                "category_ids": {"$exists": True, "$ne": []},
            }
        },
        # 2. Transformer category_ids en une ligne par catégorie
        {"$unwind": "$category_ids"},
        # 3. Compter les recherches par catégorie
        {
            "$group": {
                "_id": "$category_ids",
                "search_count": {"$sum": 1},
                "last_searched_at": {"$max": "$created_at"},
            }
        },
        # 4. D'abord fréquence, puis récence
        {
            "$sort": {
                "search_count": -1,
                "last_searched_at": -1,
            }
        },
        # 5. Top catégories
        {"$limit": limit},
    ]

    return await searches_collections.aggregate(pipeline).to_list(length=limit)


async def create_search(search_data: dict) -> dict:
    result = await searches_collections.insert_one(search_data)

    search = await searches_collections.find_one({"_id": result.inserted_id})

    return search


async def search_providers(
    mongo_query: dict,
) -> list[dict]:

    cursor = providers_collection.find(mongo_query)

    providers = await cursor.to_list(length=None)

    return serialize_mongo(providers)
