from fastapi import FastAPI, Depends
from dotenv import load_dotenv

from .database import init_db
from .routers import users, bets, data


load_dotenv()

app = FastAPI()

app.include_router(users.router)
app.include_router(bets.router)
app.include_router(data.router)

@app.on_event("startup")
def on_startup():
    init_db()

app.get("/")(lambda: {"message": "Welcome to the betting API!"})