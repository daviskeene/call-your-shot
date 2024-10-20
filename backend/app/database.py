from fastapi import HTTPException, Query
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

from dotenv import load_dotenv

# Make sure dotenv is loaded
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# For a few endpoints, the worry isn't about authentication, but rather authorization.
# Prevent some endpoints from being utilized (mainly DELETE/POST routes) unless a query key
# is provided that matches a randomly generated string in memory.
DATA_UPDATE_KEY = os.getenv("DATA_UPDATE_KEY")

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def init_db():
    # This creates the tables in the database if they do not exist
    Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def authenticate_query_param(secret_key: str = Query(..., alias="secret_key")):
    """
    This dependency checks if the query parameter matches the expected secret key from the environment variable.
    """
    if secret_key != DATA_UPDATE_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return True
