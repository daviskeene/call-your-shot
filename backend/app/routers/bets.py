from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, aliased
from typing import List

from .. import schemas, crud, models
from ..database import authenticate_query_param, get_db

router = APIRouter(
    prefix="/bets",
    tags=["bets"],
)


@router.post("/", response_model=schemas.Bet)
def create_bet(
    bet: schemas.BetCreate,
    db: Session = Depends(get_db),
):
    # Bettor and bettee must both exist
    bettor = crud.get_user(db, bet.bettor_id)
    bettee = crud.get_user(db, bet.bettee_id)
    if not bettor or not bettee:
        raise HTTPException(status_code=404, detail="Bettor or Bettee not found")

    return crud.create_bet(db=db, bet=bet)


@router.get("/{bet_id}", response_model=schemas.Bet)
def read_bet(bet_id: int, db: Session = Depends(get_db)):
    # Aliases for the bettor and bettee users
    bettor_alias = aliased(models.User)
    bettee_alias = aliased(models.User)

    # Join with aliased user tables
    db_bet = (
        db.query(
            models.Bet,
            bettor_alias.name.label("bettor_name"),
            bettee_alias.name.label("bettee_name"),
        )
        .join(bettor_alias, models.Bet.bettor_id == bettor_alias.id)
        .join(bettee_alias, models.Bet.bettee_id == bettee_alias.id)
        .filter(models.Bet.id == bet_id)
        .first()
    )

    if not db_bet:
        raise HTTPException(status_code=404, detail="Bet not found")

    # Unpack the result and format response
    bet, bettor_name, bettee_name = db_bet
    formatted_bet = {
        "id": bet.id,
        "date_created": bet.date_created,
        "shots": bet.shots,
        "description": bet.description,
        "outcome": bet.outcome,
        "bettor_id": bet.bettor_id,
        "bettor_name": bettor_name,
        "bettee_id": bet.bettee_id,
        "bettee_name": bettee_name,
    }

    return formatted_bet


@router.get("/", response_model=List[schemas.Bet])
def read_bets(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    bets = crud.get_bets(db, skip=skip, limit=limit)
    return bets


@router.put("/{bet_id}", response_model=schemas.Bet)
def update_bet(bet_id: int, bet: schemas.BetUpdate, db: Session = Depends(get_db)):
    db_bet = crud.get_bet(db, bet_id)
    if not db_bet:
        raise HTTPException(status_code=404, detail="Bet not found")

    for key, value in bet.dict().items():
        attr_value = value
        if key == "outcome" and value.lower() != "incomplete":
            # Convert the outcome value to SQLite time field format
            attr_value = models.convert_iso_str_to_sqllite_datetime_str(value)
        setattr(db_bet, key, attr_value)
    db.commit()
    db.refresh(db_bet)

    return db_bet


@router.delete("/{bet_id}")
def delete_bet(
    bet_id: int,
    db: Session = Depends(get_db),
    authenticated: bool = Depends(authenticate_query_param),
):
    db_bet = crud.get_bet(db, bet_id)
    if not db_bet:
        raise HTTPException(status_code=404, detail="Bet not found")
    db.delete(db_bet)
    db.commit()
    return {"message": "Bet deleted successfully"}
