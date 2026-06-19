from fastapi import FastAPI, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from database import get_db

app = FastAPI(title="CookSync API - IanPagés")

@app.get("/db-check")
async def check_database_connection(db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(text("SELECT 1"))
        return {"status": "success", "message:": "Connection established successfully"}
    except Exception as e:
        return {"status": "error", "message": f"Fallo al conectar a la DB: {str(e)}"}
        