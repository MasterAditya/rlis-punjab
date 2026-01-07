# insights.py: Logic for RLIS Punjab Project
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# Base schema with shared attributes
class IncidentBase(BaseModel):
    raw_text: str

# Schema for CREATING an incident (Input from Frontend)
class IncidentCreate(IncidentBase):
    pass

# Schema for READING an incident (Output to Frontend)
class IncidentResponse(IncidentBase):
    id: int
    location: Optional[str] = None
    category: Optional[str] = None
    priority: str
    sentiment_score: Optional[float] = None
    status: str
    created_at: datetime

    # This tells Pydantic to treat SQLAlchemy models as valid dictionaries
    class Config:
        from_attributes = True  # Use 'orm_mode = True' if you are on Pydantic v1