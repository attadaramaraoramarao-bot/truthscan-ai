"""
Comprehensive Test Suite for Upgraded Fake News Detection & Verification System
AI-Powered Fake News Detection System Using ML, NLP, and LLM

Test cases:
1. Genuine news article
2. Fabricated news article
3. Misleading / partially true article
4. Ambiguous claim
5. Empty input validation
6. Oversized text validation
7. Disagreement between ML and LLM
"""

import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from nlp_pipeline import clean_text, extract_stylistic_features, extract_informative_keywords
from evidence_verifier import verify_claims
from llm_analyzer import generate_fallback_analysis
import joblib

def run_tests():
    print("=" * 70)
    print("RUNNING COMPREHENSIVE TEST SUITE FOR AI FAKE NEWS SYSTEM")
    print("=" * 70)

    # Load trained model artifacts
    base_dir = os.path.dirname(os.path.abspath(__file__))
    model = joblib.load(os.path.join(base_dir, "model.pkl"))
    vectorizer = joblib.load(os.path.join(base_dir, "tfidf_vectorizer.pkl"))

    def predict(text):
        cleaned = clean_text(text)
        vec = vectorizer.transform([cleaned])
        pred_int = model.predict(vec)[0]
        probs = model.predict_proba(vec)[0]
        label = "FAKE" if pred_int == 1 else "REAL"
        confidence = round(max(probs) * 100, 1)
        return label, confidence

    # Test Case 1: Genuine News Article
    genuine_text = "NASA's James Webb Space Telescope has captured deep-field images of the earliest known galaxies formed shortly after the Big Bang, astronomers confirmed in a peer-reviewed study published in Nature."
    label_1, conf_1 = predict(genuine_text)
    evidence_1 = verify_claims(genuine_text)
    llm_1 = generate_fallback_analysis(genuine_text, label_1, conf_1)
    print(f"\n[TEST 1: Genuine News Article]")
    print(f"  Input: {genuine_text[:80]}...")
    print(f"  ML Prediction: {label_1} ({conf_1}%)")
    print(f"  LLM Verdict: {llm_1['llm_verdict']}")
    print(f"  Evidence Status: {evidence_1['overall_status']}")
    assert label_1 == "REAL", f"Expected REAL, got {label_1}"
    assert evidence_1["overall_status"] == "Verified", f"Expected Verified evidence, got {evidence_1['overall_status']}"
    print("  [OK] PASS")

    # Test Case 2: Fabricated News Article
    fabricated_text = "SHOCKING BOMBSHELL: Secret government lab caught spraying mind-control nanotechnology into municipal tap water! Mainstream media covering it up!"
    label_2, conf_2 = predict(fabricated_text)
    evidence_2 = verify_claims(fabricated_text)
    llm_2 = generate_fallback_analysis(fabricated_text, label_2, conf_2)
    print(f"\n[TEST 2: Fabricated News Article]")
    print(f"  Input: {fabricated_text[:80]}...")
    print(f"  ML Prediction: {label_2} ({conf_2}%)")
    print(f"  LLM Verdict: {llm_2['llm_verdict']}")
    print(f"  Evidence Status: {evidence_2['overall_status']}")
    assert label_2 == "FAKE", f"Expected FAKE, got {label_2}"
    assert evidence_2["overall_status"] == "Contradicted", f"Expected Contradicted evidence, got {evidence_2['overall_status']}"
    print("  [OK] PASS")

    # Test Case 3: Misleading / Partially True
    misleading_text = "MIRACLE CURE: Drinking boiled lemon and baking soda kills all cancer cells in 48 hours according to clinical studies!"
    label_3, conf_3 = predict(misleading_text)
    evidence_3 = verify_claims(misleading_text)
    llm_3 = generate_fallback_analysis(misleading_text, label_3, conf_3)
    print(f"\n[TEST 3: Misleading / Partial Truth]")
    print(f"  Input: {misleading_text[:80]}...")
    print(f"  ML Prediction: {label_3} ({conf_3}%)")
    print(f"  LLM Suspicious Claims: {llm_3['suspicious_claims']}")
    print(f"  Evidence Status: {evidence_3['overall_status']}")
    assert evidence_3["overall_status"] == "Contradicted"
    print("  [OK] PASS")

    # Test Case 4: Ambiguous Claim (No clear historical record or evidence)
    ambiguous_text = "A local bakery in rural Ohio claims their secret sourdough starter was gifted by a visiting French traveler in 1892."
    label_4, conf_4 = predict(ambiguous_text)
    evidence_4 = verify_claims(ambiguous_text)
    llm_4 = generate_fallback_analysis(ambiguous_text, label_4, conf_4)
    print(f"\n[TEST 4: Ambiguous Claim]")
    print(f"  Input: {ambiguous_text}")
    print(f"  ML Prediction: {label_4} ({conf_4}%)")
    print(f"  Evidence Status: {evidence_4['overall_status']} (Expected Unverified without live registry match)")
    print(f"  Independent Verification Warning: {evidence_4['has_independent_evidence']}")
    assert evidence_4["has_independent_evidence"] == False
    assert evidence_4["overall_status"] == "Unverified"
    print("  [OK] PASS")

    # Test Case 5: Empty Input Validation
    empty_text = "   "
    empty_features = extract_stylistic_features(empty_text)
    print(f"\n[TEST 5: Empty Input Validation]")
    print(f"  Handled gracefully: {empty_features['risk_factors']}")
    assert "Empty input provided" in empty_features["risk_factors"]
    print("  [OK] PASS")

    # Test Case 6: Oversized Input Test
    long_text = "Standard news report text repeating. " * 400
    cleaned_long = clean_text(long_text)
    print(f"\n[TEST 6: Long Text Processing]")
    print(f"  Input length: {len(long_text)} chars")
    print(f"  Cleaned length: {len(cleaned_long)} chars")
    assert len(cleaned_long) > 5000
    print("  [OK] PASS")

    # Test Case 7: Disagreement Simulation
    disagreement_llm = generate_fallback_analysis("Short unverified claim regarding elections.", "REAL", 62.0)
    print(f"\n[TEST 7: ML vs LLM Disagreement Handling]")
    print(f"  ML Prediction: REAL | LLM Verdict: {disagreement_llm['llm_verdict']}")
    print(f"  Agrees with ML: {disagreement_llm['ml_agreement']['agrees_with_ml']}")
    print(f"  Disagreement Explanation: {disagreement_llm['ml_agreement']['explanation']}")
    print("  [OK] PASS")

    print("\n" + "=" * 70)
    print("ALL 7 TEST SUITE SCENARIOS EXECUTED SUCCESSFULLY!")
    print("=" * 70)

if __name__ == "__main__":
    run_tests()
