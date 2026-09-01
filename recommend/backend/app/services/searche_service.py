from app.schemas.searches_schema import NaturalSearchRequest, SearchCriteria
from app.repositories import search_repo


from datetime import datetime, timezone

from bson import ObjectId

from app.schemas.searches_schema import SearchCriteria
from fastapi import HTTPException, status

from app.repositories import category_repo
from app.schemas.searches_schema import (
    AIExtractedSearch,
    SearchCriteria,
    SearchLocation,
)
from app.services.ai_service import extract_search_criteria
from fastapi import HTTPException, status


def build_search_document(
    criteria: SearchCriteria,
    user_id: str,
) -> dict:

    search_data = {
        "user_id": ObjectId(user_id),
        "created_at": datetime.now(timezone.utc),
    }

    # -----------------------------
    # Catégories
    # -----------------------------

    if criteria.category_ids:
        search_data["category_ids"] = [
            ObjectId(category_id) for category_id in criteria.category_ids
        ]

    # -----------------------------
    # Service recherché
    # -----------------------------

    if criteria.service:
        search_data["service"] = criteria.service

    # -----------------------------
    # Filtres
    # -----------------------------

    filters = {}

    if criteria.city:
        filters["city"] = criteria.city

    if criteria.neighborhood:
        filters["neighborhood"] = criteria.neighborhood

    if criteria.max_price is not None:
        filters["max_price"] = criteria.max_price

    if criteria.min_rating is not None:
        filters["min_rating"] = criteria.min_rating

    if criteria.features:
        filters["features"] = criteria.features

    if filters:
        search_data["filters"] = filters

    # -----------------------------
    # Localisation
    # -----------------------------

    if criteria.location:
        if (
            criteria.location.latitude is not None
            and criteria.location.longitude is not None
        ):
            search_data["location"] = {
                "type": "Point",
                "coordinates": [
                    criteria.location.longitude,
                    criteria.location.latitude,
                ],
            }

        if criteria.location.radius is not None:
            search_data["radius"] = criteria.location.radius

    # -----------------------------
    # Rayon
    # -----------------------------

    return search_data


async def search_providers(
    criteria: SearchCriteria,
    user_id: str,
) -> list[dict]:

    # -----------------------------
    # Historique
    # -----------------------------

    search_data = build_search_document(
        criteria,
        user_id,
    )

    try:
        await search_repo.create_search(search_data)
    except Exception as exc:
        print(f"Unable to save search history: {exc}")

    # -----------------------------
    # Requête MongoDB
    # -----------------------------

    mongo_query = {"status": "active"}

    # Ville
    if criteria.city:
        mongo_query["address.municipality"] = criteria.city

    # Quartier
    if criteria.neighborhood:
        mongo_query["address.neighborhood"] = criteria.neighborhood

    # Catégories
    if criteria.category_ids:
        mongo_query["categories.id"] = {"$in": criteria.category_ids}

    # Features
    if criteria.features:
        mongo_query["features"] = {"$all": criteria.features}

    # Note
    if criteria.min_rating is not None:
        mongo_query["rating.average"] = {"$gte": criteria.min_rating}

    # Service + prix
    if criteria.service and criteria.max_price is not None:
        mongo_query["services"] = {
            "$elemMatch": {
                "$or": [
                    {
                        "name": {
                            "$regex": criteria.service,
                            "$options": "i",
                        }
                    },
                    {
                        "description": {
                            "$regex": criteria.service,
                            "$options": "i",
                        }
                    },
                ],
                "price.avg": {"$lte": criteria.max_price},
            }
        }

    # Service sans prix
    elif criteria.service:
        mongo_query["services"] = {
            "$elemMatch": {
                "$or": [
                    {
                        "name": {
                            "$regex": criteria.service,
                            "$options": "i",
                        }
                    },
                    {
                        "description": {
                            "$regex": criteria.service,
                            "$options": "i",
                        }
                    },
                ]
            }
        }

    # Proximité
    if criteria.location:
        location = criteria.location

        if location.latitude is not None and location.longitude is not None:
            mongo_query["location"] = {
                "$near": {
                    "$geometry": {
                        "type": "Point",
                        "coordinates": [
                            location.longitude,
                            location.latitude,
                        ],
                    },
                    "$maxDistance": location.radius,
                }
            }
    print("category_ids reçus :", criteria.category_ids)
    print("mongo_query :", mongo_query)
    return await search_repo.search_providers(mongo_query)


async def ai_result_to_search_criteria(
    extracted: AIExtractedSearch,
) -> SearchCriteria:

    # --------------------------------
    # 1. Résoudre les catégories
    # --------------------------------

    category_ids = None

    if extracted.category_slugs:
        categories = await category_repo.get_categories_by_slugs(
            extracted.category_slugs
        )

        found_slugs = {category["slug"] for category in categories}

        missing_slugs = [
            slug for slug in extracted.category_slugs if slug not in found_slugs
        ]

        if missing_slugs:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=(f"Category not found: {', '.join(missing_slugs)}"),
            )

        category_ids = [str(category["_id"]) for category in categories]

    # --------------------------------
    # 2. Construire la localisation
    # --------------------------------

    location = None

    if extracted.location:
        location = SearchLocation(
            place_name=extracted.location.place_name,
            latitude=extracted.location.latitude,
            longitude=extracted.location.longitude,
            radius=extracted.location.radius,
        )

    # --------------------------------
    # 3. Construire SearchCriteria
    # --------------------------------

    return SearchCriteria(
        category_ids=category_ids,
        service=extracted.service,
        city=extracted.city,
        neighborhood=extracted.neighborhood,
        location=location,
        max_price=extracted.max_price,
        min_rating=extracted.min_rating,
        features=extracted.features,
    )


async def natural_search(
    request: NaturalSearchRequest,
    user_id: str,
) -> dict:

    # 1. Comprendre le texte
    extracted = await extract_search_criteria(request.query)

    # 2. Transformer en critères classiques
    criteria = await ai_result_to_search_criteria(extracted)

    # 3. Réutiliser la recherche existante
    providers = await search_providers(
        criteria,
        user_id,
    )

    return {
        "criteria": extracted.model_dump(),
        "providers": providers
    }
