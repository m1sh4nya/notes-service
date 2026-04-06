from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# Схемы для пользователей
class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    is_2fa_enabled: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Схемы для 2FA
class TwoFAVerify(BaseModel):
    email: EmailStr
    code: str

class TwoFAResponse(BaseModel):
    message: str
    token: Optional[str] = None

# Схемы для заметок
class NoteCreate(BaseModel):
    title: str
    content: str

class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None

class NoteResponse(BaseModel):
    id: int
    title: str
    content: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    user_id: int

    class Config:
        from_attributes = True