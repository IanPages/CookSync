from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from config import settings

#1. Create the engine to connect to DB
engine = create_async_engine(settings.DATABASE_URL,echo=True)

#2. Configurate the sessionMaker
SessionLocal = async_sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False
)

# Define base model
class Base(DeclarativeBase):
    pass

#4. Inject dependencies
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with SessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()