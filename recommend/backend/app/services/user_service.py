from datetime import datetime, timezone

from fastapi import HTTPException, status

from app.services.google_auth_service import (
    verify_google_credential,
)
from app.repositories import user_repo
from app.core.security import create_access_token
from app.repositories import token_repo
import jwt
from bson import ObjectId

from app.core.config import settings


async def login_with_google(
    credential: str,
) -> dict:

    # --------------------------------
    # 1. Vérifier le credential Google
    # --------------------------------

    try:
        google_user = verify_google_credential(credential)

    except ValueError as exc:
        print("Erreur de verification Google:", str(exc)) # AJOUT DU LOG
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google credential.",
        ) from exc

    # --------------------------------
    # 2. Récupérer les informations Google
    # --------------------------------

    google_id = google_user["sub"]

    email = google_user.get("email")

    name = google_user.get(
        "name",
        "",
    )

    picture = google_user.get("picture")

    email_verified = google_user.get(
        "email_verified",
        False,
    )

    # --------------------------------
    # 3. Vérifier email
    # --------------------------------

    if not email or not email_verified:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Google email is not verified.",
        )

    # --------------------------------
    # 4. Chercher l'utilisateur
    # --------------------------------

    user = await user_repo.get_user_by_google_id(google_id)

    # --------------------------------
    # 5. Créer s'il n'existe pas
    # --------------------------------

    if not user:
        now = datetime.now(timezone.utc)

        user_data = {
            "google_id": google_id,
            "email": email,
            "name": name,
            "picture": picture,
            "role": "client",
            "status": "active",
            "created_at": now,
            "updated_at": now,
        }

        user = await user_repo.create_user(user_data)
        
    if user.get("status") == "disabled":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been disabled by an administrator.",
        )

    # --------------------------------
    # 6. Générer notre propre JWT
    # --------------------------------

    access_token = create_access_token(str(user["_id"]))

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "picture": user.get("picture"),
            "role": user["role"],
        },
    }


async def logout_user(token: str) -> None:

    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=["HS256"],
        )

        jti = payload.get("jti")
        expires_at_timestamp = payload.get("exp")

        if not jti or not expires_at_timestamp:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token.",
            )

        expires_at = datetime.fromtimestamp(
            expires_at_timestamp,
            tz=timezone.utc,
        )

        await token_repo.revoke_token(
            jti=jti,
            expires_at=expires_at,
        )

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token already expired.",
        )

    except jwt.InvalidTokenError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token.",
        ) from exc


async def get_user_by_id_service(
    user_id: str,
) -> dict:

    try:
        user_object_id = ObjectId(user_id)

    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID.",
        ) from exc

    user = await user_repo.get_user_by_id(user_object_id)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found.",
        )

    return user

async def toggle_user_favorite(user_id: str, provider_id: str) -> dict:
    try:
        user_obj_id = ObjectId(user_id)
        provider_obj_id = ObjectId(provider_id)
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid ID") from exc

    user = await user_repo.get_user_by_id(user_obj_id)
    favorites = user.get("favorites", [])
    
    is_favorite = provider_obj_id in favorites
    
    await user_repo.toggle_favorite(user_obj_id, provider_obj_id, not is_favorite)
    return {"is_favorite": not is_favorite}

from app.repositories import provider_repo
from app.utils.serilizer import serialize_mongo

async def get_user_favorites(user_id: str) -> list[dict]:
    try:
        user_obj_id = ObjectId(user_id)
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid ID") from exc

    user = await user_repo.get_user_by_id(user_obj_id)
    favorites = user.get("favorites", [])
    
    if not favorites:
        return []
        
    providers = []
    for fav_id in favorites:
        provider = await provider_repo.get_provider(fav_id)
        if provider:
            providers.append(provider)
            
    return serialize_mongo(providers)

async def get_all_users_service() -> list[dict]:
    users = await user_repo.get_all_users()
    return serialize_mongo(users)

async def update_user_role(user_id: str, role: str) -> dict:
    try:
        user_obj_id = ObjectId(user_id)
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Invalid ID") from exc
        
    updated = await user_repo.update_role(user_obj_id, role)
    if not updated:
        raise HTTPException(status_code=404, detail="User not found")
    return {"status": "success", "role": role}

async def update_user_status(user_id: str, account_status: str) -> dict:
    try:
        user_obj_id = ObjectId(user_id)
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Invalid ID") from exc
        
    updated = await user_repo.update_status(user_obj_id, account_status)
    if not updated:
        raise HTTPException(status_code=404, detail="User not found")
    return {"status": "success", "account_status": account_status}

async def update_my_profile(user_id: str, update_data: dict) -> dict:
    try:
        user_obj_id = ObjectId(user_id)
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Invalid ID") from exc
    
    # Sécuriser les champs modifiables
    allowed_fields = {"name", "phone", "bio", "picture"}
    filtered_data = {k: v for k, v in update_data.items() if k in allowed_fields}
    
    if not filtered_data:
        raise HTTPException(status_code=400, detail="No valid fields to update")
        
    updated = await user_repo.update_user_profile(user_obj_id, filtered_data)
    if not updated:
        raise HTTPException(status_code=404, detail="User not found")
    
    return await get_user_by_id_service(user_id)
