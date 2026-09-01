from typing import Literal

from pydantic import BaseModel, Field, field_validator


class ReviewCreate(BaseModel):
    rating: float | None = Field(
        default=None,
        ge=1,
        le=5,
    )
    comment: str | None = None
