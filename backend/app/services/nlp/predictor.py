import joblib
import os
import re

MODEL_PATH = os.path.join("app", "ml_models", "punjab_logistics_v1", "incident_classifier.pkl")

class IncidentPredictor:
    def __init__(self):
        self.model = None
        self._load_model()

    def _load_model(self):
        if os.path.exists(MODEL_PATH):
            try:
                self.model = joblib.load(MODEL_PATH)
                print(f"✅ AI Model Loaded from {MODEL_PATH}")
            except Exception as e:
                print(f"❌ Failed to load model: {e}")
        else:
            print(f"⚠️ Model not found at {MODEL_PATH}. Using fallback logic.")

    def predict(self, text):
        text_lower = text.lower()
        
        # 1. AI PREDICTION
        category = "General"
        if self.model:
            try:
                category = self.model.predict([text])[0]
            except:
                pass

        # 2. LOCATION LOGIC (Matches DB Names Exactly)
        location = "Unknown"
        if "ludhiana" in text_lower: location = "Ludhiana Transport Nagar"
        elif "khanna" in text_lower: location = "Khanna Mandi"
        elif "moga" in text_lower: location = "Moga Grain Market"
        elif "phagwara" in text_lower: location = "Phagwara"  # Now exists in DB
        elif "rajpura" in text_lower: location = "Rajpura Toll"
        elif "sahnewal" in text_lower: location = "Sahnewal Mandi"
        elif "doraha" in text_lower: location = "Doraha"
        
        # 3. PRIORITY & KEYWORD LOGIC (Comprehensive List)
        priority = "Low"
        
        # --- CRITICAL (Red) ---
        critical_keywords = [
            "accident", "fire", "leak", "blast", "explosion", 
            "palat", "overturned", "collision", "thuk", "takkar",
            "casualty", "dead", "dangerous", "chemical", "emergency",
            "crash", "oil spill", "pile up", "brake fail", "jal gya", "burst"
        ]
        
        # --- HIGH (Orange) ---
        high_keywords = [
            "jam", "blocked", "stuck", "chakka jam", "gridlock", 
            "fas gaye", "not moving", "closed", "dharna", "protest",
            "packed", "rush", "crawling", "long line", "lambi line", "stopped"
        ]
        
        # --- MEDIUM (Yellow) ---
        medium_keywords = [
            "fog", "dhund", "smog", "rain", "slow", "heavy traffic", 
            "wait", "queue", "visibility", "storm", "wind", "tree fallen",
            "water logging", "slippery", "smoke"
        ]

        # --- LOW (Green) - Explicit Check ---
        low_keywords = [
            "clear", "smooth", "reached", "unload", "safe", 
            "good", "open", "normal", "leaving", "done", "complete", "khul gya"
        ]

        # LOGIC CHAIN (Order Matters: Critical > High > Med > Low)
        if any(w in text_lower for w in critical_keywords):
            priority = "Critical"
            category = "Accident/Hazard"
        elif any(w in text_lower for w in high_keywords):
            priority = "High"
            category = "Traffic Jam"
        elif any(w in text_lower for w in medium_keywords):
            priority = "Medium"
            category = "Weather/Slow"
        elif any(w in text_lower for w in low_keywords):
            priority = "Low"
            category = "Logistics Update"

        return {
            "category": category.title(),
            "priority": priority,
            "location": location,
            "sentiment_score": "Negative" if priority in ["Critical", "High"] else "Neutral"
        }

    def _heuristic_predict(self, text):
        return self.predict(text)

predictor = IncidentPredictor()