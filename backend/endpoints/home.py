import os
import logging
import string
import random
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import get_db
from models import Home,User,HomeMember
from auth import get_current_user
from schemas.home_schemas import HomeCreateRequest, HomeMember, HomeJoinRequest

logger = logging.getLogger("cooksync.endpoints.home")

router = APIRouter(prefix="/home", tags=["Home"])

@router.post("/create", status_code=status.HTTP_201_CREATED)
async def create_home(payload:HomeCreateRequest,current_user:User = Depends(get_current_user),db: AsyncSession = Depends(get_db)):

    invite_code = generate_invite_code()

    new_home = Home(
        name=payload.name,
        invite_code=invite_code,
        created_at=datetime.now(),
        owner_id=current_user.id
    )
    
    try:
        db.add(new_home)
        await db.commit()
        await db.refresh(new_home)
        
        new_member = HomeMember(
            home_id=new_home.id,
            user_id=current_user.id,
            role="owner",
            joined_at=datetime.now()
        )
        db.add(new_member)
        await db.commit()
        
        return {
            "id": str(new_home.id),
            "name": new_home.name,
            "invite_code": new_home.invite_code
        }
    except Exception as e:
        await db.rollback()
        logger.error(f"Error creating home: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while creating your home."
        )

@router.post("/join", status_code=status.HTTP_200_OK)
async def join_home(payload: HomeJoinRequest, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    try:
        stmt = select(Home).where(Home.invite_code == payload.invite_code)
        result = await db.execute(stmt)
        home = result.scalar_one_or_none()

        if not home:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Home not found.")

        stmt = select(HomeMember).where(HomeMember.home_id == home.id, HomeMember.user_id == current_user.id)
        result = await db.execute(stmt)
        existing_member = result.scalar_one_or_none()

        if existing_member:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You are already a member of this home.")
           
        new_member = HomeMember(
            home_id = home.id,
            user_id = current_user.id,
            role = "user",
            joined_at = datetime.now()
        )
        db.add(new_member)
        await db.commit()
        return {
            "message": f"Successfully joined {home.name}"
        }
    except Exception as e:
        await db.rollback()
        logger.error(f"Error joining home: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while joining the home."
        )

def generate_invite_code():
    code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
    
    return code