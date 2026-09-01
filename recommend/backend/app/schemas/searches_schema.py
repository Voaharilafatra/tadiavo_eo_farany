from typing import Optional

from pydantic import BaseModel, Field


class SearchLocation(BaseModel):
    place_name: str | None = None

    latitude: float | None = None
    longitude: float | None = None

    radius: int | None = Field(
        default=2000,
        gt=0,
    )


class SearchCriteria(BaseModel):
    # Classification
    category_ids: list[str] | None = None

    # Service précis recherché
    service: str | None = None

    # Localisation classique
    city: str | None = None
    neighborhood: str | None = None

    # Géolocalisation
    location: SearchLocation | None = None

    # Filtres
    max_price: float | None = Field(
        default=None,
        ge=0,
    )

    min_rating: float | None = Field(
        default=None,
        ge=0,
        le=5,
    )

    features: list[str] | None = None


class NaturalSearchRequest(BaseModel):
    query: str = Field(
        ...,
        min_length=2,
        max_length=500,
    )


class AIExtractedLocation(BaseModel):
    place_name: str | None = None

    latitude: float | None = None
    longitude: float | None = None

    radius: int | None = 2000


class AIExtractedSearch(BaseModel):
    category_slugs: list[str] | None = None
    service: str | None = None
    city: str | None = None
    neighborhood: str | None = None

    max_price: float | None = None
    min_rating: float | None = None

    features: list[str] | None = None

    location: AIExtractedLocation | None = None
