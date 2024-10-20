from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from typing import List
from .. import schemas, crud, models
from ..database import get_db

router = APIRouter(
    prefix="/users",
    tags=["users"],
)


@router.post("/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)


@router.get("/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@router.get("/", response_model=List[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users


@router.put("/{user_id}", response_model=schemas.User)
def update_user(user_id: int, user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db_user.name = user.name
    db_user.email = user.email
    db.commit()
    db.refresh(db_user)
    return db_user


@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(db_user)
    db.commit()
    return {"message": "User deleted successfully"}


@router.get("/{user_id}/shot-balances", response_model=dict)
def get_user_shot_balances(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    shot_balances = crud.get_user_shot_balances(db=db, user_id=user_id)
    return {"balance": shot_balances, "user": db_user}


@router.get("/{user_id}/bets-owed", response_model=List[schemas.Bet])
def get_user_bets_owed(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Get all bets where the user is the bettor (owes shots)
    bets_owed = db.query(models.Bet).filter(models.Bet.bettor_id == user_id).all()

    return bets_owed


@router.get("/{user_id}/bets-owned", response_model=List[schemas.Bet])
def get_user_bets_owned(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Get all bets where the user is the bettee (is owed shots)
    bets_owned = db.query(models.Bet).filter(models.Bet.bettee_id == user_id).all()

    return bets_owned


@router.get("/{user_id}/bet-summary")
def get_user_bet_summary(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Get all bets where the user is the bettor (owes shots)
    bets_owed = (
        db.query(models.Bet, models.User.name.label("bettee_name"))
        .join(models.User, models.Bet.bettee_id == models.User.id)
        .filter(models.Bet.bettor_id == user_id)
        .all()
    )

    # Get all bets where the user is the bettee (is owed shots)
    bets_owned = (
        db.query(models.Bet, models.User.name.label("bettor_name"))
        .join(models.User, models.Bet.bettor_id == models.User.id)
        .filter(models.Bet.bettee_id == user_id)
        .all()
    )

    # Format the response to include bettor and bettee names
    formatted_bets_owed = [
        {
            "id": bet.Bet.id,
            "date_created": bet.Bet.date_created,
            "shots": bet.Bet.shots,
            "description": bet.Bet.description,
            "outcome": bet.Bet.outcome,
            "bettor_id": bet.Bet.bettor_id,
            "bettee_id": bet.Bet.bettee_id,
            "bettee_name": bet.bettee_name,
        }
        for bet in bets_owed
    ]

    formatted_bets_owned = [
        {
            "id": bet.Bet.id,
            "date_created": bet.Bet.date_created,
            "shots": bet.Bet.shots,
            "description": bet.Bet.description,
            "outcome": bet.Bet.outcome,
            "bettor_id": bet.Bet.bettor_id,
            "bettee_id": bet.Bet.bettee_id,
            "bettor_name": bet.bettor_name,
        }
        for bet in bets_owned
    ]

    return {
        "user": {
            "id": db_user.id,
            "name": db_user.name,
            "email": db_user.email,
        },
        "bets_owed": formatted_bets_owed,
        "bets_owned": formatted_bets_owned,
    }


@router.get("/{user_id}/related-users", response_model=List[schemas.User])
def get_related_users(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Get all users who have been involved in bets with the current user
    related_user_ids = (
        db.query(models.Bet.bettor_id, models.Bet.bettee_id)
        .filter((models.Bet.bettor_id == user_id) | (models.Bet.bettee_id == user_id))
        .distinct()
    )

    related_users = set()
    for bettor_id, bettee_id in related_user_ids:
        if bettor_id != user_id:
            related_users.add(bettor_id)
        if bettee_id != user_id:
            related_users.add(bettee_id)

    return [crud.get_user(db, user_id) for user_id in related_users]
