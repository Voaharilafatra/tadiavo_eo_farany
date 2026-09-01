from bson import ObjectId
from datetime import datetime, timezone

from fastapi import HTTPException, status

from app.repositories import provider_repo
from app.schemas.provider_schema import ProviderCreate
from app.repositories.category_repo import get_categories_by_ids
from app.utils.serilizer import serialize_mongo
from app.schemas.service import ServiceCreate, ServicePatch, ServiceUpdate
from app.repositories import user_repo


async def create_provider(
    provider: ProviderCreate,
    user_id: str,
) -> dict:
    # --------------------------------
    # 1. Convertir les IDs
    # --------------------------------

    try:
        category_object_ids = [
            ObjectId(category_id) for category_id in provider.category_ids
        ]

    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="One or more category IDs are invalid.",
        ) from exc

    # --------------------------------
    # 2. Chercher les catégories
    # --------------------------------

    categories = await get_categories_by_ids(category_object_ids)

    # --------------------------------
    # 3. Vérifier qu'elles existent
    # --------------------------------

    if len(categories) != len(category_object_ids):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="One or more categories were not found.",
        )
    now = datetime.now(timezone.utc)
    # --------------------------------
    # 4. Préparer le document
    # --------------------------------

    provider_data = provider.model_dump()

    provider_data.pop("category_ids")

    provider_data["categories"] = [
        {
            "id": category["_id"],
            "name": category["name"],
            "slug": category["slug"],
        }
        for category in categories
    ]

    provider_data["owner_id"] = ObjectId(user_id)

    provider_data["status"] = "active"

    provider_data["rating"] = {
        "average": 0.0,
        "count": 0,
    }

    provider_data["images"] = []

    provider_data["created_at"] = now
    provider_data["updated_at"] = now

    for service in provider_data["services"]:
        service["id"] = ObjectId()

        service["rating"] = {"average": 0.0, "count": 0, "sum": 0}

    created_provider = await provider_repo.create_provider(provider_data)

    await user_repo.add_provider_role(ObjectId(user_id))
    return created_provider


async def get_services_by_provider(
    provider_id: str,
) -> list[dict]:

    try:
        provider_object_id = ObjectId(provider_id)

    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid provider ID.",
        ) from exc

    services = await provider_repo.get_provider_services(provider_object_id)

    if services is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Provider not found.",
        )

    return serialize_mongo(services)


async def add_service_to_provider(
    provider_id: str,
    service: ServiceCreate,
) -> dict:

    # -------------------------------
    # 1. Vérifier le provider_id
    # -------------------------------

    try:
        provider_object_id = ObjectId(provider_id)

    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid provider ID.",
        ) from exc

    # -------------------------------
    # 2. Préparer le service
    # -------------------------------

    service_data = {
        "id": ObjectId(),
        "name": service.name,
        "description": service.description,
        "price": service.price.model_dump(),
        "rating": {
            "average": 0.0,
            "count": 0,
            "sum": 0,
        },
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }

    # -------------------------------
    # 3. Ajouter dans MongoDB
    # -------------------------------

    provider = await provider_repo.add_service_to_provider(
        provider_id=provider_object_id,
        service_data=service_data,
    )

    if provider is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Provider not found.",
        )

    # -------------------------------
    # 4. Retourner uniquement le service créé
    # -------------------------------

    created_service = next(
        (item for item in provider["services"] if item["id"] == service_data["id"]),
        None,
    )

    return serialize_mongo(created_service)


async def get_service_by_id(
    provider_id: str,
    service_id: str,
) -> dict:

    # Vérifier provider_id
    try:
        provider_object_id = ObjectId(provider_id)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid provider ID.",
        ) from exc

    # Vérifier service_id
    try:
        service_object_id = ObjectId(service_id)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid service ID.",
        ) from exc

    service = await provider_repo.get_service_by_id(
        provider_id=provider_object_id,
        service_id=service_object_id,
    )

    if service is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found.",
        )

    return serialize_mongo(service)


async def replace_service(
    service_id: str,
    owner_id: str,
    service: ServiceUpdate,
) -> dict:

    try:
        service_object_id = ObjectId(service_id)
        owner_object_id = ObjectId(owner_id)

    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid ID.",
        ) from exc

    service_data = {
        "name": service.name,
        "description": service.description,
        "price": service.price.model_dump(),
        "updated_at": datetime.now(timezone.utc),
    }

    updated_service = await provider_repo.update_service(
        service_id=service_object_id,
        owner_id=owner_object_id,
        service_data=service_data,
    )

    if updated_service is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found or not owned by current user.",
        )

    return serialize_mongo(updated_service)


async def partially_update_service(
    service_id: str,
    owner_id: str,
    service: ServicePatch,
) -> dict:

    try:
        service_object_id = ObjectId(service_id)
        owner_object_id = ObjectId(owner_id)

    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid ID.",
        ) from exc

    update_data = service.model_dump(exclude_unset=True)

    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields provided for update.",
        )

    if "price" in update_data and update_data["price"] is not None:
        update_data["price"] = update_data["price"].model_dump()

    update_data["updated_at"] = datetime.now(timezone.utc)

    updated_service = await provider_repo.patch_service(
        service_id=service_object_id,
        owner_id=owner_object_id,
        update_data=update_data,
    )

    if updated_service is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found or not owned by current user.",
        )

    return serialize_mongo(updated_service)


async def get_provider_by_id(
    provider_id: str,
) -> dict:

    try:
        provider_object_id = ObjectId(provider_id)

    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid provider ID.",
        ) from exc

    provider = await provider_repo.get_provider_by_id(provider_object_id)

    if provider is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Provider not found.",
        )

    return serialize_mongo(provider)

async def add_provider_image(provider_id: str, owner_id: str, image_url: str):
    try:
        provider_obj_id = ObjectId(provider_id)
        owner_obj_id = ObjectId(owner_id)
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid ID.") from exc
        
    updated = await provider_repo.add_image(provider_obj_id, owner_obj_id, image_url)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Provider not found or not owned by user.")
    return True

async def register_profile_view(
    provider_id: str,
    user_id: str | None = None,
) -> None:

    try:
        provider_object_id = ObjectId(provider_id)

        user_object_id = ObjectId(user_id) if user_id else None

    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid ID.",
        ) from exc

    provider = await provider_repo.get_provider_by_id(provider_object_id)

    if provider is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Provider not found.",
        )

    await provider_repo.create_profile_view(
        provider_id=provider_object_id,
        user_id=user_object_id,
    )


async def get_providers_by_owner(user_id: str) -> list[dict]:
    try:
        owner_object_id = ObjectId(user_id)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID.",
        ) from exc

    providers = await provider_repo.get_providers_by_owner(owner_object_id)
    return serialize_mongo(providers)

async def get_all_providers(skip: int = 0, limit: int = 100) -> list[dict]:
    providers = await provider_repo.get_all_providers(skip, limit)

    return serialize_mongo(providers)

async def delete_provider(provider_id: str) -> bool:
    try:
        provider_object_id = ObjectId(provider_id)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid ID.",
        ) from exc
    deleted = await provider_repo.delete_provider(provider_object_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Provider not found.",
        )
    return True

