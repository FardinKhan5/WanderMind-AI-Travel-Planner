from pydantic import BaseModel
from typing import List, Any
from datetime import datetime


class TripSummary(BaseModel):
    id: int
    destination: str
    days: int
    budget: str
    interests: List[str]
    created_at: datetime

    class Config:
        from_attributes = True


class TripDetail(TripSummary):
    itinerary: Any  # full itinerary JSON