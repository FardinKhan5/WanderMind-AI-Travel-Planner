from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from core.database import engine, Base
import models.user  # noqa: ensure models are registered
import models.trip  # noqa

from routers import auth, users, trips

# Create all tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(title="WanderMind API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(trips.router)


@app.get("/")
def root():
    return {"message": "WanderMind API v2 is running 🌍"}