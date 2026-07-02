from uuid import UUID
from uuid import uuid4
from pydantic import BaseModel
from datetime import datetime

class HomeCreateRequest(BaseModel):
    name: str

class HomeMember(BaseModel):
    home_id: UUID
    user_id: UUID
    role: str
    joined_at: datetime

class HomeJoinRequest(BaseModel):
    invite_code: str

class HomeLeaveRequest(BaseModel):
    home_id: UUID

class HomeUpdateRequest(BaseModel):
    home_id: UUID
    name: str

class HomeKickUserRequest(BaseModel):
    home_id: UUID
    user_id: UUID