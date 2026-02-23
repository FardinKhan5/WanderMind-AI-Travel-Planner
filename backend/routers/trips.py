from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from typing import List

from core.database import get_db
from core.security import get_current_user
from models.user import User
from models.trip import Trip
from schemas.trip import TripSummary, TripDetail

# LangChain imports (shared with original main.py logic)
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field
from typing import List as TList
import os

router = APIRouter(prefix="/trips", tags=["trips"])

# ── LangChain Setup ───────────────────────────────────────────────────────────

class Activity(BaseModel):
    time: str = Field(description="Time of day, e.g. '9:00 AM'")
    title: str = Field(description="Short activity name")
    description: str = Field(description="2-3 sentence description")
    estimated_cost: str = Field(description="Estimated cost, e.g. '$20'")
    tips: str = Field(description="One practical insider tip")

class DayPlan(BaseModel):
    day: int
    theme: str = Field(description="Theme for the day, e.g. 'Cultural Immersion'")
    activities: TList[Activity]

class Itinerary(BaseModel):
    destination: str
    summary: str = Field(description="2-sentence trip overview")
    days: TList[DayPlan]
    essential_tips: TList[str] = Field(description="3-5 must-know tips for this destination")
    estimated_total_cost: str

parser = PydanticOutputParser(pydantic_object=Itinerary)

prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        """You are an expert travel planner with deep knowledge of destinations worldwide.
Create detailed, realistic, and exciting travel itineraries tailored to the traveler's preferences.
Be specific with place names, timings, and costs. Make it feel like advice from a well-traveled friend.

{format_instructions}""",
    ),
    (
        "human",
        """Plan a {days}-day trip to {destination}.
Budget level: {budget}
Interests: {interests}

Create a day-by-day itinerary with morning, afternoon, and evening activities each day.
Include realistic cost estimates appropriate for a {budget} traveler.""",
    ),
])

def get_chain():
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        temperature=0.7,
        google_api_key=os.environ["GOOGLE_API_KEY"],
    )
    return prompt | llm | parser

# ── Request Schema ────────────────────────────────────────────────────────────

from pydantic import BaseModel as PM

class TripRequest(PM):
    destination: str
    days: int
    budget: str
    interests: TList[str]

# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.post("/plan", response_model=TripDetail, status_code=status.HTTP_201_CREATED)
async def generate_and_save(
    request: TripRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if request.days < 1 or request.days > 14:
        raise HTTPException(status_code=400, detail="Days must be between 1 and 14.")
    if not request.destination.strip():
        raise HTTPException(status_code=400, detail="Destination cannot be empty.")

    try:
        chain = get_chain()
        result: Itinerary = await chain.ainvoke({
            "days": request.days,
            "destination": request.destination,
            "budget": request.budget,
            "interests": ", ".join(request.interests),
            "format_instructions": parser.get_format_instructions(),
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    trip = Trip(
        owner_id=current_user.id,
        destination=request.destination,
        days=request.days,
        budget=request.budget,
        interests=request.interests,
        itinerary=result.model_dump(),
    )
    db.add(trip)
    db.commit()
    db.refresh(trip)
    return trip


@router.get("/history", response_model=List[TripSummary])
def get_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    trips = (
        db.query(Trip)
        .filter(Trip.owner_id == current_user.id)
        .order_by(Trip.created_at.desc())
        .all()
    )
    return trips


@router.get("/{trip_id}", response_model=TripDetail)
def get_trip(
    trip_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.owner_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found.")
    return trip


@router.delete("/{trip_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_trip(
    trip_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.owner_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found.")
    db.delete(trip)
    db.commit()
