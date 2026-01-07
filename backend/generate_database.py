import pandas as pd
import random
from datetime import datetime, timedelta

# --- CONFIGURATION ---
NUM_LOGS = 1000  # Increased to 1000 for better training data
START_DATE = datetime(2025, 10, 1)

# --- 1. EXPANDED LOCATIONS (The Map) ---
# We split them by type to create context-aware messages
LOCATIONS = {
    "hubs": ["Ludhiana Transport Nagar", "Jalandhar Bypass", "Rajpura Toll", "Amritsar Gate", "Bathinda Refinery"],
    "mandis": ["Khanna Mandi", "Sahnewal Mandi", "Jagraon Mandi", "Moga Grain Market", "Sirhind Mandi"],
    "villages": ["Raikot", "Doraha", "Machhiwara", "Samrala", "Phillaur", "Nakodar", "Malerkotla"],
    "roads": ["NH-44", "GT Road", "Ferozepur Road", "Canal Road", "Link Road #5"]
}

# --- 2. VOCABULARY BUILDER (The "Lego Blocks") ---
# We build sentences dynamically: [Subject] [Problem] [Context]
VOCAB = {
    "subjects": ["Tractor", "Trolley", "Truck", "Canter", "Tanker", "Gaadi"],
    "actions_traffic": ["stuck", "phas gya", "jammed", "blocked", "stopped", "khada hai"],
    "actions_accident": ["overturned", "palat gya", "hit divider", "accident ho gya", "crashed"],
    "reasons_harvest": ["unloading", "paddy bags", "slow gate entry", "overloading check", "labor shortage"],
    "reasons_weather": ["fog", "dhund", "smog", "heavy rain", "waterlogging", "slippery road"],
    "reasons_protest": ["dharna", "union block", "road roko", "strike", "police barricade"],
    "adjectives": ["very bad", "boht heavy", "total", "pura", "dead", "slow"]
}

# --- 3. NOISE INJECTOR (The "Messiness") ---
def add_noise(text):
    """Simulates typos, shorthand, and Hinglish specific to drivers."""
    replacements = {
        "road": ["rd", "rod", "rasta"],
        "blocked": ["blokd", "block", "band"],
        "traffic": ["jam", "trfic", "rush"],
        "accident": ["accdnt", "thuk gyi"],
        "near": ["nr", "pass"],
        "please": ["plz", "pls"],
        "waiting": ["wait", "wtg"],
        "brother": ["bhai", "paaji", "bro"]
    }
    
    words = text.split()
    new_words = []
    for word in words:
        # 30% chance to swap a word with a slang/shorthand version
        if word.lower() in replacements and random.random() < 0.3:
            new_words.append(random.choice(replacements[word.lower()]))
        else:
            new_words.append(word)
            
    # 10% chance to drop vowels (e.g., "Truck" -> "Trck")
    final_text = " ".join(new_words)
    if random.random() < 0.1:
        final_text = final_text.replace("a", "").replace("e", "").replace("i", "").replace("o", "").replace("u", "")
        
    return final_text.lower() # Drivers mostly type lowercase

# --- 4. GENERATION ENGINE ---
data = []
print("🚚 Generating REAL WORLD Punjab Logistics Data...")

for _ in range(NUM_LOGS):
    # Time & Seasonality
    random_days = random.randint(0, 30)
    log_time = START_DATE + timedelta(days=random_days, hours=random.randint(0, 23), minutes=random.randint(0, 59))
    hour = log_time.hour
    
    # Select Category based on time (Night = Fog, Day = Traffic)
    if 20 <= hour or hour <= 6:
        category = random.choices(["smog_fog", "rural_hazard", "clear"], weights=[0.5, 0.3, 0.2])[0]
    else:
        category = random.choices(["harvest_traffic", "protest_dharna", "clear", "vehicle_breakdown"], weights=[0.4, 0.2, 0.2, 0.2])[0]

    # Build the Raw Message
    loc = random.choice(LOCATIONS["hubs"] + LOCATIONS["mandis"] + LOCATIONS["villages"] + LOCATIONS["roads"])
    severity = 0
    
    if category == "harvest_traffic":
        # Template: "Trolley stuck near Khanna Mandi due to unloading"
        sub = random.choice(VOCAB["subjects"])
        act = random.choice(VOCAB["actions_traffic"])
        reason = random.choice(VOCAB["reasons_harvest"])
        adj = random.choice(VOCAB["adjectives"])
        raw = f"{adj} traffic. {sub} {act} near {loc} due to {reason}."
        severity = random.randint(4, 7)

    elif category == "smog_fog":
        # Template: "Zero visibility on NH-44 due to dhund"
        reason = random.choice(VOCAB["reasons_weather"])
        raw = f"Zero visibility near {loc}. {reason} is {random.choice(VOCAB['adjectives'])}. Driving slow."
        severity = random.randint(7, 9)

    elif category == "protest_dharna":
        # Template: "Road blocked at Shambhu Border by Union"
        act = random.choice(VOCAB["actions_traffic"])
        reason = random.choice(VOCAB["reasons_protest"])
        raw = f"{loc} {act} by {reason}. Total jam. Avoid this route."
        severity = 10

    elif category == "rural_hazard":
        # Template: "Cattle on road near Raikot"
        hazard = random.choice(["Cattle", "Stray cows", "Electric wire", "Mud", "Pothole"])
        raw = f"{hazard} on road near {loc}. Risk of accident. {random.choice(VOCAB['actions_traffic'])}."
        severity = random.randint(3, 6)

    elif category == "vehicle_breakdown":
         # Template: "Tyre burst near Doraha"
        issue = random.choice(["Tyre burst", "Engine heat", "Break fail", "Diesel over", "Clutch plate gya"])
        raw = f"My {random.choice(VOCAB['subjects'])} stopped at {loc}. {issue}. Need mechanic."
        severity = 2

    else: # Clear
        raw = f"Crossed {loc}. Road clear. Reaching on time."
        severity = 0

    # Apply the "Real World" Messiness
    final_message = add_noise(raw)

    data.append({
        "timestamp": log_time.strftime("%Y-%m-%d %H:%M:%S"),
        "location_reported": loc,
        "raw_message": final_message,
        "category_label": category,
        "severity_score": severity
    })

# --- 5. EXPORT ---
df = pd.DataFrame(data).sort_values(by="timestamp")
df.to_csv("punjab_logistics_raw.csv", index=False)

print(f"✅ Generated {NUM_LOGS} complex logs.")
print("🔍 Preview (Notice the variations):")
print(df[["category_label", "raw_message"]].head(10).to_string())