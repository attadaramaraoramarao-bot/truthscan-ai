"""
NLP Preprocessing and Feature Extraction Pipeline
AI-Powered Fake News Detection System
"""

import re
import math
from typing import List, Dict, Any, Tuple

# Preserved negation and epistemic markers that should NOT be dropped as stopwords
PRESERVED_TOKENS = {
    "not", "no", "never", "none", "neither", "nor", "cannot", "without",
    "against", "but", "however", "although", "claimed", "alleged", "supposedly"
}

# Standard English stopwords
STANDARD_STOPWORDS = {
    "a", "about", "above", "after", "again", "all", "am", "an", "and", "any",
    "are", "aren't", "as", "at", "be", "because", "been", "before", "being",
    "below", "between", "both", "by", "can", "could", "did", "didn't", "do",
    "does", "doesn't", "doing", "don't", "down", "during", "each", "few", "for",
    "from", "further", "had", "hadn't", "has", "hasn't", "have", "haven't",
    "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers",
    "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll",
    "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its",
    "itself", "let's", "me", "more", "most", "mustn't", "my", "myself",
    "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours",
    "ourselves", "out", "over", "own", "same", "shan't", "she", "she'd",
    "she'll", "she's", "should", "shouldn't", "so", "some", "such", "than",
    "that", "that's", "the", "their", "theirs", "them", "themselves", "then",
    "there", "there's", "these", "they", "they'd", "they'll", "they're",
    "they've", "this", "those", "through", "to", "too", "under", "until", "up",
    "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were",
    "weren't", "what", "what's", "when", "when's", "where", "where's", "which",
    "while", "who", "who's", "whom", "why", "why's", "with", "won't", "would",
    "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours",
    "yourself", "yourselves"
} - PRESERVED_TOKENS

# Sensationalist and clickbait keywords frequently observed in disinformation
CLICKBAIT_PATTERNS = [
    r"\bshocking\b", r"\bunbelievable\b", r"\byou won't believe\b",
    r"\bsecret revealed\b", r"\bmiracle cure\b", r"\bconspiracy\b",
    r"\bthey don't want you to know\b", r"\bviral\b", r"\bbombshell\b",
    r"\bexposed\b", r"\bmainstream media is lying\b", r"\burgent share\b",
    r"\bhidden truth\b", r"\bcover[\s-]?up\b", r"\bwhat happened next\b"
]

# Lexicon for emotion and sentiment analysis
EMOTION_LEXICON = {
    "fear": {
        "danger", "threat", "terrifying", "warning", "deadly", "crisis", "fatal",
        "collapse", "catastrophe", "panic", "fear", "scare", "horrific", "epidemic",
        "ruin", "destroy", "hazard", "lethal", "toxic", "peril"
    },
    "anger": {
        "outrage", "furious", "corrupt", "betrayal", "treason", "scandal", "lie",
        "liar", "fraud", "con", "evil", "disgrace", "shameful", "crime", "illegal",
        "furious", "infuriating", "rigged", "thief", "crook"
    },
    "joy": {
        "breakthrough", "success", "triumph", "celebrate", "peace", "hope",
        "cure", "recovery", "progress", "advance", "victory", "safe", "miracle",
        "thrive", "flourish", "inspiring", "remarkable", "positive"
    },
    "sadness": {
        "tragedy", "loss", "death", "grief", "victim", "mourn", "suffering",
        "despair", "failed", "sorrow", "casualty", "devastating", "heartbreaking"
    },
    "trust": {
        "confirmed", "verified", "official", "study", "research", "peer-reviewed",
        "evidence", "documented", "expert", "scientists", "court", "reuters",
        "associated press", "university", "published", "statement", "source"
    }
}

POSITIVE_WORDS = {
    "verified", "confirmed", "authentic", "accurate", "official", "proven",
    "credible", "evidence", "reliable", "trustworthy", "scientific", "consensus",
    "breakthrough", "recovery", "peace", "truth", "genuine", "validated"
}

NEGATIVE_WORDS = {
    "fake", "hoax", "false", "misleading", "fraud", "scam", "corrupt", "deceit",
    "unverified", "fabricated", "lie", "rigged", "conspiracy", "rumor", "danger",
    "scandal", "outrage", "bizarre", "disaster", "hoaxes", "denial", "coverup"
}

def clean_text(text: str) -> str:
    """Cleans input text for NLP and TF-IDF feature extraction."""
    if not text:
        return ""
    # Normalize unicode and whitespace
    text = text.strip()
    # Remove URLs
    text = re.sub(r"https?://\S+|www\.\S+", " ", text)
    # Remove email addresses
    text = re.sub(r"\S+@\S+", " ", text)
    # Remove non-alphabetical characters except basic punctuation
    text = re.sub(r"[^a-zA-Z0-9\s.,!?'\"-]", " ", text)
    # Collapse consecutive spaces
    text = re.sub(r"\s+", " ", text)
    return text.strip()

def tokenize(text: str, remove_stopwords: bool = True) -> List[str]:
    """Tokenizes text and optionally filters standard stopwords."""
    cleaned = clean_text(text).lower()
    tokens = re.findall(r"\b[a-z]{2,}\b", cleaned)
    if remove_stopwords:
        tokens = [t for t in tokens if t not in STANDARD_STOPWORDS]
    return tokens

