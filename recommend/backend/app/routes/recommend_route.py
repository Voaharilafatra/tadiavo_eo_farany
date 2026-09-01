from fastapi import APIRouter, Depends

from app.services.recommend_service import (
    get_personalized_recommendations,
)

from app.core.security import get_current_user


router = APIRouter(
    prefix="/recommendations",
    tags=["Recommendations"],
)


@router.get("/for_me")
async def get_my_recommendations(
    current_user=Depends(get_current_user),
):

    user_id = str(current_user)

    return await get_personalized_recommendations(user_id)
