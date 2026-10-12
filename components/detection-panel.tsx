"use client";

import { motion } from "framer-motion";
import { useState, useRef, useCallback } from "react";
import { Mic, Upload, Clipboard, Sparkles, Loader2, AlertCircle, FileText, CheckCircle2 } from "lucide-react";

interface DetectionPanelProps {
  onAnalyze: (text: string, headline?: string) => void;
  isAnalyzing: boolean;
}

const SAMPLE_ARTICLES = [
  {
    label: "Genuine News",
    type: "REAL",
    headline: "NASA James Webb Space Telescope Observes Earliest Galaxies",
    body: "NASA's James Webb Space Telescope has captured deep-field images of the earliest known galaxies formed shortly after the Big Bang, astronomers confirmed in a peer-reviewed study published in Nature."
  },
  {
    label: "Fabricated News",
    type: "FAKE",
    headline: "SHOCKING BOMBSHELL: Mind-Control Nanotech in Tap Water",
    body: "SHOCKING BOMBSHELL: Secret government lab caught spraying mind-control nanotechnology into municipal tap water! Globalist elites are controlling your thoughts and mainstream media is covering it up!"
  },
  {
    label: "Misleading Health Claim",
    type: "MISLEADING",
    headline: "MIRACLE CURE: Boiled Lemon and Baking Soda Destroys Cancer in 48 Hours",
    body: "MIRACLE CURE: Drinking boiled lemon and baking soda kills all cancer cells in 48 hours according to clinical studies! Big Pharma is desperately trying to ban this secret home remedy!"
  },
  {
    label: "Ambiguous Story",
    type: "AMBIGUOUS",
    headline: "Local Ohio Bakery Claims Sourdough Starter Gifted in 1892",
    body: "A local family bakery in rural Ohio claims their secret sourdough starter was gifted by a visiting French traveler in 1892 and has been continuously fed for over 130 years."
  }
];

export function DetectionPanel({ onAnalyze, isAnalyzing }: DetectionPanelProps) {
  const [headline, setHeadline] = useState("");
  const [text, setText] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const maxChars = 5000;

  const handlePaste = async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      setText(clipText);
      setErrorMessage(null);
    } catch {
      setErrorMessage("Could not access system clipboard. Please paste manually.");
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (event) => {
        setText(event.target?.result as string);
        setErrorMessage(null);
      };
      reader.readAsText(file);
    }
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setText(event.target?.result as string);
        setErrorMessage(null);
      };
      reader.readAsText(file);
    }
  };

  const handleSelectSample = (sample: typeof SAMPLE_ARTICLES[0]) => {
    setHeadline(sample.headline);
    setText(sample.body);
    setErrorMessage(null);
  };

  const handleSubmit = () => {
    const combined = headline ? `${headline}. ${text}`.trim() : text.trim();
    if (!combined) {
      setErrorMessage("Please enter a news headline or article body to analyze.");
      return;
    }
    if (combined.length < 20) {
      setErrorMessage("The text is too short for meaningful analysis. Please provide at least 20 characters.");
      return;
    }
    setErrorMessage(null);
    onAnalyze(text, headline);
  };

  return (
    <section id="detection" className="relative py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        {/* Section header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4"
          >
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-mono text-accent">TRI-TIER AI INTELLIGENCE ENGINE</span>
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Detection &amp; Verification <span className="text-gradient">Panel</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Evaluate news articles using classical Machine Learning (Naive Bayes), NLP linguistic stylistics, and Large Language Model contextual verification.
          </p>
        </div>

        {/* Quick test sample pills */}
        <div className="mb-6">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-3 text-center md:text-left flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-primary" />
            Try Pre-loaded Benchmark Test Cases:
          </p>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_ARTICLES.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className={`text-xs px-3.5 py-2 rounded-xl transition-all border ${
                  sample.type === "REAL"
                    ? "border-success/30 bg-success/10 hover:bg-success/20 text-success"
                    : sample.type === "FAKE"
                    ? "border-destructive/30 bg-destructive/10 hover:bg-destructive/20 text-destructive"
                    : sample.type === "MISLEADING"
                    ? "border-warning/30 bg-warning/10 hover:bg-warning/20 text-warning"
                    : "border-accent/30 bg-accent/10 hover:bg-accent/20 text-accent"
                }`}
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main panel */}
        <motion.div
          className={`relative glass-strong rounded-2xl p-6 md:p-8 transition-all duration-300 ${
            isDragging ? "ring-2 ring-primary glow-primary" : ""
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex flex-wrap gap-2">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePaste}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-xs font-medium"
              >
                <Clipboard className="w-3.5 h-3.5 text-accent" />
                Paste Clipboard
              </motion.button>
              
              <label className="cursor-pointer">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-xs font-medium"
                >
                  <Upload className="w-3.5 h-3.5 text-primary" />
                  Upload File (.txt)
                </motion.div>
                <input
                  type="file"
                  accept=".txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setText("Breaking news report indicates significant fluctuations in global renewable energy markets.");
                }}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-xs font-medium"
              >
                <Mic className="w-3.5 h-3.5 text-success" />
                Simulate Voice
              </motion.button>
            </div>

            {(headline || text) && (
              <button
                type="button"
                onClick={() => { setHeadline(""); setText(""); setErrorMessage(null); }}
                className="text-xs text-muted-foreground hover:text-foreground underline"
              >
                Clear Input
              </button>
            )}
          </div>

          {/* Optional Headline field */}
          <div className="mb-3">
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Headline / Claim Title (Optional)"
              className="w-full px-4 py-2.5 rounded-xl bg-background/50 border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-foreground placeholder:text-muted-foreground/50 text-sm font-medium"
            />
          </div>

          {/* Textarea */}
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => {
                setText(e.target.value.slice(0, maxChars));
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="Paste the news article or statement here for multi-tier ML, NLP & LLM verification..."
              className="w-full h-56 md:h-72 p-4 rounded-xl bg-background/50 border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 resize-none transition-all text-foreground placeholder:text-muted-foreground/50 font-mono text-sm leading-relaxed"
            />
            
            {/* Character counter */}
            <div className="absolute bottom-4 right-4 text-xs font-mono text-muted-foreground">
              <span className={text.length > maxChars * 0.9 ? "text-warning font-bold" : ""}>
                {text.length.toLocaleString()}
              </span>
              <span className="text-border"> / </span>
              <span>{maxChars.toLocaleString()} chars</span>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mt-3 p-3 rounded-xl bg-destructive/15 border border-destructive/30 text-destructive text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Drag overlay */}
          {isDragging && (
            <div className="absolute inset-0 rounded-2xl bg-primary/10 backdrop-blur-sm flex items-center justify-center border-2 border-dashed border-primary">
              <div className="text-center">
                <Upload className="w-12 h-12 text-primary mx-auto mb-2" />
                <p className="text-primary font-medium">Drop your text file here</p>
              </div>
            </div>
          )}

          {/* Analyze button */}
          <motion.button
            whileHover={{ scale: 1.01, boxShadow: "0 0 35px rgba(139, 92, 246, 0.35)" }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={isAnalyzing}
            className="w-full mt-5 py-4 rounded-xl bg-gradient-to-r from-primary via-accent to-primary font-bold text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 relative overflow-hidden group shadow-lg"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <span className="relative flex items-center justify-center gap-2 text-base">
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Running Multi-Tier ML &amp; LLM Verification...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Analyze News Article
                </>
              )}
            </span>
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
}
