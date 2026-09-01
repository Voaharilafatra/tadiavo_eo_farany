from datetime import datetime

from bson import ObjectId

from app.database.mongodb import (
    profile_views_collection,
    reviews_collection,
)
from app.utils.serilizer import serialize_mongo


async def get_daily_profile_views(
    provider_id: ObjectId,
    start_date: datetime,
    end_date: datetime,
) -> list[dict]:

    pipeline = [
        {
            "$match": {
                "provider_id": provider_id,
                "created_at": {
                    "$gte": start_date,
                    "$lte": end_date,
                },
            }
        },
        {
            "$group": {
                "_id": {
                    "$dateToString": {
                        "format": "%Y-%m-%d",
                        "date": "$created_at",
                    }
                },
                "views": {"$sum": 1},
            }
        },
        {
            "$project": {
                "_id": 0,
                "date": "$_id",
                "views": 1,
            }
        },
        {"$sort": {"date": 1}},
    ]

    return await profile_views_collection.aggregate(pipeline).to_list(length=None)


async def get_reviews_for_dashboard(
    provider_id: ObjectId,
    start_date: datetime,
    end_date: datetime,
) -> list[dict]:

    cursor = reviews_collection.find(
        {
            "provider_id": provider_id,
            "created_at": {
                "$gte": start_date,
                "$lte": end_date,
            },
            "comment": {
                "$exists": True,
                "$nin": [None, ""],
            },
        },
        {
            "_id": 1,
            "user_id": 1,
            "comment": 1,
            "created_at": 1,
        },
    ).sort(
        "created_at",
        -1,
    )

    reviews = await cursor.to_list(length=None)

    return reviews


async def get_review_statistics(
    provider_id: ObjectId,
    start_date: datetime,
    end_date: datetime,
) -> dict:

    pipeline = [
        {
            "$match": {
                "provider_id": provider_id,
                "created_at": {
                    "$gte": start_date,
                    "$lte": end_date,
                },
            }
        },
        {
            "$facet": {
                "general": [
                    {
                        "$group": {
                            "_id": None,
                            "total": {"$sum": 1},
                            "average": {"$avg": "$rating"},
                            "comments": {
                                "$sum": {
                                    "$cond": [
                                        {
                                            "$and": [
                                                {
                                                    "$ne": [
                                                        "$comment",
                                                        None,
                                                    ]
                                                },
                                                {
                                                    "$ne": [
                                                        "$comment",
                                                        "",
                                                    ]
                                                },
                                            ]
                                        },
                                        1,
                                        0,
                                    ]
                                }
                            },
                        }
                    }
                ],
                "distribution": [
                    {"$match": {"rating": {"$in": [1, 2, 3, 4, 5]}}},
                    {
                        "$group": {
                            "_id": "$rating",
                            "count": {"$sum": 1},
                        }
                    },
                    {"$sort": {"_id": 1}},
                ],
            }
        },
    ]

    result = await reviews_collection.aggregate(pipeline).to_list(length=1)

    if not result:
        return {
            "total": 0,
            "average_rating": 0.0,
            "comments_count": 0,
            "distribution": {
                "1": 0,
                "2": 0,
                "3": 0,
                "4": 0,
                "5": 0,
            },
        }

    data = result[0]

    general = (
        data["general"][0]
        if data["general"]
        else {
            "total": 0,
            "average": None,
            "comments": 0,
        }
    )

    distribution = {
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
    }

    for item in data["distribution"]:
        distribution[str(item["_id"])] = item["count"]

    return {
        "total": general["total"],
        "average_rating": round(
            general["average"] or 0,
            2,
        ),
        "comments_count": general["comments"],
        "distribution": distribution,
    }
