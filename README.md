# AI-Powered Fake News Detection and Verification System Using ML, NLP, and LLM

> **Project Title:** AI-Powered Fake News Detection and Verification System Using ML, NLP, and LLM (TruthScan AI)  
> **Tech Stack:** Python 3.13, Scikit-learn, Multinomial Naive Bayes, TF-IDF Vectorization, NLP Preprocessing, Large Language Models (OpenAI GPT-4o-mini / Local LLM), Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion.

---

## 🌟 Overview & Architecture

This system upgrades classical Fake News Detection (which traditionally relied solely on n-gram keyword frequencies and statistical classifiers) into a **modern tri-tier verification platform**. It preserves and leverages classical ML/NLP models for low-latency probability scoring while integrating Large Language Models (LLMs) and real-time evidence cross-referencing to provide human-interpretable explanations, identify logical fallacies, and verify factual assertions.

```
                              [ User Submits News Article / Headline ]
                                                 │
                                                 ▼
                             ┌───────────────────────────────────────┐
                             │    Next.js / Flask Secure Backend     │
                             │  (Input Sanitization & Length Guard)  │
                             └───────────────────┬───────────────────┘
                                                 │
                     ┌───────────────────────────┼───────────────────────────┐
                     │                           │                           │
                     ▼                           ▼                           ▼
        ┌─────────────────────────┐ ┌─────────────────────────┐ ┌─────────────────────────┐
        │  Tier 1: ML & NLP       │ │  Tier 2: Contextual LLM │ │  Tier 3: Evidence Engine│
        │                         │ │                         │ │                         │
        │ • Text Normalization    │ │ • Cautious System Prompt│ │ • Claim Extraction      │
        │ • Negation Preservation │ │ • Style vs. Fact Split  │ │ • Authoritative Registry│
        │ • TF-IDF Vectorization  │ │ • Suspicious Claims     │ │ • Status: Verified,     │
        │ • Naive Bayes (REAL/FAKE│ │ • Misleading Indicators │ │   Contradicted, or      │
        │ • Calibrated Probability│ │ • Structured JSON Output│ │   Unverified            │
        └────────────┬────────────┘ └────────────┬────────────┘ └────────────┬────────────┘
                     │                           │                           │
                     └───────────────────────────┼───────────────────────────┘
                                                 │
                                                 ▼
                             ┌───────────────────────────────────────┐
                             │       Multi-Model Synthesis Engine    │
                             │ • Disagreement Explanation (No silent │
                             │   overwriting of ML predictions)      │
                             │ • Final Assessment & System Limits    │
                             └───────────────────┬───────────────────┘
                                                 │
                                                 ▼
                             ┌───────────────────────────────────────┐
                             │    Modern Interactive Next.js UI      │
                             │ • Real-time Confidence Visualizer     │
                             │ • Tabbed Views: ML, LLM & Evidence    │
                             │ • 4 One-Click Benchmark Test Cases    │
                             └───────────────────────────────────────┘
```

---

## 🚀 Key Features

### 1. Existing ML & NLP Pipeline (Preserved & Enhanced)
- **Data Preprocessing:** Cleans URLs, emails, and punctuation while **strictly preserving negation words** (*not*, *no*, *never*, *cannot*) and epistemics (*claimed*, *alleged*).
- **TF-IDF Feature Extraction:** Sublinear term frequency with unigrams and bigrams (`ngram_range=(1,2)`).
- **Multinomial Naive Bayes Classification:** Predicts whether the content is **REAL** or **FAKE** with mathematically calibrated probability estimates (`predict_proba`).
- **Linguistic Metrics:** Computes sentiment polarities, emotion distribution (fear, anger, joy, sadness, trust), capitalization ratio, and clickbait density.

### 2. LLM Contextual Reasoning
- **Prompt Injection Defense:** Treats user news strictly as *untrusted data*, never as executable instructions.
- **Style vs. Fact Separation:** Avoids classifying articles as fake purely because of impassioned or unusual writing styles; isolates emotional rhetoric from verifiable factual assertions.
- **Explainable AI:** Delivers plain-English explanations of why an article is plausible or questionable.
- **Disagreement Resolution:** If the ML model and LLM diverge, the system displays both predictions transparently and explains the rationale for divergence.

### 3. Evidence-Based Fact Verification
- Cross-references claims against known authoritative registries (NASA, WHO, Federal Reserve, Snopes, Reuters Fact Check, AP Fact Check).
- Emits transparent statuses: `Verified`, `Contradicted`, `Unverified`, or `Insufficient Evidence`.
- **Zero Hallucination Policy:** Never invents sources, quotes, or URLs. If external corroboration is unavailable, the system explicitly displays: *"Claims have not been independently verified."*

### 4. Resilient Hybrid Deployment
- **Microservice Mode:** Run Python Flask (`backend/app.py`) for ML inference and Next.js for the UI.
- **Serverless / Standalone Mode:** If Flask is offline or deployed to serverless environments (e.g., Vercel), Next.js automatically executes the identical Scikit-learn TF-IDF Naive Bayes mathematical classification natively in TypeScript using pre-exported weights (`model_weights.json`).

