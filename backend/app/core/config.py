import os

class Settings:
    PROJECT_NAME: str = "RLIS Punjab"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # FIX: Point to PostgreSQL instead of SQLite
    # Update 'user', 'password', and 'db_name' to match your local setup
    DATABASE_URL: str = os.getenv(
    "DATABASE_URL", 
    "postgresql://postgres:password@localhost:5432/rlis_punjab" # CHANGE PASSWORD IF NEEDED
)

settings = Settings()