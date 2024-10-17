from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)

    bets_made = relationship('Bet', back_populates='bettor', foreign_keys='Bet.bettor_id')
    bets_received = relationship('Bet', back_populates='bettee', foreign_keys='Bet.bettee_id')

class Bet(Base):
    __tablename__ = 'bets'

    id = Column(Integer, primary_key=True, index=True)
    date_created = Column(DateTime, default=datetime.utcnow)
    bettor_id = Column(Integer, ForeignKey('users.id'))
    bettee_id = Column(Integer, ForeignKey('users.id'))
    shots = Column(Integer)
    description = Column(String)
    outcome = Column(String)

    bettor = relationship('User', back_populates='bets_made', foreign_keys=[bettor_id])
    bettee = relationship('User', back_populates='bets_received', foreign_keys=[bettee_id])