---

## 🛠️ Windows Setup & Installation

### Prerequisites
- **Python 3.10+** (Python 3.13 tested)
- **Node.js 18+** (Node.js 22 tested) and **npm**

### 1. Clone & Navigate
```powershell
git clone <your-repository-url>
cd renu
```

### 2. Set Up Python Backend
```powershell
# Navigate to backend or root directory
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install Python ML & NLP dependencies
pip install -r requirements.txt

# Train the ML Model (generates model.pkl, tfidf_vectorizer.pkl, and model_weights.json)
python train_model.py

# Run the Comprehensive Test Suite
python test_suite.py
```

### 3. Set Up Frontend
```powershell
# In the project root directory:
npm install
```

### 4. Configure Environment Variables
Copy the example environment file:
```powershell
copy .env.example .env.local
```
Edit `.env.local` with your preferred editor:
```env
# Optional: Provide your OpenAI API key for live GPT-4o-mini contextual analysis.
# If left blank, the system automatically uses deterministic local semantic reasoning.
OPENAI_API_KEY=sk-your-openai-key-here
OPENAI_MODEL=gpt-4o-mini
FLASK_PORT=5000
```

---

## 💻 Running the Application

### Option A: Complete Microservice Setup (Recommended for Local Dev)

**Terminal 1 — Run Python Flask Backend:**
```powershell
cd backend
python app.py
# Server starts at http://127.0.0.1:5000
```

**Terminal 2 — Run Next.js Frontend:**
```powershell
npm run dev
# Application starts at http://localhost:3000
```

### Option B: Standalone Next.js Setup
If you only start Next.js (`npm run dev`), the Next.js API route (`/api/analyze`) automatically uses the compiled Scikit-learn model weights with zero external process dependencies!

---

## 🧪 Comprehensive Testing Guide

The system includes a dedicated automated test suite in `backend/test_suite.py` that verifies all edge cases:

Run tests in PowerShell:
```powershell
python backend/test_suite.py
```

### Verified Test Cases:
| Test Scenario | Sample Input | Expected ML Prediction | Verification Status |
| :--- | :--- | :--- | :--- |
| **1. Genuine News** | NASA James Webb Space Telescope discovery | `REAL` (>95%) | `Verified` |
| **2. Fabricated News** | Secret nanotech injected into municipal tap water | `FAKE` (>90%) | `Contradicted` |
| **3. Misleading / Partial** | Boiled lemon & baking soda cures cancer in 48 hours | `FAKE` (>60%) | `Contradicted` |
| **4. Ambiguous Claim** | Local Ohio bakery sourdough starter from 1892 | Neutral / Unverified | `Unverified` (Warning shown) |
| **5. Empty Input** | Whitespace-only submission | Rejection (400 Bad Request) | Graceful alert |
| **6. Oversized Input** | >10,000 character payload | Rejection (413 Payload Too Large) | Graceful alert |
| **7. Disagreement Case** | Stylistically emotional real news / subtle rumor | ML output preserved, LLM explains divergence | Side-by-side display |

---

## 🚢 Production Deployment

### 1. Deploy Frontend on Vercel
1. Push your code to your GitHub repository.
2. Sign in to [Vercel](https://vercel.com) and import the repository.
3. In Project Settings > Environment Variables, add:
   - `OPENAI_API_KEY`: Your OpenAI API key (optional).
   - `OPENAI_MODEL`: `gpt-4o-mini`.
4. Click **Deploy**. Vercel will build and serve the application with isomorphic ML inference support.

### 2. Deploy Python Backend on Render / Railway
1. Create a new Web Service on [Render](https://render.com) or [Railway](https://railway.app).
2. Set Build Command: `pip install -r backend/requirements.txt && python backend/train_model.py`
3. Set Start Command: `gunicorn backend.app:app` (or `python backend/app.py`).
4. Set Environment Variables: `OPENAI_API_KEY` (if desired).
5. In your Next.js app, point `NEXT_PUBLIC_FLASK_API_URL` to your Render service URL.

---

## 📦 Pushing Changes to GitHub

To commit and push all updates to your existing GitHub repository:
```powershell
git status
git add .
git commit -m "feat: upgrade fake news detector with hybrid ML, NLP, LLM and evidence verification"
git push origin main
```

---

## 🔒 Security & Privacy Practices
- **No Client-Side Secrets:** API keys are processed strictly on server routes (`app/api/analyze/route.ts` and `backend/app.py`) and never included in client JavaScript bundles.
- **Untrusted User Input:** Submitted news is quarantined in sanitized prompts to prevent prompt injection.
- **Data Minimization:** No personal user identifiers are stored or transmitted.
- **Fail-Safe Operation:** Full system functionality is maintained with local fallback reasoning even during external API downtime or rate limiting.
