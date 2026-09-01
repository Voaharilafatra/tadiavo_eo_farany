from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    MONGODB_URL: str
    MONGODB_DATABASE: str
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    API_KEY: str
    JWT_SECRET_KEY: str

    class Config:
        env_file = ".env"


settings = Settings()
