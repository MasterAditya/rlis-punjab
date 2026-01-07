# train_nlp.py: Logic for RLIS Punjab Project
import pandas as pd
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import CountVectorizer, TfidfTransformer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report

# --- CONFIGURATION ---
DATA_FILE = "punjab_logistics_raw.csv"

# FIX: Save to 'ml_models' to avoid conflict with database 'models.py'
MODEL_DIR = "app/ml_models/punjab_logistics_v1" 
MODEL_PATH = os.path.join(MODEL_DIR, "incident_classifier.pkl")

def train_model():
    print("🧠 Starting AI Training Sequence...")

    # 1. Load Data
    if not os.path.exists(DATA_FILE):
        print(f"❌ Error: {DATA_FILE} not found.")
        return

    df = pd.read_csv(DATA_FILE)
    print(f"   -> Loaded {len(df)} rows of data.")

    # 2. Split Data
    X = df["raw_message"] 
    y = df["category_label"]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # 3. Build the Pipeline
    text_clf = Pipeline([
        ('vect', CountVectorizer(ngram_range=(1, 2))), 
        ('tfidf', TfidfTransformer()),
        ('clf', MultinomialNB()),
    ])

    # 4. Train
    print("   -> Training model on messy text...")
    text_clf.fit(X_train, y_train)

    # 5. Evaluate
    predictions = text_clf.predict(X_test)
    accuracy = (predictions == y_test).mean()
    print(f"✅ Model Accuracy: {accuracy:.2%}")

    # 6. Save the Brain
    if not os.path.exists(MODEL_DIR):
        os.makedirs(MODEL_DIR)
        
    joblib.dump(text_clf, MODEL_PATH)
    print(f"💾 Model saved to: {MODEL_PATH}")
    print("🚀 Ready for integration with Backend!")

if __name__ == "__main__":
    train_model()