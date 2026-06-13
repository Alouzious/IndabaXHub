from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application configuration loaded from environment / .env file."""

    # Core
    PROJECT_NAME: str = "IndabaXHub API"
    API_PREFIX: str = "/api"
    ENVIRONMENT: str = "development"

    # Database
    DATABASE_URL: str = "sqlite:///./indabaxhub.db"

    # Auth / JWT
    SECRET_KEY: str = "change-me-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # Object storage (S3 compatible)
    S3_BUCKET_NAME: str = "indabaxhub-datasets"
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    AWS_REGION: str = "us-east-1"
    S3_ENDPOINT_URL: str | None = None

    # CORS — comma separated list of allowed origins
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173"

    # Local fallback storage when S3 credentials are not configured
    LOCAL_STORAGE_DIR: str = "./storage"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]

    @property
    def s3_configured(self) -> bool:
        # Treat empty strings and obvious placeholders as "not configured" so
        # the local-storage fallback works out of the box in development.
        placeholders = {"", "...", "changeme", "your-access-key", "your-secret-key"}
        key = (self.AWS_ACCESS_KEY_ID or "").strip()
        secret = (self.AWS_SECRET_ACCESS_KEY or "").strip()
        return key not in placeholders and secret not in placeholders


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
