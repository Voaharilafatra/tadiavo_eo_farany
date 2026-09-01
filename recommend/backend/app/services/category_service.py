from bson import ObjectId
from fastapi import HTTPException, status

from app.repositories.category_repo import create_category, get_all_main_categories
from app.schemas.category_schema import CategoryCreate
from app.utils.serilizer import serialize_mongo
from app.repositories import category_repo
from datetime import datetime, timezone


async def create_category_service(
    category: CategoryCreate,
) -> dict:
    category_data = category.model_dump()

    # Vérification du nom
    category_data["name"] = category_data["name"].strip()
    print(" les donnees", category_data)
    if not category_data["name"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category name cannot be empty.",
        )

    try:
        return await create_category(category_data)

    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to create category.",
        ) from exc


async def get_main_categories() -> list[dict]:
    categories = await get_all_main_categories()

    return serialize_mongo(categories)


async def fetch_subcategories_by_parent(
    parent_id: str,
) -> list[dict]:

    try:
        parent_object_id = ObjectId(parent_id)

    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid category ID.",
        ) from exc

    # Vérifier que la catégorie parente existe
    parent = await category_repo.get_category_by_id(parent_object_id)

    if parent is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Parent category not found.",
        )

    subcategories = await category_repo.get_subcategories_by_parent_id(parent_object_id)

    return serialize_mongo(subcategories)


async def add_subcategory_to_category(
    parent_id: str,
    subcategory: CategoryCreate,
) -> dict:

    # --------------------------------
    # 1. Vérifier le parent_id
    # --------------------------------

    try:
        parent_object_id = ObjectId(parent_id)

    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid parent category ID.",
        ) from exc

    # --------------------------------
    # 2. Vérifier que le parent existe
    # --------------------------------

    parent = await category_repo.get_category_by_id(parent_object_id)

    if parent is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Parent category not found.",
        )

    # --------------------------------
    # 3. Vérifier que le parent
    #    est bien une catégorie principale
    # --------------------------------

    if parent.get("parent_id") is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=("A subcategory cannot have another subcategory as parent."),
        )

    # --------------------------------
    # 4. Préparer le document
    # --------------------------------

    now = datetime.now(timezone.utc)

    subcategory_data = subcategory.model_dump()

    subcategory_data["parent_id"] = parent_object_id
    subcategory_data["created_at"] = now
    subcategory_data["updated_at"] = now

    # --------------------------------
    # 5. Créer la sous-catégorie
    # --------------------------------

    created_subcategory = await category_repo.create_subcategory(subcategory_data)

    return serialize_mongo(created_subcategory)
