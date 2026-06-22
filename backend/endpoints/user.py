import os
import logging
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from database import get_db
from models import User
from auth import (create_access_token,verify_google_id_token,get_google_auth_flow,get_current_user,hash_password,verify_password)
from schemas.user_schemas import (RegisterRequest, LoginRequest, ChangePasswordRequest, GoogleTokenRequest)

##Logger for better error tracking into the CLI
logger = logging.getLogger("cooksync.endpoints.user")

router = APIRouter(prefix="/auth", tags=["User & Authentication"])

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(payload: RegisterRequest, db: AsyncSession = Depends(get_db)):
    """
    Registers a new user with an email, username, and password.
    """
    email_clean = payload.email.strip().lower()
    if "@" not in email_clean:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email format"
        )
        
    # Check if email is already registered
    query = select(User).where(User.email == email_clean)
    result = await db.execute(query)
    existing_user = result.scalar_one_or_none()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered"
        )
        
    hashed = hash_password(payload.password)
    new_user = User(
        username=payload.username[:50],
        email=email_clean,
        password_hash=hashed,
        google_id=None,
        picture=None
    )
    
    try:
        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)
    except Exception as e:
        await db.rollback()
        logger.error(f"Error creating user: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while creating your account."
        )
        
    # Generate local access token
    access_token = create_access_token(data={"sub": str(new_user.id)})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(new_user.id),
            "username": new_user.username,
            "email": new_user.email
        }
    }

@router.post("/login")
async def login(payload: LoginRequest, db: AsyncSession = Depends(get_db)):
    """
    Authenticates a user with email and password, returning a JWT token.
    """
    email_clean = payload.email.strip().lower()
    
    query = select(User).where(User.email == email_clean)
    result = await db.execute(query)
    user = result.scalar_one_or_none()
    
    if not user or not user.password_hash:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
        
    if not verify_password(user.password_hash, payload.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
        
    # Generate token
    access_token = create_access_token(data={"sub": str(user.id)})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(user.id),
            "username": user.username,
            "email": user.email,
            "picture": user.picture
        }
    }

@router.post("/change-password")
async def change_password(
    payload: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Changes the password for the currently logged-in user.
    """
    # Verify old password
    # If user registered with Google only, password_hash might be None.
    # In this case, we allow them to set a password directly or verify old one if it exists.
    if current_user.password_hash:
        if not verify_password(current_user.password_hash, payload.old_password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Incorrect old password"
            )
            
    # Hash and save new password
    current_user.password_hash = hash_password(payload.new_password)
    
    try:
        await db.commit()
    except Exception as e:
        await db.rollback()
        logger.error(f"Error changing password: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not update password."
        )
        
    return {"status": "success", "message": "Password updated successfully"}

#Endpoint to use from the frontend via OAuth Google Sign in 
@router.post("/google/verify-token")
async def verify_google_token(
    payload: GoogleTokenRequest,
    db: AsyncSession = Depends(get_db)
):
    id_info = verify_google_id_token(payload.id_token)
    
    email = id_info.get("email")
    google_id = id_info.get("sub")
    name = id_info.get("name") or email.split("@")[0] if email else "Google User"
    picture = id_info.get("picture")
    
    if not email or not google_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google token payload is missing email or sub"
        )
        
    email_clean = email.strip().lower()
    
    # Check if user with google_id exists
    query = select(User).where(User.google_id == google_id)
    result = await db.execute(query)
    user = result.scalar_one_or_none()
    
    if not user:
        # Check if user with email exists
        query = select(User).where(User.email == email_clean)
        result = await db.execute(query)
        user = result.scalar_one_or_none()
        
        if user:
            # Link Google account to existing email account
            user.google_id = google_id
            if picture:
                user.picture = picture
            await db.commit()
            await db.refresh(user)
        else:
            # Create a new user
            user = User(
                username=name[:50],
                email=email_clean,
                google_id=google_id,
                picture=picture,
                password_hash=None
            )
            db.add(user)
            await db.commit()
            await db.refresh(user)
            
    # Generate local access token
    access_token = create_access_token(data={"sub": str(user.id)})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(user.id),
            "username": user.username,
            "email": user.email,
            "picture": user.picture
        }
    }

@router.get("/google/url")
async def get_google_url():
    try:
        flow = get_google_auth_flow()
        authorization_url, state = flow.authorization_url(
            access_type='offline',
            include_granted_scopes='true'
        )
        return {
            "url": authorization_url,
            "state": state
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate Google auth URL: {str(e)}"
        )

@router.get("/google/callback")
async def google_callback(
    code: str,
    state: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    # Enable insecure transport for local development (HTTP redirect callback)
    os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
    
    try:
        flow = get_google_auth_flow()
        flow.fetch_token(code=code)
        credentials = flow.credentials
        
        # Verify the ID token received from the oauth exchange
        id_info = verify_google_id_token(credentials.id_token)
        
        email = id_info.get("email")
        google_id = id_info.get("sub")
        name = id_info.get("name") or email.split("@")[0] if email else "Google User"
        picture = id_info.get("picture")
        
        if not email or not google_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Google token payload is missing email or sub"
            )
            
        email_clean = email.strip().lower()
        
        # Check if user with google_id exists
        query = select(User).where(User.google_id == google_id)
        result = await db.execute(query)
        user = result.scalar_one_or_none()
        
        if not user:
            # Check if user with email exists
            query = select(User).where(User.email == email_clean)
            result = await db.execute(query)
            user = result.scalar_one_or_none()
            
            if user:
                # Link Google account
                user.google_id = google_id
                if picture:
                    user.picture = picture
                await db.commit()
                await db.refresh(user)
            else:
                # Create a new user
                user = User(
                    username=name[:50],
                    email=email_clean,
                    google_id=google_id,
                    picture=picture,
                    password_hash=None
                )
                db.add(user)
                await db.commit()
                await db.refresh(user)
                
        # Generate local access token
        access_token = create_access_token(data={"sub": str(user.id)})
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": str(user.id),
                "username": user.username,
                "email": user.email,
                "picture": user.picture
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"OAuth callback code exchange failed: {str(e)}"
        )

@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    """
    Get the currently logged-in user profile info.
    """
    return {
        "id": str(current_user.id),
        "username": current_user.username,
        "email": current_user.email,
        "picture": current_user.picture,
        "created_at": current_user.created_at
    }
