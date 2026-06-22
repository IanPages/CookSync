import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text


from database import get_db, Base, engine
from endpoints.user import router as auth_router

##Logger for better error tracking into the CLI
logger = logging.getLogger("cooksync.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    pass

app = FastAPI(title="CookSync API - IanPagés",
              lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)

## Standard Checks ##

@app.get("/")
async def root():
    return {
        "message": "Bienvenido al API de CookSync / SmartCart",
        "status": "online"
    }

@app.get("/db-check")
async def check_database_connection(db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(text("SELECT 1"))
        return {
            "status": "success", 
            "message": "Conexión estable con el Docker de Supabase", 
            "result": result.scalar()
        }
    except Exception as e:
        return {
            "status": "error", 
            "message": f"Fallo al conectar con la Base de Datos: {str(e)}"
        }