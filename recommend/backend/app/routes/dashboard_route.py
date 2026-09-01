from fastapi import APIRouter, Depends

from app.core.security import get_current_user
from app.services.dashboard_service import (
    get_provider_dashboard,
)


router = APIRouter(
    prefix="/prestataires",
    tags=["Dashboard"],
)


@router.get(
    "/{provider_id}/dashboard",
    summary="Dashboard du prestataire",
    description=(
        "Retourne les statistiques des 30 derniers jours : "
        "visites quotidiennes et statistiques des avis."
    ),
)
async def get_dashboard(
    provider_id: str,
    user_id: str = Depends(get_current_user),
):
    return await get_provider_dashboard(
        provider_id=provider_id,
        user_id=user_id,
    )
