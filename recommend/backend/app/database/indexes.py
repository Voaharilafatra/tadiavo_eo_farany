from app.database.mongodb import (
    providers_collection,
    reviews_collection,
    users_collection,
    categories_collection,
    revoked_tokens_collection,
)


async def create_indexes():
    await providers_collection.create_index([("location", "2dsphere")])

    # await providers_collection.create_index(
    #     "category_id"
    # )

    await providers_collection.create_index("services.name")

    await providers_collection.create_index("services.rating.average")

    await reviews_collection.create_index("provider_id")

    # await reviews_collection.create_index(
    #     "service_id"
    # )
    await categories_collection.create_index("slug", unique=True)
    await users_collection.create_index("email", unique=True)
    await providers_collection.create_index([("location", "2dsphere")])
    await revoked_tokens_collection.create_index(
        "expires_at",
        expireAfterSeconds=0,
    )
