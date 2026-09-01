from bson import ObjectId

from app.database.mongodb import providers_collection


async def update_service_rating(
    provider_id: ObjectId,
    service_id: ObjectId,
    new_rating: int,
) -> dict | None:

    # 1. Récupérer le provider
    provider = await providers_collection.find_one(
        {
            "_id": provider_id,
            "services.id": service_id,
        }
    )

    if provider is None:
        return None

    # 2. Trouver le service concerné
    service = next(
        (service for service in provider["services"] if service["id"] == service_id),
        None,
    )

    if service is None:
        return None

    # 3. Récupérer l'ancien rating
    rating = service.get(
        "rating",
        {
            "average": 0.0,
            "count": 0,
        },
    )

    old_average = rating.get("average", 0.0)
    old_count = rating.get("count", 0)

    # 4. Calculer le nouveau rating
    new_count = old_count + 1

    new_average = ((old_average * old_count) + new_rating) / new_count

    # 5. Mettre à jour le service
    result = await providers_collection.update_one(
        {
            "_id": provider_id,
            "services.id": service_id,
        },
        {
            "$set": {
                "services.$.rating.average": new_average,
                "services.$.rating.count": new_count,
            }
        },
    )

    if result.modified_count == 0:
        return None

    # 6. Retourner le provider mis à jour
    return await providers_collection.find_one({"_id": provider_id})
