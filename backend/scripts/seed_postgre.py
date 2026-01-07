import sys
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.core.database import Base
from app.core.config import settings
from app.models import Location

# --- 1. LOCATIONS TO INSERT ---
LOCATIONS = {
    "hubs": ["Ludhiana Transport Nagar", "Jalandhar Bypass", "Rajpura Toll", "Amritsar Gate", "Bathinda Refinery"],
    "mandis": ["Khanna Mandi", "Sahnewal Mandi", "Jagraon Mandi", "Moga Grain Market", "Sirhind Mandi"],
    "villages": ["Raikot", "Doraha", "Machhiwara", "Samrala", "Phillaur", "Nakodar", "Malerkotla"],
    # ADDED PHAGWARA HERE vvv
    "cities": ["Phagwara", "Hoshiarpur", "Ferozepur", "Patiala"], 
    "roads": ["NH-44", "GT Road", "Ferozepur Road", "Canal Road", "Link Road #5"]
}

# --- 2. COORDINATE MAPPING ---
COORDS = {
    "Ludhiana Transport Nagar": (30.9010, 75.8573),
    "Jalandhar Bypass": (30.9450, 75.8300),
    "Rajpura Toll": (30.4840, 76.5940),
    "Amritsar Gate": (31.6340, 74.8723),
    "Bathinda Refinery": (30.2110, 74.9455),
    "Khanna Mandi": (30.7070, 76.2170),
    "Sahnewal Mandi": (30.8500, 75.9700),
    "Jagraon Mandi": (30.7860, 75.4750),
    "Moga Grain Market": (30.8230, 75.1730),
    "Sirhind Mandi": (30.6300, 76.3900),
    "Raikot": (30.6500, 75.6000),
    "Doraha": (30.8000, 76.0300),
    "Machhiwara": (30.9100, 76.2000),
    "Samrala": (30.8400, 76.1900),
    "Phillaur": (31.0200, 75.7800),
    "Nakodar": (31.1300, 75.4700),
    "Malerkotla": (30.5200, 75.8900),
    # CITIES
    "Phagwara": (31.2240, 75.7708),
    "Hoshiarpur": (31.5143, 75.9115),
    "Ferozepur": (30.9237, 74.6100),
    "Patiala": (30.3398, 76.3869),
    # ROADS
    "NH-44": (30.9500, 75.9000),
    "GT Road": (30.8800, 76.1000),
    "Ferozepur Road": (30.8900, 75.8000),
    "Canal Road": (30.8700, 75.8300),
    "Link Road #5": (30.9200, 75.8800)
}

def seed_data():
    print("🌱 Connecting to PostgreSQL...")
    engine = create_engine(settings.DATABASE_URL)
    SessionLocal = sessionmaker(bind=engine)
    session = SessionLocal()

    Base.metadata.create_all(bind=engine)

    # CLEAR OLD DATA to ensure Phagwara gets added
    print("🧹 Wiping old location data...")
    session.query(Location).delete()
    session.commit()

    print("🚀 Seeding Updated Nodes (including Phagwara)...")
    
    new_locations = []
    
    for category, names in LOCATIONS.items():
        db_type = "Village"
        if category == "hubs": db_type = "Hub"
        elif category == "mandis": db_type = "Mandi"
        elif category == "cities": db_type = "City"
        elif category == "roads": db_type = "Road"
        
        for name in names:
            lat, lng = COORDS.get(name, (30.9000, 75.8500))
            loc = Location(name=name, type=db_type, lat=lat, lng=lng)
            new_locations.append(loc)

    session.add_all(new_locations)
    session.commit()
    print(f"✅ Success! Added {len(new_locations)} locations.")
    session.close()

if __name__ == "__main__":
    seed_data()