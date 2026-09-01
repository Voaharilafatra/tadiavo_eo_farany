from app.schemas.auth_schema import GoogleLoginRequest
from app.services import user_service
from fastapi import APIRouter, Depends, status

from app.core.security import security

from fastapi.security import HTTPAuthorizationCredentials

from app.core.security import get_current_user
from app.utils.serilizer import serialize_mongo


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post("/login_google")
async def google_login(
    data: GoogleLoginRequest,
):
    return await user_service.login_with_google(data.credential)


@router.post(
    "/logout",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def logout(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    await user_service.logout_user(credentials.credentials)


@router.get("/users/me")
async def get_me(
    user_id: str = Depends(get_current_user),
):
    user = await user_service.get_user_by_id_service(user_id)
    return serialize_mongo(user)

@router.get("/all")
async def get_all_users(
    user_id: str = Depends(get_current_user),
):
    return await user_service.get_all_users_service()

@router.put("/{target_user_id}/role")
async def update_user_role(
    target_user_id: str,
    role: str,
    user_id: str = Depends(get_current_user),
):
    return await user_service.update_user_role(target_user_id, role)

@router.put("/{target_user_id}/status")
async def update_user_status(
    target_user_id: str,
    account_status: str, # active ou disabled
    user_id: str = Depends(get_current_user),
):
    return await user_service.update_user_status(target_user_id, account_status)

@router.patch("/users/me")
async def update_my_profile(
    update_data: dict,
    user_id: str = Depends(get_current_user),
):
    user = await user_service.update_my_profile(user_id, update_data)
    return serialize_mongo(user)
async def get_me(
    user_id: str = Depends(get_current_user),
):
    user = await user_service.get_user_by_id_service(user_id)

    return serialize_mongo(user)

from app.schemas.service import ServiceCreate
import uuid
from datetime import datetime

@router.post("/users/me/services")
async def add_my_service(
    service: ServiceCreate,
    user_id: str = Depends(get_current_user),
):
    from app.database.mongodb import users_collection
    from bson import ObjectId
    
    new_service = {
        "id": str(uuid.uuid4()),
        "name": service.name,
        "description": service.description,
        "price": service.price.model_dump(),
        "created_at": datetime.utcnow().isoformat()
    }
    
    await users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$push": {"services": new_service}}
    )
    return new_service

@router.delete("/users/me/services/{service_id}")
async def delete_my_service(
    service_id: str,
    user_id: str = Depends(get_current_user),
):
    from app.database.mongodb import users_collection
    from bson import ObjectId
    
    await users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$pull": {"services": {"id": service_id}}}
    )
    return {"status": "ok"}
@router.post("/users/me/favorites/{provider_id}")
async def toggle_favorite(
    provider_id: str,
    user_id: str = Depends(get_current_user),
):
    return await user_service.toggle_user_favorite(user_id, provider_id)

@router.get("/users/me/favorites")
async def get_my_favorites(
    user_id: str = Depends(get_current_user),
):
    return await user_service.get_user_favorites(user_id)
