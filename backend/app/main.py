from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from .database import init_db
from .routers import users, bets, data


load_dotenv()

from fastapi import FastAPI

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(bets.router)
app.include_router(data.router)


@app.on_event("startup")
def on_startup():
    init_db()


app.get("/")(lambda: {"message": "Welcome to the betting API!"})