def extract_stylistic_features(raw_text: str) -> Dict[str, Any]:
    """
    Extracts surface-level and stylistic features from the input text:
    - Uppercase ratio (all-caps shouting)
    - Exclamation and question mark density
    - Clickbait pattern hits
    - Sentiment distribution
    - Emotion distribution
    """
    total_len = len(raw_text.strip())
    if total_len == 0:
        return {
            "all_caps_ratio": 0.0,
            "exclamation_count": 0,
            "question_count": 0,
            "clickbait_hits": [],
            "clickbait_score": 0,
            "sentiment": {"positive": 33, "neutral": 34, "negative": 33},
            "emotions": {"fear": 10, "anger": 10, "joy": 20, "sadness": 10, "trust": 50},
            "risk_factors": ["Empty input provided"]
        }

    # All-caps ratio (excluding spaces)
    alphas = [c for c in raw_text if c.isalpha()]
    caps = [c for c in alphas if c.isupper()]
    all_caps_ratio = (len(caps) / len(alphas)) if alphas else 0.0

    # Punctuation counts
    exclamation_count = raw_text.count("!")
    question_count = raw_text.count("?")

    # Clickbait checks
    text_lower = raw_text.lower()
    clickbait_hits = []
    for pattern in CLICKBAIT_PATTERNS:
        match = re.search(pattern, text_lower)
        if match:
            clickbait_hits.append(match.group(0))

    # Emotion detection
    tokens = tokenize(raw_text, remove_stopwords=False)
    token_set = set(tokens)
    
    emotion_counts = {emotion: 0 for emotion in EMOTION_LEXICON}
    for emotion, words in EMOTION_LEXICON.items():
        count = len(token_set.intersection(words))
        emotion_counts[emotion] = count

    total_emotions = sum(emotion_counts.values()) or 1
    emotion_pcts = {
        k: max(5, min(90, int((v / total_emotions) * 100)))
        for k, v in emotion_counts.items()
    }

    # Sentiment analysis
    pos_matches = len(token_set.intersection(POSITIVE_WORDS))
    neg_matches = len(token_set.intersection(NEGATIVE_WORDS))
    
    if pos_matches == 0 and neg_matches == 0:
        sentiment = {"positive": 25, "neutral": 50, "negative": 25}
    else:
        tot_sent = pos_matches + neg_matches
        pos_pct = int((pos_matches / tot_sent) * 70) + 15
        neg_pct = int((neg_matches / tot_sent) * 70) + 15
        neutral_pct = max(10, 100 - (pos_pct + neg_pct))
        sentiment = {
            "positive": max(5, pos_pct),
            "neutral": neutral_pct,
            "negative": max(5, neg_pct)
        }

    # Surface risk factors
    risk_factors = []
    if all_caps_ratio > 0.25:
        risk_factors.append("High uppercase letter ratio indicates sensationalist tone")
    if exclamation_count >= 3:
        risk_factors.append("Excessive exclamation marks indicate emotional rhetoric")
    if clickbait_hits:
        risk_factors.append(f"Sensationalist phrasing detected: {', '.join(clickbait_hits[:3])}")
    if emotion_pcts["fear"] > 40 or emotion_pcts["anger"] > 40:
        risk_factors.append("Strong fear or anger evoking language patterns")

    if not risk_factors:
        risk_factors.append("Standard journalistic style markers observed")

    clickbait_score = min(100, int((len(clickbait_hits) * 30) + (all_caps_ratio * 40) + (min(exclamation_count, 5) * 6)))

    return {
        "all_caps_ratio": round(all_caps_ratio, 3),
        "exclamation_count": exclamation_count,
        "question_count": question_count,
        "clickbait_hits": clickbait_hits,
        "clickbait_score": clickbait_score,
        "sentiment": sentiment,
        "emotions": emotion_pcts,
        "risk_factors": risk_factors
    }

def extract_informative_keywords(text: str, top_n: int = 12) -> List[Dict[str, Any]]:
    """
    Extracts top informative keywords from text and associates polarity and salience score.
    """
    tokens = tokenize(text, remove_stopwords=True)
    if not tokens:
        return []

    # Frequency counting
    freq: Dict[str, int] = {}
    for t in tokens:
        if len(t) >= 4:
            freq[t] = freq.get(t, 0) + 1

    sorted_words = sorted(freq.items(), key=lambda x: x[1], reverse=True)[:top_n]
    max_count = sorted_words[0][1] if sorted_words else 1

    keywords = []
    for word, count in sorted_words:
        # Score normalized between 60 and 99
        score = int(60 + (count / max_count) * 39)
        if word in POSITIVE_WORDS or word in EMOTION_LEXICON["trust"]:
            word_type = "positive"
        elif word in NEGATIVE_WORDS or word in EMOTION_LEXICON["fear"] or word in EMOTION_LEXICON["anger"]:
            word_type = "negative"
        else:
            word_type = "neutral"
        keywords.append({"word": word, "score": score, "type": word_type})

    return keywords
