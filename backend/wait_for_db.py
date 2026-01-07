import time
import os
import psycopg2
from urllib.parse import urlparse

# Get DB URL from environment
db_url = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@transit-db:5432/rlis_punjab")
result = urlparse(db_url)
username = result.username
password = result.password
database = result.path[1:]
hostname = result.hostname
port = result.port

print(f"Waiting for database at {hostname}:{port}...")

while True:
    try:
        conn = psycopg2.connect(
            dbname=database,
            user=username,
            password=password,
            host=hostname,
            port=port
        )
        conn.close()
        print("Database is ready!")
        break
    except psycopg2.OperationalError:
        print("Database not ready yet, retrying in 2 seconds...")
        time.sleep(2)