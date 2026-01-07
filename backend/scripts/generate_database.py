import pandas as pd
import random
from datetime import datetime, timedelta

# --- CONFIGURATION ---
NUM_LOGS = 500  # How many logs to generate
START_DATE = datetime(2025, 10, 1)  # Simulating October (Peak Harvest/Smog Season)

# --- 1. THE NODES & PATHS ---
LOCATIONS = [
    "Ludhiana (Industrial Area)", "Khanna (Grain Market)", "Jalandhar (Bypass)", 
    "Rajpura (Shambhu Border)", "Jagraon (Bridge)", "Raikot (Main Chowk)", 
    "Doraha (Canal Bridge)", "Machhiwara (Sabzi Mandi)", "NH-44 (Phillaur Cut)"
]

# --- 2. THE INCIDENT TEMPLATES (The "Messy" Input) ---
# We mix English, Hindi, and Punjabi words to simulate real driver texts.
INCIDENT_TYPES = {
    "harvest_traffic": [
        "Khanna mandi bahar 4 km lambi line hai, fas gaye.",
        "Trolley queue moving very slow, 2 hours wait.",
        "Road blocked by tractors, grains unloading ongoing.",
        "Mandi gate band hai, road pe hi khade hai.",
        "Bhai avoid Khanna, total chakka jam due to paddy trucks."
    ],
    "smog_fog": [
        "Zero visibility near Doraha, fog very heavy.",
        "Smog itna hai kuch nahi dikh raha, driving at 10kmph.",
        "Accident ho gya due to fog, road blocked.",
        "Boht dhund hai, lights kaam nahi kar rahi.",
        "Stubble burning smoke everywhere, eyes burning, stopped truck."
    ],
    "protest_dharna": [
        "Farmers protest at Shambhu border, road closed.",
        "Union walo ne toll plaza gher lia, no movement.",
        "Dharna chalu hai, police diverting traffic to village road.",
        "Road jam, kisan andolan slogans shouting.",
        "Highway bandh call, sab gaadiya side me laga di."
    ],
    "rural_hazard": [
        "Cattle herd sitting on road near Raikot, bacha lia mushkil se.",
        "Low hanging wire snagged on truck roof, waiting for electricity dept.",
        "Gaon wale raste pe tractor palat gya, rasta band.",
        "Stray cows on highway, sudden braking caused pile up.",
        "Village road too narrow, truck stuck in mud."
    ],
    "clear": [
        "Road clear, reaching on time.",
        "Traffic normal, crossed toll plaza.",
        "Delivery complete, returning to hub.",
        "Maal unload ho gya, no issues.",
        "Highway smooth, speed 60kmph."
    ]
}

# --- 3. GENERATION LOGIC ---
data = []

print("🚚 Starting Simulation: Punjab Logistics Engine...")

for _ in range(NUM_LOGS):
    # Random Timestamp within the window
    random_days = random.randint(0, 30)
    random_hours = random.randint(0, 23)
    random_minutes = random.randint(0, 59)
    log_time = START_DATE + timedelta(days=random_days, hours=random_hours, minutes=random_minutes)
    
    # Seasonality Logic (Bias)
    # If it's Night (8 PM - 6 AM), higher chance of Smog/Cattle
    # If it's Day (8 AM - 6 PM), higher chance of Harvest Traffic/Protest
    hour = log_time.hour
    
    weights = []
    # Keys: [Harvest, Smog, Protest, Rural, Clear]
    if 20 <= hour or hour <= 6:
        weights = [0.1, 0.4, 0.05, 0.3, 0.15] # Night: High Fog/Rural risk
    else:
        weights = [0.4, 0.05, 0.3, 0.1, 0.15] # Day: High Traffic/Protest risk

    category = random.choices(list(INCIDENT_TYPES.keys()), weights=weights, k=1)[0]
    
    # Pick a random template and inject noise (optional, keep simple for now)
    raw_text = random.choice(INCIDENT_TYPES[category])
    location = random.choice(LOCATIONS)
    
    # Assign Severity (for Ground Truth/Training)
    if category == "clear":
        severity = 0
    elif category == "rural_hazard":
        severity = 3
    elif category == "harvest_traffic":
        severity = 5
    elif category == "smog_fog":
        severity = 8
    elif category == "protest_dharna":
        severity = 10 # Critical blockage

    entry = {
        "timestamp": log_time.strftime("%Y-%m-%d %H:%M:%S"),
        "location_reported": location,
        "raw_message": raw_text, # The "Messy" Input
        "category_label": category, # The "Ground Truth" for ML
        "severity_score": severity  # Impact score
    }
    data.append(entry)

# --- 4. EXPORT ---
df = pd.DataFrame(data)
# Sort by time
df = df.sort_values(by="timestamp")

# Save to root directory
output_file = "punjab_logistics_raw.csv"
df.to_csv(output_file, index=False)

print(f"✅ Generated {NUM_LOGS} logs.")
print(f"📄 Saved to {output_file}")
print("🔍 Preview of first 5 logs:")
print(df[["timestamp", "location_reported", "raw_message"]].head().to_string())