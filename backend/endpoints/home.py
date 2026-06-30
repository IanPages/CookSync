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
from schemas.home_schemas import HomeCreateRequest, HomeMember, HomeJoinRequest, HomeUpdateRequest, HomeKickUserRequest

logger = logging.getLogger("cooksync.endpoints.home")

router = APIRouter(prefix="/home", tags=["Home"])

@router.get("/list", status_code=status.HTTP_200_OK)
async def get_all_homes(current_user:User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    try:
        stmt= select(Home).join(HomeMember).where(HomeMember.user_id == current_user.id)
        result= await db.execute(stmt)
        homes = result.scalars().all()

        homes_data = []
        for home in homes:
            homes_data.append({
                "id": str(home.id),
                "name": home.name,
                "invite_code": home.invite_code,
                "created_at": home.created_at,
                "owner_id": home.owner_id
            })
        return homes_data

    except Exception as e:
        logger.error(f"Error fetching all homes: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while fetching all homes."
        )

@router.post("/create", status_code=status.HTTP_201_CREATED)
async def create_home(payload:HomeCreateRequest,current_user:User = Depends(get_current_user),db: AsyncSession = Depends(get_db)):

    invite_code = generate_invite_code()
    # Check if the invite code already exists
    stmt = select(Home).where(Home.invite_code == invite_code)
    result = await db.execute(stmt)
    existing_home = result.scalar_one_or_none()
    
    # If the code exists, generate a new one
    if existing_home:
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

@router.post("/{home_id}/leave", status_code=status.HTTP_200_OK)
async def leave_home(home_id: int,current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    try:
        stmt= select(HomeMember).where(HomeMember.home_id == home_id, HomeMember.user_id == current_user.id)
        result = await db.execute(stmt)
        existing_member = result.scalar_one_or_none()
        if not existing_member:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail="You are not a member of this home.")
        if existing_member.role == "owner":
            stmt= select(HomeMember).where(HomeMember.home_id == home_id)
            result= await db.execute(stmt)
            members = result.scalars().all()
            if len(members) > 1:
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail="You cannot leave this home because you are the owner.")
        await db.delete(existing_member)
        await db.commit()
        return {
            "message": "Successfully left the home."
        }
    except Exception as e:
        await db.rollback()
        logger.error(f"Error leaving home: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while leaving the home."
        )

@router.put("/{home_id}", status_code=status.HTTP_200_OK)
async def update_home(payload:HomeUpdateRequest,current_user:User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    try:
        stmt= select(Home).where(Home.id == payload.home_id)
        result= await db.execute(stmt)
        home = result.scalar_one_or_none()
        if not home:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Home not found.")
        stmt = select(HomeMember).where(HomeMember.home_id == home.id, HomeMember.user_id == current_user.id)
        result = await db.execute(stmt)
        existing_member = result.scalar_one_or_none()
        if not existing_member:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail="You are not a member of this home.")
        if existing_member.role != "owner":
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail="You are not authorized to update the home.")
        home.name = payload.name
        await db.commit()
        return {
            "message": f"Successfully updated {home.name}"
        }
    except Exception as e:
        await db.rollback()
        logger.error(f"Error updating home: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while updating the home."
        )
@router.put("/{home_id}/kick", status_code=status.HTTP_200_OK)
async def kick_user_from_home(payload:HomeKickUserRequest, current_user:User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    try:
        stmt = select(HomeMember).where(HomeMember.home_id == payload.home_id, HomeMember.user_id == current_user.id)
        result = await db.execute(stmt)
        existing_member = result.scalar_one_or_none()
        if not existing_member:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail="You are not a member of this home.")
        if existing_member.role != "owner":
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail="You are not authorized to kick users from the home.")
        stmt = select(HomeMember).where(HomeMember.home_id == payload.home_id, HomeMember.user_id == payload.user_id)
        result = await db.execute(stmt)
        existing_member = result.scalar_one_or_none()
        if not existing_member:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="User is not a member of this home.")
        stmt_delete = HomeMember.__table__.delete().where(HomeMember.home_id == payload.home_id, HomeMember.user_id == payload.user_id)
        await db.execute(stmt_delete)
        await db.commit()
        return {
            "message": f"Successfully kicked user from home."
        }
    except Exception as e:
        await db.rollback()
        logger.error(f"Error kicking user from home: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while kicking user from home."
        )

@router.delete("/{home_id}", status_code=status.HTTP_200_OK)
async def delete_home(home_id: int, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    try:
        stmt = select(HomeMember).where(HomeMember.home_id == home_id, HomeMember.user_id == current_user.id, HomeMember.role == "owner")
        result = await db.execute(stmt)
        owner_record = result.scalar_one_or_none()

        if not owner_record:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail="Only the owner can delete the home.")

        stmt_check_members = select(HomeMember).where(HomeMember.home_id == home_id)
        result = await db.execute(stmt_check_members)
        all_members = result.scalars().all()

        if len(all_members) > 1:
            stmt_delete = HomeMember.__table__.delete().where(HomeMember.home_id == home_id)
            await db.execute(stmt_delete)
        else:
            stmt_delete = Home.__table__.delete().where(Home.id == home_id)
            await db.execute(stmt_delete)

        await db.commit()
        
        return {
            "message": "Home deleted successfully"
        }
    except Exception as e:
        await db.rollback()
        logger.error(f"Error deleting home: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while deleting the home."
        )
        

def generate_invite_code():
    code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
    
    return code