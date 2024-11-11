from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.types import TypeDecorator, String
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime

class SQLiteDateTime(TypeDecorator):
    """
    Custom SQLite-compatible DateTime type.
    Converts ISO 8601 strings without fractional seconds to Python datetime objects and vice versa.
    """
    impl = String

    def process_bind_param(self, value, dialect):
        # Convert Python datetime to ISO 8601 string without fractional seconds
        if isinstance(value, datetime):
            return value.strftime("%Y-%m-%dT%H:%M:%S")
        return value

    def process_result_value(self, value, dialect):
        # Convert ISO 8601 string to Python datetime
        if isinstance(value, str):
            return datetime.strptime(value, "%Y-%m-%dT%H:%M:%S")
        return value


def utcnow_str():
    return datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S")

def convert_iso_str_to_sqllite_datetime_str(iso_str) -> str:
    try:
        # First, attempt to parse as ISO 8601 format
        dt = datetime.fromisoformat(iso_str)
    except ValueError:
        try:
            # Attempt to parse the given string with a known format
            dt = datetime.strptime(iso_str, "%m/%d/%Y, %I:%M:%S %p")
        except ValueError:
            raise ValueError(f"Unsupported date format: {iso_str}")
    # Return the datetime in ISO format
    return dt.strftime("%Y-%m-%dT%H:%M:%S")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)

    bets_made = relationship(
        "Bet", back_populates="bettor", foreign_keys="Bet.bettor_id"
    )
    bets_received = relationship(
        "Bet", back_populates="bettee", foreign_keys="Bet.bettee_id"
    )


class Bet(Base):
    __tablename__ = "bets"

    id = Column(Integer, primary_key=True, index=True)
    date_created = Column(SQLiteDateTime, default=utcnow_str)
    bettor_id = Column(Integer, ForeignKey("users.id"))
    bettee_id = Column(Integer, ForeignKey("users.id"))
    shots = Column(Integer)
    description = Column(String)
    outcome = Column(String)

    bettor = relationship("User", back_populates="bets_made", foreign_keys=[bettor_id])
    bettee = relationship(
        "User", back_populates="bets_received", foreign_keys=[bettee_id]
    )
