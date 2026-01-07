# backend/app/models.py
from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class Location(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    type = Column(String)
    lat = Column(Float)
    lng = Column(Float)

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String)
    location = Column(String)
    category = Column(String)
    priority = Column(String)
    status = Column(String, default="Open")
    timestamp = Column(DateTime(timezone=True), server_default=func.now())