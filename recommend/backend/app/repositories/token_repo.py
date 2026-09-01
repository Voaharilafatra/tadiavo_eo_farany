from app.database.mongodb import revoked_tokens_collection


async def revoke_token(
    jti: str,
    expires_at,
) -> None:

    await revoked_tokens_collection.insert_one(
        {
            "jti": jti,
            "expires_at": expires_at,
        }
    )


async def is_token_revoked(
    jti: str,
) -> bool:

    token = await revoked_tokens_collection.find_one(
        {
            "jti": jti,
        }
    )

    return token is not None
