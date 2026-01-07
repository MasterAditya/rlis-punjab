🚚 RLIS — Rural Logistics Intelligence System (Punjab)

AI-powered geospatial command center turning messy rural driver logs into live, explainable, actionable intelligence.

🧐 Problem

In rural logistics, trucks often get stuck due to:

Traffic jams (chakka jam)

Protests (dharna)

Accidents (gaadi palat gayi)

Broken roads (road band)

Local chaos

The challenge: The reasons are buried in messy, unstructured Hinglish logs, which traditional GPS systems ignore:

"Moga mandi ke bahar chakka jam hai"
"Truck fas gaya, road band"
"Accident ho gaya, gaadi palat gayi"

Traditional GPS shows where the truck is. RLIS tells you why.

🖥️ Dashboard Preview


Full command center view with map, control panel, and Glass Box reasoning.

📊 System Flowchart


High-level data & control flow: Frontend → Backend → NLP Pipeline → Database → Visualization

🧠 What RLIS Does

Ingests raw Hinglish/English driver logs

Processes logs through custom NLP + heuristic pipeline

Extracts:

Incident type (Jam, Accident, Protest, Fire, etc.)

Severity (Low / Medium / High / Critical)

Affected location node

Visualizes everything live on a geospatial Punjab map

Exposes AI reasoning via the Glass Box panel

✨ Key Features
Feature	Description
Hinglish Understanding	Parses rural slang like "chakka jam", "fas gaye", "palat gayi"
Hybrid Intelligence	ML classifier + deterministic safety layer ensures safety-critical events are never missed
Physics-Based Visualization	Severity-driven pulsing animations on map markers
Explainable AI	Glass Box panel shows token-level reasoning, sentiment, and severity
Spatial Intelligence	PostGIS-powered geospatial queries for precise mapping
Production Ready	Fully Dockerized, reproducible, scalable system
🎨 Severity Visualization

🔴 Critical = aggressive, fast pulse

🟠 High = medium pulse

🟡 Medium = slow pulse

🟢 Low = calm / static

🏗️ System Architecture
React (Vite) Frontend
↓
FastAPI Backend
↓
PostgreSQL + PostGIS
↓
NLP Pipeline + Heuristic Safety Engine

🛠️ Tech Stack
Layer	Technology
Frontend	React + Vite + Mantine UI + React-Leaflet
Backend	FastAPI (Python 3.11)
Database	PostgreSQL + PostGIS
AI/NLP	Scikit-learn (CountVectorizer + TF-IDF), Multinomial Naive Bayes, Heuristic Safety Layer
Infrastructure	Docker + Docker Compose
🚀 Quick Start
# Clone the repo
git clone <repository-url>
cd rlis-punjab

# Build and run all services
docker compose up --build

# Access points:
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000/api/v1
# API Docs: http://localhost:8000/docs

⚙️ Optional Environment Variables
DB_WAIT_RETRIES: 60    # Number of database connection retries
DB_WAIT_SLEEP: 2       # Seconds between retries

🧪 System Behavior

Default state: All 22 Punjab nodes visible, calm map

Active state: Log entered → AI processes → Node lights up → Pulse animation → Incident feed updates → Glass Box reasoning displayed

💻 Frontend Components
Component	Purpose
App.jsx	Main state orchestrator & layout manager
ControlPanel.jsx	User interaction panel & Glass Box display
LogisticsMap.jsx	Geospatial rendering engine
api.js	HTTP networking bridge to backend API
🗄️ Database Schema

locations: Static Punjab nodes (hubs, mandis, villages)

incidents: Live log entries with geospatial metadata

🎨 Visual Design System

Theme: "Cyber-Logistics" aesthetic (deep dark backgrounds + neon accents)

Icons: Custom SVG markers for each location type

Animations: CSS @keyframes for severity pulses

🎯 Why This Matters

Handles real-world messiness: ambiguous Hinglish text, rural slang

Safety-first design: 100% recall for critical events via heuristic layer

Explainable AI: Operator trust built via Glass Box panel

Production ready: Dockerized, scalable, spatially indexed

Actionable intelligence: Converts raw logs into a visual command center

📁 Project Structure
rlis-punjab/
├── frontend/           # React Vite application
├── backend/            # FastAPI Python server
├── nlp_model/          # Trained ML models & vectorizers
├── assets/             # Images, diagrams, GIFs
├── docker-compose.yml  # Multi-container orchestration
└── README.md           # This document

🔮 Future Roadmap

Real-time WebSocket updates

Mobile driver app integration

Predictive delay forecasting

Multi-state expansion beyond Punjab

Weather integration for flood alerts

📄 License

MIT License — see LICENSE file for details

👥 Acknowledgments

Built for the unique challenges of rural Indian logistics.
Special thanks to logistics operators in Punjab for domain insights.

🚀 Turning rural chaos into actionable intelligence, one log at a time.
