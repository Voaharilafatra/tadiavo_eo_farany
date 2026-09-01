from pydantic import BaseModel, Field


class CategoryCreate(BaseModel):
    name: str = Field(
        ...,
        min_length=2,
        max_length=100,
    )

    slug: str = Field(
        ...,
        min_length=2,
        max_length=100,
    )

    description: str | None = None


class CategoryResponse(BaseModel):
    id: str
    name: str
    slug: str
    parent_id: str | None = None
    description: str | None = None
