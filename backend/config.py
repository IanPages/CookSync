import logging
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


##Logger for better error tracking into the CLI
logger = logging.getLogger("cooksync.config")

class Settings(BaseSettings):
    DATABASE_URL: str
    GOOGLE_CLIENT_ID: Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None
    GOOGLE_REDIRECT_URI: str = "http://localhost:8000/auth/google/callback"
    JWT_SECRET_KEY: Optional[str] = None
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()


