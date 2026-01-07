from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from datetime import datetime
from app.core.database import Base

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    raw_text = Column(Text, nullable=False)
    location = Column(String, index=True)
    category = Column(String, index=True)
    priority = Column(String)
    sentiment_score = Column(Float, default=0.0)
    status = Column(String, default="Open")
    created_at = Column(DateTime, default=datetime.utcnow)

# --- FIX: Ensure indentation matches above ---
class Location(Base):
    __tablename__ = "locations"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    type = Column(String)
    lat = Column(Float)
    lng = Column(Float)