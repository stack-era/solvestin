from typing import Any, Dict, List, Optional, Union
from pydantic import AnyHttpUrl, BaseSettings, PostgresDsn, validator
import os

class Settings(BaseSettings):
    PROJECT_NAME: str
    BACKEND_CORS_ORIGINS = ["*"]

    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    POSTGRES_SERVER: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    DATABASE_URI: Optional[PostgresDsn] = None

    @validator("DATABASE_URI", pre=True)
    def assemble_db_connection(cls, v: Optional[str], values: Dict[str, Any]) -> Any:
        if isinstance(v, str):
            return v
        return PostgresDsn.build(
            scheme="postgresql",
            user=values.get("POSTGRES_USER"),
            password=values.get("POSTGRES_PASSWORD"),
            host=values.get("POSTGRES_SERVER"),
            path=f"/{values.get('POSTGRES_DB') or ''}",
        )

    class Config:
        case_sensitive = True
        env_file = ".env"


settings = Settings(PROJECT_NAME=os.getenv("SOL_PROJECT_NAME"), POSTGRES_SERVER=os.getenv("SOL_DB_HOST"), POSTGRES_USER=os.getenv("SOL_DB_USER"), POSTGRES_PASSWORD=os.getenv("SOL_DB_PASSWORD"), POSTGRES_DB=os.getenv("SOL_DB_SCHEMA"), DATABASE_URI=os.getenv("SOL_DATABASE_URI"))

