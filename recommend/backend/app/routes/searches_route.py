from fastapi import APIRouter, Depends

from app.core.security import get_current_user
from app.schemas.searches_schema import NaturalSearchRequest, SearchCriteria
from app.services.searche_service import natural_search, search_providers


router = APIRouter(
    prefix="/search",
    tags=["Search"],
)


@router.post("/classic")
async def search(
    criteria: SearchCriteria,
    user_id: str = Depends(get_current_user),
):
    return await search_providers(
        criteria,
        user_id,
    )


@router.post("/langage_natural")
async def natural_search_route(
    request: NaturalSearchRequest,
    user_id: str = Depends(get_current_user),
):
    return await natural_search(
        request,
        user_id,
    )
