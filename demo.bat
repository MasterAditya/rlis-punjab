@echo off
cd /d "%~dp0"
echo ===============================
echo DOCKERIZED RLIS DEMO - SECURE TUNNEL
echo ===============================

REM 1. Generate random password (using only letters and numbers)
set /a RAND=%RANDOM%
set PASSWORD=DemoPass%RAND%

REM 2. Start all Docker containers (db, backend, frontend)
echo Starting Docker services...
docker-compose up -d

REM 3. Wait for services to fully initialize (especially the DB)
echo Waiting 25 seconds for containers to initialize...
timeout /t 25

REM 4. SEED THE DATABASE
echo Seeding Postgres Database with necessary data...
REM This command executes the seeding script inside the running backend container
docker compose exec -e PYTHONPATH=. transit-backend python scripts/seed_postgre.py

REM 5. Start Secure Tunnel
echo Starting Secure Tunnel for Frontend (Port 3000)...
echo ------------------------------------------
echo ** 🔑 USERNAME: demo **
echo ** 🔑 PASSWORD: %PASSWORD% **
echo ------------------------------------------
echo.

REM --- Ngrok tunnels to the host's port 3000 ---
start "Ngrok Tunnel" ngrok http 3000 --basic-auth="demo:%PASSWORD%" --region=us --host-header=rewrite

REM Wait a few seconds for ngrok URL to be visible
timeout /t 5

echo ------------------------------------------
echo ** URL: Check the NEW 'Ngrok Tunnel' window for the 'Forwarding' link. **
echo ------------------------------------------
echo.

REM 6. Auto-close after 60 minutes and clean up Docker
timeout /t 3600
echo.
echo === AUTO-CLOSING TUNNEL AND SHUTTING DOWN DOCKER ===

REM Stop ngrok process
taskkill /F /IM ngrok.exe 2>nul

REM Stop and remove Docker containers
docker-compose down

echo Demo ended.
pause