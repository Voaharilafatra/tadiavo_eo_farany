from bson import ObjectId

from app.database.mongodb import categories_collection
from app.utils.serilizer import serialize_mongo, serialize_mongo_list


async def get_categories_by_ids(
    category_ids: list[ObjectId],
) -> list[dict]:

    cursor = categories_collection.find({"_id": {"$in": category_ids}})

    categories = await cursor.to_list(length=None)

    return serialize_mongo_list(categories)


async def create_category(category_data: dict) -> dict:
    result = await categories_collection.insert_one(category_data)

    category = await categories_collection.find_one({"_id": result.inserted_id})

    return serialize_mongo(category)


async def get_categories_by_slugs(
    slugs: list[str],
) -> list[dict]:

    cursor = categories_collection.find({"slug": {"$in": slugs}})

    return await cursor.to_list(length=None)


async def get_available_category_slugs() -> list[str]:
    slugs = await categories_collection.distinct(
        "slug",
        {
            "slug": {
                "$exists": True,
                "$ne": None,
            }
        },
    )

    return sorted(slugs)


async def get_all_main_categories() -> list[dict]:
    cursor = categories_collection.find({"parent_id": None})

    return await cursor.to_list(length=None)


async def get_category_by_id(
    category_id: ObjectId,
) -> dict | None:

    return await categories_collection.find_one({"_id": category_id})


async def get_subcategories_by_parent_id(
    parent_id: ObjectId,
) -> list[dict]:

    cursor = categories_collection.find({"parent_id": parent_id}).sort("name", 1)

    return await cursor.to_list(length=None)


async def create_subcategory(
    subcategory_data: dict,
) -> dict:

    result = await categories_collection.insert_one(subcategory_data)

    return await categories_collection.find_one({"_id": result.inserted_id})
