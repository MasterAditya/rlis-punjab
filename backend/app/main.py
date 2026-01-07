from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import endpoints

# 1. Initialize the App
app = FastAPI(
    title="RLIS Punjab",
    description="Rural Logistics Intelligence System - Punjab",
    version="1.0.0"
)

# 2. CORS Configuration (THE FIX)
# This tells the browser: "It is okay to accept requests from localhost:3000"
origins = [
    "http://localhost:3000",  # React Frontend
    "http://127.0.0.1:3000",
    "*"                       # Allow all (for development ease)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allow GET, POST, PUT, DELETE
    allow_headers=["*"],
)

# 3. Include Routes
app.include_router(endpoints.router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"status": "active", "system": "RLIS Punjab (Docker)"}