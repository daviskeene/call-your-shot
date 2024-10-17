from sqlalchemy.orm import Session
from . import models, schemas

# User CRUD operations
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == 
email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(name=user.name, email=user.email)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Bet CRUD operations
def get_bet(db: Session, bet_id: int):
    return db.query(models.Bet).filter(models.Bet.id == bet_id).first()

def get_bets(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Bet).offset(skip).limit(limit).all()

def create_bet(db: Session, bet: schemas.BetCreate):
    db_bet = models.Bet(**bet.dict())
    db.add(db_bet)
    db.commit()
    db.refresh(db_bet)
    return db_bet

def get_user_shot_balances(db: Session, user_id: int):
    # Shots this user owes to others
    shots_owed = db.query(models.Bet).filter(models.Bet.bettor_id == user_id).all()
    
    # Shots others owe this user
    shots_owed_to = db.query(models.Bet).filter(models.Bet.bettee_id == user_id).all()

    # Create dictionaries to store balances with specific users
    shots_i_owe = {}
    shots_others_owe_me = {}

    # Process shots owed
    for bet in shots_owed:
        if bet.bettee_id not in shots_i_owe:
            shots_i_owe[bet.bettee_id] = 0
        shots_i_owe[bet.bettee_id] += bet.shots

    # Process shots owed to me
    for bet in shots_owed_to:
        if bet.bettor_id not in shots_others_owe_me:
            shots_others_owe_me[bet.bettor_id] = 0
        shots_others_owe_me[bet.bettor_id] += bet.shots

    # Return the shot balances in a structured format
    return {
        "total_user_shots_outward": sum(shots_i_owe.values()),
        "total_user_shots_inward": sum(shots_others_owe_me.values()),
        "outward": shots_i_owe,
        "inward": shots_others_owe_me
    }