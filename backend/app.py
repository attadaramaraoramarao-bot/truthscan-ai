"""
Flask API Server for AI-Powered Fake News Detection System
Exposes /health, /predict (ML only), and /analyze (ML + LLM + Evidence).
"""

import os
import sys
import logging
from typing import Dict, Any
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("FakeNewsAPI")

app = Flask(__name__)
# Enable CORS for Next.js frontend
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Import local modules
from nlp_pipeline import clean_text, extract_stylistic_features, extract_informative_keywords
from llm_analyzer import analyze_with_llm
from evidence_verifier import verify_claims

# Global ML artifacts
model = None
vectorizer = None

def load_ml_artifacts():
    global model, vectorizer
    import joblib
    base_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(base_dir, "model.pkl")
    vec_path = os.path.join(base_dir, "tfidf_vectorizer.pkl")

    if not os.path.exists(model_path) or not os.path.exists(vec_path):
        logger.info("Model artifacts not found. Training model now...")
        from train_model import train_and_save
        train_and_save()

    try:
        model = joblib.load(model_path)
        vectorizer = joblib.load(vec_path)
        logger.info("Successfully loaded ML model and TF-IDF vectorizer.")
    except Exception as e:
        logger.error(f"Failed loading ML artifacts: {e}")
        model = None
        vectorizer = None

# Attempt loading at startup
try:
    load_ml_artifacts()
except Exception as e:
    logger.warning(f"Could not initialize ML model on startup: {e}")

@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "AI-Powered Fake News Detection & Verification API",
        "ml_model_loaded": model is not None,
        "tfidf_vectorizer_loaded": vectorizer is not None,
        "llm_provider_configured": bool(os.getenv("OPENAI_API_KEY"))
    }), 200

def run_ml_inference(text: str) -> Dict[str, Any]:
    """Runs NLP preprocessing and ML classification with calibrated probability."""
    cleaned = clean_text(text)
    features = extract_stylistic_features(text)
    keywords = extract_informative_keywords(text)

    if model is not None and vectorizer is not None:
        vec = vectorizer.transform([cleaned])
        pred_int = int(model.predict(vec)[0])
        # Predict probabilities: index 0 = REAL, index 1 = FAKE
        probs = model.predict_proba(vec)[0]
        fake_prob = float(probs[1])
        real_prob = float(probs[0])
        
        prediction = "FAKE" if pred_int == 1 else "REAL"
        confidence = round(max(fake_prob, real_prob) * 100, 1)
        credibility = round(real_prob * 100)
    else:
        # Resilient heuristic fallback if ML binary is not yet compiled
        clickbait_factor = features["clickbait_score"]
        if clickbait_factor > 45 or features["all_caps_ratio"] > 0.2:
            prediction = "FAKE"
            confidence = min(94.0, 60.0 + clickbait_factor * 0.4)
            credibility = max(10, 100 - int(confidence))
        else:
            prediction = "REAL"
            confidence = 78.5
            credibility = 82

    threat_level = "CRITICAL" if (prediction == "FAKE" and confidence > 88) else \
                   "HIGH" if prediction == "FAKE" else \
                   "MEDIUM" if features["clickbait_score"] > 30 else "LOW"

    return {
        "prediction": prediction,
        "confidence": confidence,
        "credibilityScore": credibility,
        "threatLevel": threat_level,
        "trustScore": credibility,
        "sentiment": features["sentiment"],
        "emotions": features["emotions"],
        "keywords": keywords,
        "riskFactors": features["risk_factors"],
        "clickbaitScore": features["clickbait_score"]
    }

@app.route("/api/predict", methods=["POST"])
def predict_endpoint():
    """Predicts REAL / FAKE using ML and NLP alone."""
    data = request.get_json(silent=True) or {}
    text = (data.get("text") or data.get("article") or "").strip()
    headline = (data.get("headline") or "").strip()

    if headline:
        full_text = f"{headline}. {text}".strip()
    else:
        full_text = text

    if not full_text:
        return jsonify({"error": "Missing or empty news text."}), 400

    if len(full_text) > 10000:
        return jsonify({"error": "Submitted text exceeds maximum length of 10,000 characters."}), 413

    ml_result = run_ml_inference(full_text)
    return jsonify(ml_result), 200

@app.route("/api/analyze", methods=["POST"])
def analyze_endpoint():
    """Combined ML + LLM + Evidence verification endpoint."""
    data = request.get_json(silent=True) or {}
    text = (data.get("text") or data.get("article") or "").strip()
    headline = (data.get("headline") or "").strip()

    full_text = f"{headline}. {text}".strip() if headline else text

    # Validation
    if not full_text:
        return jsonify({"error": "Empty input. Please provide news text or a headline to analyze."}), 400

    if len(full_text) > 10000:
        return jsonify({"error": "Text is too large. Please limit to 10,000 characters."}), 413

    try:
        # Phase 1: ML & NLP Pipeline
        ml_result = run_ml_inference(full_text)

        # Phase 2: LLM Deep Contextual Analysis
        llm_result = analyze_with_llm(
            full_text,
            ml_prediction=ml_result["prediction"],
            ml_confidence=ml_result["confidence"]
        )

        # Phase 3: Evidence-Based Verification
        evidence_result = verify_claims(full_text)

        # Synthesize combined response
        response_payload = {
            # Backward-compatible fields for existing UI components
            "prediction": ml_result["prediction"],
            "confidence": ml_result["confidence"],
            "credibilityScore": ml_result["credibilityScore"],
            "threatLevel": ml_result["threatLevel"],
            "trustScore": ml_result["trustScore"],
            "sentiment": ml_result["sentiment"],
            "emotions": ml_result["emotions"],
            "keywords": ml_result["keywords"],
            "riskFactors": ml_result["riskFactors"],
            
            # Dedicated ML details
            "ml_details": {
                "algorithm": "Multinomial Naive Bayes + TF-IDF Vectorizer",
                "prediction": ml_result["prediction"],
                "confidence": ml_result["confidence"],
                "clickbait_score": ml_result["clickbaitScore"]
            },

            # Dedicated LLM Analysis
            "llm_analysis": llm_result,

            # Dedicated Evidence Verification
            "evidence_verification": evidence_result,

            # Synthesis and Disagreement Handling
            "synthesis": {
                "ml_prediction": ml_result["prediction"],
                "llm_verdict": llm_result.get("llm_verdict"),
                "agrees": llm_result.get("ml_agreement", {}).get("agrees_with_ml", True),
                "agreement_explanation": llm_result.get("ml_agreement", {}).get("explanation", ""),
                "verification_status": evidence_result["overall_status"],
                "final_assessment": llm_result.get("final_assessment", ""),
                "limitations": llm_result.get("limitations", "")
            }
        }

        return jsonify(response_payload), 200

    except Exception as e:
        logger.error(f"Analysis error: {e}", exc_info=True)
        return jsonify({
            "error": "Internal analysis error occurred.",
            "details": str(e)
        }), 500

if __name__ == "__main__":
    port = int(os.getenv("FLASK_PORT", 5000))
    logger.info(f"Starting Flask server on port {port}...")
    app.run(host="127.0.0.1", port=port, debug=False)
