# Use a light Python image
FROM python:3.11-slim

# Set work directory
WORKDIR /app

# Install system dependencies (needed for Postgres)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy ONLY the main requirements file
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the app
COPY . .
COPY wait_for_db.py ./

# Expose port
EXPOSE 8000

# Run the app
CMD ["sh", "-c", "python wait_for_db.py && uvicorn app.main:app --host 0.0.0.0 --port 8000"]