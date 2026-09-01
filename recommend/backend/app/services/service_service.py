from bson import ObjectId
from fastapi import HTTPException, status

from app.repositories.service_repo import update_service_rating


def sentiment_to_rating(score: int) -> int:

    mapping = {
        -2: 1,
        -1: 2,
        0: 3,
        1: 4,
        2: 5,
    }

    if score not in mapping:
        raise ValueError("AI score must be between -2 and 2.")

    return mapping[score]


async def apply_ai_service_ratings(
    provider_id: str,
    ai_results,
):
    try:
        provider_object_id = ObjectId(provider_id)

    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid provider ID.",
        ) from exc

    results = []

    for analysis in ai_results.services:
        try:
            service_object_id = ObjectId(analysis.service_id)

        except Exception:
            # Gemini a retourné un ID invalide
            continue

        rating = sentiment_to_rating(analysis.score)

        provider = await update_service_rating(
            provider_id=provider_object_id,
            service_id=service_object_id,
            new_rating=rating,
        )

        if provider is not None:
            results.append(
                {
                    "service_id": analysis.service_id,
                    "rating": rating,
                }
            )

    return results
