from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from core.database import Base


class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Request params (for display in history)
    destination = Column(String, nullable=False)
    days = Column(Integer, nullable=False)
    budget = Column(String, nullable=False)
    interests = Column(JSON, nullable=False)  # list of strings

    # Full itinerary stored as JSON
    itinerary = Column(JSON, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner = relationship("User", back_populates="trips")