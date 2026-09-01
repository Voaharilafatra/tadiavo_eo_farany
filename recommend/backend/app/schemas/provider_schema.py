from typing import Literal

from pydantic import BaseModel, Field, field_validator

from app.schemas.service import ServiceCreate


class Location(BaseModel):
    type: Literal["Point"] = "Point"

    coordinates: tuple[float, float] = Field(description="[longitude, latitude]")

    @field_validator("coordinates")
    @classmethod
    def validate_coordinates(
        cls,
        coordinates: tuple[float, float],
    ) -> tuple[float, float]:
        longitude, latitude = coordinates

        if not -180 <= longitude <= 180:
            raise ValueError("La longitude doit être comprise entre -180 et 180.")

        if not -90 <= latitude <= 90:
            raise ValueError("La latitude doit être comprise entre -90 et 90.")

        return coordinates


class Address(BaseModel):
    municipality: str
    neighborhood: str | None = None
    description: str | None = None


class OpeningHours(BaseModel):
    open: str
    close: str


class Contact(BaseModel):
    phone: str | None = None
    email: str | None = None


class ProviderCreate(BaseModel):
    name: str

    category_ids: list[str]

    description: str | None = None

    services: list[ServiceCreate]

    location: Location

    address: Address

    opening_hours: dict[str, OpeningHours] = Field(default_factory=dict)

    contact: Contact | None = None

    features: list[str] = Field(default_factory=list)
