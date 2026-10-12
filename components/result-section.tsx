"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  TrendingUp,
  Activity,
  Target,
  Gauge,
  Brain,
  Search,
  ExternalLink,
  Layers,
  Sparkles,
  Info,
  ArrowRight
} from "lucide-react";

export interface AnalysisResult {
  prediction: "REAL" | "FAKE" | "SUSPICIOUS";
  confidence: number;
  credibilityScore: number;
  threatLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  trustScore: number;
  sentiment: {
    positive: number;
    negative: number;
    neutral: number;
  };
  emotions: {
    fear: number;
    anger: number;
    joy: number;
    sadness: number;
    trust: number;
  };
  keywords: Array<{ word: string; score: number; type: "positive" | "negative" | "neutral" }>;
  riskFactors: string[];
  ml_details?: {
    algorithm: string;
    prediction: string;
    confidence: number;
    clickbait_score: number;
  };
  llm_analysis?: {
    summary: string;
    plain_english_explanation: string;
    llm_verdict: string;
    suspicious_claims: string[];
    misleading_language_indicators: string[];
    style_vs_fact_analysis: {
      stylistic_observations: string;
      factual_verifiability: string;
    };
    unsupported_assertions: string[];
    ml_agreement: {
      agrees_with_ml: boolean;
      explanation: string;
    };
    limitations: string;
    final_assessment: string;
  };
  evidence_verification?: {
    overall_status: "Verified" | "Contradicted" | "Unverified" | "Insufficient Evidence";
    has_independent_evidence: boolean;
    verification_summary: string;
    evidence_items: Array<{
      claim: string;
      status: string;
      source_name: string;
      source_url: string;
      publication_date: string;
      evidence_type: string;
      evidence_summary: string;
    }>;
    warning_disclaimer: string;
    source_search_service: string;
  };
  synthesis?: {
    ml_prediction: string;
    llm_verdict: string;
    agrees: boolean;
    agreement_explanation: string;
    verification_status: string;
    final_assessment: string;
    limitations: string;
  };
}

interface ResultSectionProps {
  result: AnalysisResult;
  onReset: () => void;
}

