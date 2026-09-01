from bson import ObjectId
from fastapi import HTTPException, status

from app.repositories.search_repo import (
    get_most_searched_categories,
)

from app.repositories.provider_repo import (
    get_top_providers_by_categories,
)


async def get_personalized_recommendations(
    user_id: str,
) -> list[dict]:

    try:
        user_object_id = ObjectId(user_id)

    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID.",
        ) from exc

    # 1. Catégories les plus recherchées
    categories = await get_most_searched_categories(
        user_object_id,
        limit=3,
        days=3,
    )

    print("les categories", categories)

    # Aucun historique
    if not categories:
        return []

    # Les providers stockent actuellement
    # categories.id sous forme de string
    category_ids = [str(category["_id"]) for category in categories]

    print("category_ids pour providers =", category_ids)

    # 2. Meilleurs providers
    providers = await get_top_providers_by_categories(
        category_ids,
        limit=10,
    )

    return providers
