from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import schemas, crud
from ..database import get_db

router = APIRouter(
    prefix="/bets",
    tags=["bets"],
)

@router.post("/", response_model=schemas.Bet)
def create_bet(bet: schemas.BetCreate, db: Session = Depends(get_db)):
    bettor = crud.get_user(db, bet.bettor_id)
    bettee = crud.get_user(db, bet.bettee_id)
    if not bettor or not bettee:
        raise HTTPException(status_code=404, detail="Bettor or Bettee not found")
    return crud.create_bet(db=db, bet=bet)

@router.get("/{bet_id}", response_model=schemas.Bet)
def read_bet(bet_id: int, db: Session = Depends(get_db)):
    db_bet = crud.get_bet(db, bet_id=bet_id)
    if db_bet is None:
        raise HTTPException(status_code=404, detail="Bet not found")
    return db_bet

@router.get("/", response_model=List[schemas.Bet])
def read_bets(skip: int = 0, limit: int = 100, db: Session = 
Depends(get_db)):
    bets = crud.get_bets(db, skip=skip, limit=limit)
    return bets

@router.put("/{bet_id}", response_model=schemas.Bet)
def update_bet(bet_id: int, bet: schemas.BetCreate, db: Session = 
Depends(get_db)):
    db_bet = crud.get_bet(db, bet_id)
    if not db_bet:
        raise HTTPException(status_code=404, detail="Bet not found")
    for key, value in bet.dict().items():
        setattr(db_bet, key, value)
    db.commit()
    db.refresh(db_bet)
    return db_bet

@router.delete("/{bet_id}")
def delete_bet(bet_id: int, db: Session = Depends(get_db)):
    db_bet = crud.get_bet(db, bet_id)
    if not db_bet:
        raise HTTPException(status_code=404, detail="Bet not found")
    db.delete(db_bet)
    db.commit()
    return {"message": "Bet deleted successfully"}