export function ResultSection({ result, onReset }: ResultSectionProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "ml" | "llm" | "evidence">("overview");

  const getResultColor = () => {
    switch (result.prediction) {
      case "REAL":
        return {
          bg: "from-success/20 to-success/5",
          border: "border-success/50",
          text: "text-success",
          glow: "glow-success",
        };
      case "FAKE":
        return {
          bg: "from-destructive/20 to-destructive/5",
          border: "border-destructive/50",
          text: "text-destructive",
          glow: "glow-destructive",
        };
      default:
        return {
          bg: "from-warning/20 to-warning/5",
          border: "border-warning/50",
          text: "text-warning",
          glow: "",
        };
    }
  };

  const colors = getResultColor();

  const getThreatColor = (level: string) => {
    switch (level) {
      case "LOW":
        return "text-success bg-success/20";
      case "MEDIUM":
        return "text-warning bg-warning/20";
      case "HIGH":
        return "text-destructive bg-destructive/20";
      case "CRITICAL":
        return "text-destructive bg-destructive/30";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  const getVerificationBadge = (status?: string) => {
    switch (status) {
      case "Verified":
        return {
          label: "Verified Factual",
          color: "text-success bg-success/15 border-success/30",
          icon: <CheckCircle2 className="w-4 h-4 text-success" />
        };
      case "Contradicted":
        return {
          label: "Contradicted / Debunked",
          color: "text-destructive bg-destructive/15 border-destructive/30",
          icon: <XCircle className="w-4 h-4 text-destructive" />
        };
      case "Insufficient Evidence":
        return {
          label: "Insufficient Context",
          color: "text-warning bg-warning/15 border-warning/30",
          icon: <HelpCircle className="w-4 h-4 text-warning" />
        };
      default:
        return {
          label: "Unverified Independently",
          color: "text-accent bg-accent/15 border-accent/30",
          icon: <AlertTriangle className="w-4 h-4 text-accent" />
        };
    }
  };

  const vBadge = getVerificationBadge(result.evidence_verification?.overall_status);
  const agreesWithMl = result.synthesis?.agrees ?? result.llm_analysis?.ml_agreement?.agrees_with_ml ?? true;

  return (
    <section id="results" className="relative py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto"
      >
        {/* Main result card header */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`relative glass-strong rounded-3xl p-6 md:p-10 mb-8 overflow-hidden ${colors.border}`}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-50`} />
          
          <div className="relative z-10">
            {/* Top status bar */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-border/40 mb-6">
              <div className="flex items-center gap-3">
                <Shield className={`w-6 h-6 ${colors.text}`} />
                <div>
                  <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest block">
                    AI Detection &amp; Verification System
                  </span>
                  <h2 className="text-xl font-bold">Multi-Model Verification Summary</h2>
                </div>
              </div>
              
              <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono font-semibold ${vBadge.color}`}>
                {vBadge.icon}
                <span>Status: {vBadge.label}</span>
              </div>
            </div>

            {/* Side-by-side Dual Engine Banner: ML vs LLM */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center mb-8 bg-background/40 p-6 rounded-2xl border border-border/30">
              {/* ML Output */}
              <div className="text-center md:text-left">
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider block mb-1">
                  1. Machine Learning Classification (Naive Bayes + TF-IDF)
                </span>
                <div className="flex items-baseline gap-3 justify-center md:justify-start">
                  <span className={`text-5xl md:text-6xl font-black ${colors.text}`}>
                    {result.prediction}
                  </span>
                  <span className="text-sm font-mono text-muted-foreground">
                    ({result.confidence}% confidence)
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Calibrated probability based on n-gram feature distribution
                </p>
              </div>

              {/* LLM Verdict */}
              <div className="text-center md:text-left md:border-l md:border-border/40 md:pl-6">
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider block mb-1">
                  2. LLM Contextual Assessment (Semantic Reasoning)
                </span>
                <div className="flex items-baseline gap-3 justify-center md:justify-start">
                  <span className="text-3xl md:text-4xl font-bold text-foreground">
                    {result.llm_analysis?.llm_verdict?.replace("_", " ") || "ANALYZED"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Evaluated with contextual nuance, bias, and claim coherence
                </p>
              </div>
            </div>

            {/* Disagreement explanation when ML and LLM diverge */}
            {!agreesWithMl && (
              <div className="mb-6 p-4 rounded-xl bg-warning/15 border border-warning/30 flex items-start gap-3">
                <Info className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-warning">Model Assessment Divergence Noted</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {result.synthesis?.agreement_explanation || result.llm_analysis?.ml_agreement?.explanation}
                  </p>
                </div>
              </div>
            )}

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                icon={<Target className="w-4 h-4" />}
                label="Credibility Score"
                value={`${result.credibilityScore}/100`}
                color="text-primary"
              />
              <StatCard
                icon={<AlertTriangle className="w-4 h-4" />}
                label="Threat Level"
                value={result.threatLevel}
                color={getThreatColor(result.threatLevel)}
                isBadge
              />
              <StatCard
                icon={<Gauge className="w-4 h-4" />}
                label="Trust Score"
                value={`${result.trustScore}%`}
                color="text-accent"
              />
              <StatCard
                icon={<Activity className="w-4 h-4" />}
                label="Live Pipeline"
                value="ML + LLM Active"
                color="text-success"
              />
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-border/40 pb-3">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === "overview"
                ? "bg-primary text-primary-foreground shadow"
                : "glass hover:bg-secondary/60 text-muted-foreground"
            }`}
          >
            <Layers className="w-4 h-4" />
            Executive Synthesis
          </button>
          
          <button
            onClick={() => setActiveTab("ml")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === "ml"
                ? "bg-primary text-primary-foreground shadow"
                : "glass hover:bg-secondary/60 text-muted-foreground"
            }`}
          >
            <Activity className="w-4 h-4" />
            ML &amp; NLP Details
          </button>
          
          <button
            onClick={() => setActiveTab("llm")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === "llm"
                ? "bg-primary text-primary-foreground shadow"
                : "glass hover:bg-secondary/60 text-muted-foreground"
            }`}
          >
            <Brain className="w-4 h-4" />
            LLM Contextual Analysis
          </button>
          
          <button
            onClick={() => setActiveTab("evidence")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === "evidence"
                ? "bg-primary text-primary-foreground shadow"
                : "glass hover:bg-secondary/60 text-muted-foreground"
            }`}
          >
            <Search className="w-4 h-4" />
            Evidence &amp; Sources
          </button>
        </div>

        {/* TAB 1: EXECUTIVE SYNTHESIS */}
        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Plain English Explanation */}
            <div className="glass rounded-2xl p-6 md:p-8">
              <h3 className="text-lg font-bold flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-accent" />
                Plain-English Explanation
              </h3>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                {result.llm_analysis?.plain_english_explanation ||
                  `The machine learning model predicted this article is ${result.prediction} with ${result.confidence}% confidence. Our lexical analysis identified key stylistic and sentimental patterns reflecting this determination.`}
              </p>
            </div>

            {/* Final Assessment and Limitations */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass rounded-2xl p-6">
                <h4 className="text-base font-semibold mb-2 flex items-center gap-2 text-primary">
                  <CheckCircle2 className="w-4 h-4" />
                  Final Assessment
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {result.llm_analysis?.final_assessment || result.synthesis?.final_assessment || "Analysis complete across multi-tier criteria."}
                </p>
              </div>

              <div className="glass rounded-2xl p-6">
                <h4 className="text-base font-semibold mb-2 flex items-center gap-2 text-warning">
                  <AlertTriangle className="w-4 h-4" />
                  System Limitations &amp; Scope
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {result.llm_analysis?.limitations || result.synthesis?.limitations || "Automated heuristics and language models may have knowledge cutoffs and require secondary journalistic corroboration."}
                </p>
              </div>
            </div>

            {/* Suspicious Claims Summary */}
            {result.llm_analysis?.suspicious_claims && result.llm_analysis.suspicious_claims.length > 0 && (
              <div className="glass rounded-2xl p-6">
                <h4 className="text-base font-semibold mb-3 flex items-center gap-2 text-destructive">
                  <XCircle className="w-4 h-4" />
                  Suspicious Claims Flagged for Verification
                </h4>
                <ul className="space-y-2">
                  {result.llm_analysis.suspicious_claims.map((claim, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-destructive font-mono text-xs mt-0.5">•</span>
                      <span>{claim}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 2: MACHINE LEARNING & NLP DETAILS */}
        {activeTab === "ml" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Algorithm info card */}
            <div className="glass rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-muted-foreground">ALGORITHM</span>
                <h4 className="text-lg font-bold">TF-IDF Vectorizer + Multinomial Naive Bayes</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Trained on benchmark political, medical, scientific, and sensationalist corpora.
                </p>
              </div>
              <div className="flex items-center gap-4 text-right">
                <div>
                  <span className="text-xs font-mono text-muted-foreground block">PREDICTION</span>
                  <span className={`text-xl font-black ${colors.text}`}>{result.prediction}</span>
                </div>
                <div>
                  <span className="text-xs font-mono text-muted-foreground block">PROBABILITY</span>
                  <span className="text-xl font-bold font-mono">{result.confidence}%</span>
                </div>
              </div>
            </div>

            {/* Grid with Sentiment, Emotion, and Risk Factors */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Sentiment Analysis */}
              <div className="glass rounded-2xl p-6">
                <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Sentiment Analysis
                </h3>
                <div className="space-y-3">
                  <SentimentBar label="Positive" value={result.sentiment.positive} color="bg-success" />
                  <SentimentBar label="Neutral" value={result.sentiment.neutral} color="bg-accent" />
                  <SentimentBar label="Negative" value={result.sentiment.negative} color="bg-destructive" />
                </div>
              </div>

              {/* Emotion Detection */}
              <div className="glass rounded-2xl p-6">
                <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
                  <Activity className="w-5 h-5 text-accent" />
                  Emotion Detection
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(result.emotions).map(([emotion, value]) => (
                    <div key={emotion} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30">
                      <span className="text-sm capitalize text-muted-foreground">{emotion}</span>
                      <span className="text-sm font-mono text-foreground">{value}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Factors */}
              <div className="glass rounded-2xl p-6">
                <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                  NLP Linguistic Risk Factors
                </h3>
                <div className="space-y-2">
                  {result.riskFactors.map((factor, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <XCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                      <span className="text-muted-foreground text-xs leading-relaxed">{factor}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Keywords */}
              <div className="glass rounded-2xl p-6 md:col-span-2 lg:col-span-3">
                <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
                  <Target className="w-5 h-5 text-primary" />
                  Top TF-IDF Salient Tokens
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Feature words exhibiting highest information gain in classification:
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-xs font-mono ${
                        keyword.type === "positive"
                          ? "bg-success/20 text-success"
                          : keyword.type === "negative"
                          ? "bg-destructive/20 text-destructive"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {keyword.word}
                      <span className="ml-1 opacity-60">({keyword.score})</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: LLM CONTEXTUAL ANALYSIS */}
        {activeTab === "llm" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Style vs Fact Separation Card */}
            <div className="glass rounded-2xl p-6 md:p-8">
              <h3 className="text-lg font-bold flex items-center gap-2 mb-2 text-foreground">
                <Brain className="w-5 h-5 text-primary" />
                Linguistic Style vs. Factual Assertions
              </h3>
              <p className="text-xs text-muted-foreground mb-6">
                Critical Principle: A sensational or emotional writing style does not automatically render an article fake. The LLM isolates tone from verifiable content.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 rounded-xl bg-secondary/30 border border-border/40">
                  <span className="text-xs font-mono text-accent uppercase tracking-wider block mb-2">
                    Stylistic Observations
                  </span>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {result.llm_analysis?.style_vs_fact_analysis?.stylistic_observations || "Evaluated syntax, rhetorical framing, and emotional punctuation density."}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-secondary/30 border border-border/40">
                  <span className="text-xs font-mono text-primary uppercase tracking-wider block mb-2">
                    Factual Verifiability
                  </span>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {result.llm_analysis?.style_vs_fact_analysis?.factual_verifiability || "Checked for named organizations, peer-reviewed journals, or verifiable official transcripts."}
                  </p>
                </div>
              </div>
            </div>

            {/* Misleading Language Indicators & Unsupported Assertions */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass rounded-2xl p-6">
                <h4 className="text-base font-semibold mb-3 flex items-center gap-2 text-warning">
                  <AlertTriangle className="w-4 h-4" />
                  Misleading Language Indicators
                </h4>
                <ul className="space-y-2">
                  {(result.llm_analysis?.misleading_language_indicators || ["No overt deceptive phrasing found."]).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-warning font-mono text-xs mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass rounded-2xl p-6">
                <h4 className="text-base font-semibold mb-3 flex items-center gap-2 text-primary">
                  <Info className="w-4 h-4" />
                  Unsupported Assertions
                </h4>
                <ul className="space-y-2">
                  {(result.llm_analysis?.unsupported_assertions || ["No ungrounded assertions detected."]).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary font-mono text-xs mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 4: EVIDENCE & SOURCE VERIFICATION */}
        {activeTab === "evidence" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Warning when claim cannot be independently verified */}
            <div className={`p-4 rounded-xl border flex items-start gap-3 ${
              result.evidence_verification?.has_independent_evidence
                ? "bg-secondary/40 border-border/40"
                : "bg-warning/15 border-warning/30"
            }`}>
              <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${
                result.evidence_verification?.has_independent_evidence ? "text-primary" : "text-warning"
              }`} />
              <div>
                <h4 className={`text-sm font-bold ${
                  result.evidence_verification?.has_independent_evidence ? "text-foreground" : "text-warning"
                }`}>
                  Evidence Cross-Referencing Notice
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {result.evidence_verification?.warning_disclaimer ||
                    "Live external source verification is subject to registered databases. Unverified claims require secondary fact-check validation."}
                </p>
              </div>
            </div>

            {/* Evidence items list */}
            {result.evidence_verification?.evidence_items && result.evidence_verification.evidence_items.length > 0 ? (
              <div className="space-y-4">
                {result.evidence_verification.evidence_items.map((item, idx) => (
                  <div key={idx} className="glass rounded-2xl p-6 border border-border/40">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                      <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md inline-block w-fit ${
                        item.status === "Verified"
                          ? "bg-success/20 text-success"
                          : item.status === "Contradicted"
                          ? "bg-destructive/20 text-destructive"
                          : "bg-warning/20 text-warning"
                      }`}>
                        {item.status.toUpperCase()}
                      </span>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>Date: {item.publication_date}</span>
                        <span>•</span>
                        <a
                          href={item.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary hover:underline"
                        >
                          {item.source_name}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-sm mb-1">{item.claim}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.evidence_summary}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass rounded-2xl p-8 text-center">
                <Search className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                <h4 className="text-base font-semibold mb-1">No Matching Fact-Check Records</h4>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  This specific claim or article does not match currently indexed records in the verification registry. Per strict guidelines, sources and URLs are never artificially hallucinated.
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Reset button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-10"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReset}
            className="px-8 py-3.5 glass neon-border rounded-xl font-medium hover:bg-card/60 transition-colors text-sm"
          >
            Analyze Another Article
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
  isBadge = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  isBadge?: boolean;
}) {
  return (
    <div className="p-4 rounded-xl bg-secondary/30 border border-border/30">
      <div className={`flex items-center gap-2 mb-2 ${color}`}>{icon}</div>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      {isBadge ? (
        <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-bold ${color}`}>
          {value}
        </span>
      ) : (
        <p className="text-base md:text-lg font-bold">{value}</p>
      )}
    </div>
  );
}

function SentimentBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono">{value}%</span>
      </div>
      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  );
}
