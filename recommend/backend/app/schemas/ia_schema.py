from pydantic import BaseModel, Field


class ServiceAnalysis(BaseModel):
    service_id: str
    score: int = Field(
        ge=-2,
        le=2,
    )


class CommentAnalysis(BaseModel):
    services: list[ServiceAnalysis]
