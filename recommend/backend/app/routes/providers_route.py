from fastapi import APIRouter, status, Depends, UploadFile, File
import shutil
import os
import uuid

from app.schemas.provider_schema import ProviderCreate
from app.services import provider_service
from app.core.security import get_current_user
from app.schemas.service import ServiceCreate, ServicePatch, ServiceUpdate

router = APIRouter(
    prefix="/prestataires",
    tags=["Pretataires"],
)

@router.post("/{provider_id}/upload_image")
async def upload_provider_image(
    provider_id: str,
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user),
):
    # Generer un nom unique
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = f"uploads/images/{unique_filename}"
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    image_url = f"http://localhost:8000/{file_path}"
    
    # Mettre a jour le provider dans MongoDB
    await provider_service.add_provider_image(provider_id, user_id, image_url)
    
    return {"image_url": image_url}

@router.post(
    "",
    summary="Creer un prestataire de service. Un prestataire peut appartenir a plusieurs categories. dans services, on liste les different services fournis par ce prestaire",
    status_code=status.HTTP_201_CREATED,
)
async def create_provider(
    provider: ProviderCreate,
    user_id: str = Depends(get_current_user),
):
    return await provider_service.create_provider(
        provider,
        user_id,
    )


@router.get(
    "",
    summary="Récupérer tous les prestataires",
    description="Retourne la liste de tous les prestataires actifs.",
)
async def get_all_providers(skip: int = 0, limit: int = 100):
    return await provider_service.get_all_providers(skip, limit)


@router.get(
    "/me",
    summary="Récupérer mes prestataires",
)
async def get_my_providers(
    user_id: str = Depends(get_current_user),
):
    return await provider_service.get_providers_by_owner(user_id)

@router.get("/{provider_id}")
async def get_provider(
    provider_id: str,
):
    return await provider_service.get_provider_by_id(provider_id)


@router.post("/{provider_id}/services")
async def add_service(
    provider_id: str,
    service: ServiceCreate,
):
    return await provider_service.add_service_to_provider(
        provider_id=provider_id,
        service=service,
    )


@router.get("/{provider_id}/services")
async def get_provider_services(
    provider_id: str,
):
    return await provider_service.get_services_by_provider(provider_id)


@router.get("/{provider_id}/services/{service_id}")
async def get_service(
    provider_id: str,
    service_id: str,
):
    return await provider_service.get_service_by_id(
        provider_id=provider_id,
        service_id=service_id,
    )


@router.put("/{service_id}")
async def replace_service(
    service_id: str,
    service: ServiceUpdate,
    user_id: str = Depends(get_current_user),
):
    return await provider_service.replace_service(
        service_id=service_id,
        owner_id=user_id,
        service=service,
    )


@router.patch("/{service_id}")
async def partially_update_service(
    service_id: str,
    service: ServicePatch,
    user_id: str = Depends(get_current_user),
):
    return await provider_service.partially_update_service(
        service_id=service_id,
        owner_id=user_id,
        service=service,
    )


@router.delete(
    "/{provider_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_provider(
    provider_id: str,
    user_id: str = Depends(get_current_user),
):
    await provider_service.delete_provider(provider_id)


@router.delete(
    "/services/{service_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_service(
    service_id: str,
    user_id: str = Depends(get_current_user),
):
    await provider_service.remove_service(
        service_id=service_id,
        owner_id=user_id,
    )


@router.post(
    "/{provider_id}/views",
    status_code=204,
    summary="Enregistrer une visite de profil",
)
async def register_profile_view(
    provider_id: str,
):
    await provider_service.register_profile_view(
        provider_id=provider_id,
        user_id=None,
    )
