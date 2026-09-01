from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings


client = AsyncIOMotorClient(settings.MONGODB_URL)

database = client[settings.MONGODB_DATABASE]

users_collection = database["users"]
providers_collection = database["providers"]
categories_collection = database["categories"]
reviews_collection = database["reviews"]
searches_collections = database["searches"]
revoked_tokens_collection = database["revoked_tokens"]
profile_views_collection = database["profile_views"]
