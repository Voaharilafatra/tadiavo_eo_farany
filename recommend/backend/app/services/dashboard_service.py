from datetime import datetime, timedelta, timezone

from bson import ObjectId
from fastapi import HTTPException, status

from app.repositories import dashboard_repo
from app.repositories import provider_repo
from app.repositories import user_repo
from app.utils.serilizer import serialize_mongo


async def get_provider_dashboard(
    provider_id: str,
    user_id: str,
) -> dict:

    # --------------------------------
    # 1. Vérifier les IDs
    # --------------------------------

    try:
        provider_object_id = ObjectId(provider_id)

        user_object_id = ObjectId(user_id)

    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid ID.",
        ) from exc

    # --------------------------------
    # 2. Vérifier le provider
    # --------------------------------

    provider = await provider_repo.get_provider_by_id(provider_object_id)

    if provider is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Provider not found.",
        )

    # --------------------------------
    # 3. Vérifier le propriétaire
    # --------------------------------

    if provider.get("owner_id") != user_object_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not own this provider.",
        )

    # --------------------------------
    # 4. Définir la période
    # --------------------------------

    end_date = datetime.now(timezone.utc)

    start_date = end_date - timedelta(days=30)

    # --------------------------------
    # 5. Récupérer les visites
    # --------------------------------

    daily_views = await dashboard_repo.get_daily_profile_views(
        provider_object_id,
        start_date,
        end_date,
    )

    # --------------------------------
    # 6. Récupérer les reviews
    # --------------------------------

    reviews = await dashboard_repo.get_reviews_for_dashboard(
        provider_object_id,
        start_date,
        end_date,
    )

    # --------------------------------
    # 7. Enrichir les reviews
    #    avec nom + photo
    # --------------------------------

    enriched_reviews = []

    for review in reviews:
        user = None

        if review.get("user_id"):
            user = await user_repo.get_user_by_id(review["user_id"])

        enriched_reviews.append(
            {
                "id": review["_id"],
                "rating": review.get("rating"),
                "comment": review.get("comment"),
                "created_at": review.get("created_at"),
                "user": {
                    "name": (user.get("name") if user else "Utilisateur"),
                    "picture": (user.get("picture") if user else None),
                },
            }
        )

    # --------------------------------
    # 8. Statistiques des reviews
    # --------------------------------

    review_stats = await dashboard_repo.get_review_statistics(
        provider_object_id,
        start_date,
        end_date,
    )

    # --------------------------------
    # 9. Retourner le dashboard
    # --------------------------------

    return serialize_mongo(
        {
            "period": {
                "start": start_date,
                "end": end_date,
            },
            "views": {
                "total": sum(item["views"] for item in daily_views),
                "daily": daily_views,
            },
            "reviews": {
                "statistics": review_stats,
                "items": enriched_reviews,
            },
        }
    )
