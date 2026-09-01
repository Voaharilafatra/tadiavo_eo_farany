from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from app.database.indexes import create_indexes
from app.routes.providers_route import router as provider_router
from app.routes.category_route import router as category_router
from app.routes.recommend_route import router as recommend_router
from app.routes.reviews_route import router as review_router
from app.routes.searches_route import router as search_router
from app.routes.user_route import router as user_router
from app.routes.dashboard_route import router as dashboard_router
from app.routes.chat_route import router as chat_router
from app.routes.booking_route import router as booking_router
from app.routes.notification_route import router as notification_router

# Créer le dossier d'images s'il n'existe pas
os.makedirs("uploads/images", exist_ok=True)

app = FastAPI(
    title="Tadiavo-eo",
    description="Local service discovery and recommendation API",
    version="1.0.0",
)

# Servir les fichiers statiques (images)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Configuration CORS pour autoriser le frontend (React/Vite)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], # Port par défaut de Vite
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_indexes()

    yield


app.include_router(provider_router)
app.include_router(category_router)
app.include_router(recommend_router)
app.include_router(review_router)
app.include_router(search_router)
app.include_router(user_router)
app.include_router(dashboard_router)
app.include_router(chat_router)
app.include_router(booking_router)
app.include_router(notification_router)
