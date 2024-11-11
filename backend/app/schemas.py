from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    name: str
    email: str


class UserCreate(UserBase):
    pass


class User(UserBase):
    id: int

    class Config:
        orm_mode = True


class BetBase(BaseModel):
    bettor_id: int
    bettee_id: int
    shots: int
    description: Optional[str] = None


class BetCreate(BetBase):
    pass


class BetUpdate(BaseModel):
    outcome: str
    shots: Optional[int] = None


class Bet(BetBase):
    id: int
    date_created: datetime
    outcome: Optional[str] = None
    bettee_name: Optional[str] = None
    bettor_name: Optional[str] = None

    class Config:
        orm_mode = True


class UserBasic(BaseModel):
    id: int
    name: str


class BetDetail(BaseModel):
    id: int
    shots: int
    description: str
    outcome: Optional[str]
    date_created: datetime
    counterparty: UserBasic
