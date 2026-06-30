from pydantic import BaseModel
from datetime import datetime

class HomeCreateRequest(BaseModel):
    name: str

class HomeMember(BaseModel):
    home_id: int
    user_id: int
    role: str
    joined_at: datetime

class HomeJoinRequest(BaseModel):
    invite_code: str

