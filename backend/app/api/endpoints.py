import time
import random
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import engine, get_db, Base
from app.models import Location, Incident
from app.schemas.insights import IncidentCreate
from app.services.nlp.predictor import predictor

router = APIRouter()

# Create Tables
Base.metadata.create_all(bind=engine)

@router.get("/locations")
def get_locations(db: Session = Depends(get_db)):
    return db.query(Location).all()

@router.get("/incidents")
def get_incidents(db: Session = Depends(get_db)):
    return db.query(Incident).order_by(Incident.timestamp.desc()).all()

@router.post("/predict") # REMOVED strict response_model to allow flexible debug data
def predict_log(payload: IncidentCreate, db: Session = Depends(get_db)):
    start_time = time.time()
    
    # 1. AI PREDICTION
    ai_result = predictor.predict(payload.raw_text)
    
    # 2. GENERATE DEBUG INFO (The "Broken Tokens" logic happens here in Python)
    # Simple logic to identify "Hinglish" vs English words for display
    words = payload.raw_text.split()
    entities = [w for w in words if w[0].isupper()] # Capitalized words
    
    debug_info = {
        "lang": "Mix (Hinglish)" if any(x in payload.raw_text.lower() for x in ['hai', 'ho', 'gya', 'fas', 'wala']) else "English",
        "entities": entities[:3], # Show first 3 entities
        "sentiment": ai_result.get("sentiment_score", "Neutral"),
        "intent": ai_result.get("category", "General") + "_Detection",
        "processing_time": 0
    }

    # 3. CREATE DB RECORD
    new_incident = Incident(
        text=payload.raw_text,
        location=ai_result["location"],
        category=ai_result["category"],
        priority=ai_result["priority"],
        status="Open"
    )
    
    db.add(new_incident)
    db.commit()
    db.refresh(new_incident)

    # 4. COORDINATE LOGIC
    geo_target = [30.9010, 75.8573]
    if new_incident.location != "Unknown":
        loc_obj = db.query(Location).filter(Location.name == new_incident.location).first()
        if loc_obj:
            geo_target = [loc_obj.lat, loc_obj.lng]

    process_time = round((time.time() - start_time) * 1000, 2)
    debug_info["processing_time"] = f"{process_time}ms"

    # 5. RETURN EVERYTHING
    return {
        "incident": {
            "id": new_incident.id,
            "text": new_incident.text,
            "location": new_incident.location,
            "category": new_incident.category,
            "priority": new_incident.priority,
            "timestamp": new_incident.timestamp,
        },
        "geo_target": geo_target,
        "nlp_debug": debug_info # <--- The real backend data
    }