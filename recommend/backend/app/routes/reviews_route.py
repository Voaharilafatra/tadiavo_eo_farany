from fastapi import APIRouter, Depends, status

from app.core.security import get_current_user
from app.schemas.review_schema import ReviewCreate
from app.services.review_service import create_review
from app.services import review_service

router = APIRouter(
    prefix="/reviews",
    tags=["Reviews"],
)


@router.post("/{provider_id}")
async def create_review_route(
    provider_id: str,
    review: ReviewCreate,
    user_id: str = Depends(get_current_user),
):
    return await create_review(
        provider_id=provider_id,
        review=review,
        user_id=user_id,
    )


@router.get("/provider/{provider_id}")
async def get_provider_reviews(
    provider_id: str,
):
    return await review_service.get_provider_reviews(provider_id)


@router.get("/{review_id}")
async def get_review(
    review_id: str,
):
    return await review_service.get_review_by_id_service(review_id)


@router.delete(
    "/{review_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_my_review(
    review_id: str,
    user_id: str = Depends(get_current_user),
):
    await review_service.delete_my_review(
        review_id=review_id,
        user_id=user_id,
    )
