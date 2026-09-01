from fastapi import APIRouter, status

from app.schemas.category_schema import CategoryCreate
from app.services import category_service


router = APIRouter(
    prefix="/categories",
    tags=["Categories"],
)


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
)
async def create_category(
    category: CategoryCreate,
):
    return await category_service.create_category_service(category)


@router.post("/{parent_id}/subcategories")
async def create_subcategory(
    parent_id: str,
    subcategory: CategoryCreate,
):
    return await category_service.add_subcategory_to_category(
        parent_id=parent_id,
        subcategory=subcategory,
    )


@router.get("/main_categories")
async def get_main_categories():
    return await category_service.get_main_categories()


@router.get("/{parent_id}/subcategories")
async def get_subcategories(
    parent_id: str,
):
    return await category_service.fetch_subcategories_by_parent(parent_id)
