import asyncio

from bson import ObjectId
from datetime import datetime, timezone

from fastapi import HTTPException, status
from app.repositories import user_repo
from app.schemas.review_schema import ReviewCreate
from app.repositories import review_repo
from app.repositories import provider_repo
from app.services.ai_service import analyze_comment
from app.services.service_service import apply_ai_service_ratings
from app.repositories import service_repo
from app.utils.serilizer import serialize_mongo


async def create_review(
    provider_id: str,
    review: ReviewCreate,
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
    # 2. Vérifier le contenu de la review
    # --------------------------------

    if review.rating is None and not review.comment:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A rating or a comment is required.",
        )

    # --------------------------------
    # 3. Vérifier que le provider existe
    # --------------------------------

    provider = await provider_repo.get_provider(provider_object_id)

    if not provider:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Provider not found.",
        )

    # --------------------------------
    # 4. Mettre à jour le rating global
    # --------------------------------

    if review.rating is not None:
        await provider_repo.update_provider_rating(
            provider_id=provider_object_id,
            rating=review.rating,
        )

    # --------------------------------
    # 5. Analyser le commentaire
    # --------------------------------

    ai_service_ratings = []

    if review.comment:
        services = provider.get("services", [])

        if services:
            try:
                ai_result = await analyze_comment(
                    comment=review.comment,
                    services=services,
                )

                ai_service_ratings = await apply_ai_service_ratings(
                    provider_id=provider_object_id,
                    ai_results=ai_result,
                )

            except Exception as exc:
                print(f"AI analysis failed: {exc}")

    # --------------------------------
    # 6. Préparer la review
    # --------------------------------

    review_data = {
        "provider_id": provider_object_id,
        "user_id": user_object_id,
        "created_at": datetime.now(timezone.utc),
    }

    if review.rating is not None:
        review_data["rating"] = review.rating

    if review.comment:
        review_data["comment"] = review.comment

    if ai_service_ratings:
        review_data["ai_service_ratings"] = ai_service_ratings

    # --------------------------------
    # 7. Enregistrer la review
    # --------------------------------

    return await review_repo.create_review(review_data)


async def delete_my_review(
    review_id: str,
    user_id: str,
) -> None:

    # --------------------------------
    # 1. Vérifier les IDs
    # --------------------------------

    try:
        review_object_id = ObjectId(review_id)
        user_object_id = ObjectId(user_id)

    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid ID.",
        ) from exc

    # --------------------------------
    # 2. Récupérer la review
    # --------------------------------

    review = await review_repo.get_review_by_id(review_object_id)

    if review is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found.",
        )

    # --------------------------------
    # 3. Vérifier que l'utilisateur
    #    est bien l'auteur
    # --------------------------------

    if review["user_id"] != user_object_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own review.",
        )

    provider_id = review["provider_id"]

    # --------------------------------
    # 4. Annuler le rating global
    # --------------------------------

    if review.get("rating") is not None:
        await provider_repo.remove_provider_rating(
            provider_id=provider_id,
            rating=review["rating"],
        )

    # --------------------------------
    # 5. Annuler les effets Gemini
    # --------------------------------

    ai_service_ratings = review.get(
        "ai_service_ratings",
        [],
    )

    for service_rating in ai_service_ratings:
        await service_repo.remove_service_rating(
            provider_id=provider_id,
            service_id=ObjectId(service_rating["service_id"]),
            rating=service_rating["rating"],
        )

    # --------------------------------
    # 6. Supprimer la review
    # --------------------------------

    deleted = await review_repo.delete_review(review_object_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to delete review.",
        )


async def get_provider_reviews(
    provider_id: str,
) -> list[dict]:

    try:
        provider_object_id = ObjectId(provider_id)

    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid provider ID.",
        ) from exc

    provider = await provider_repo.get_provider(provider_object_id)

    if provider is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Provider not found.",
        )

    reviews = await review_repo.get_reviews_by_provider(provider_object_id)

    if not reviews:
        return []

    # --------------------------------
    # 4. Récupérer les utilisateurs
    #    en parallèle
    # --------------------------------

    user_tasks = [
        user_repo.get_user_by_id(review["user_id"])
        for review in reviews
        if review.get("user_id")
    ]

    users = await asyncio.gather(*user_tasks)

    # --------------------------------
    # 5. Construire la réponse
    # --------------------------------

    result = []

    user_index = 0

    for review in reviews:
        user = None

        if review.get("user_id"):
            user = users[user_index]
            user_index += 1

        result.append(
            {
                "id": review["_id"],
                "rating": review.get("rating"),
                "comment": review.get("comment"),
                "created_at": review.get("created_at"),
                "user": {
                    "name": user.get("name") if user else "Utilisateur",
                    "picture": user.get("picture") if user else None,
                },
            }
        )

    return serialize_mongo(result)


async def get_review_by_id_service(
    review_id: str,
) -> dict:

    # --------------------------------
    # 1. Vérifier l'ID
    # --------------------------------

    try:
        review_object_id = ObjectId(review_id)

    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid review ID.",
        ) from exc

    # --------------------------------
    # 2. Récupérer la review
    # --------------------------------

    review = await review_repo.get_review_by_id(review_object_id)

    if review is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found.",
        )

    # --------------------------------
    # 3. Retourner la review sérialisée
    # --------------------------------

    return serialize_mongo(review)
