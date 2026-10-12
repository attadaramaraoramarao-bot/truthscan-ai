"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface LoadingSequenceProps {
  onComplete: () => void;
}

const loadingSteps = [
  { text: "Initializing NLP Preprocessing & Linguistic Cleaning...", duration: 800 },
  { text: "Extracting TF-IDF Features & Running Naive Bayes Classifier...", duration: 900 },
  { text: "Evaluating Sentiment, Emotion & Stylistic Manipulation Patterns...", duration: 800 },
  { text: "Prompting LLM Engine for Contextual Reasoning & Bias Analysis...", duration: 1100 },
  { text: "Cross-Referencing Authoritative Fact-Check Registries & Sources...", duration: 900 },
  { text: "Synthesizing Multi-Model Verification & Disagreement Review...", duration: 700 },
];

export function LoadingSequence({ onComplete }: LoadingSequenceProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (currentStep < loadingSteps.length) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
        setProgress(((currentStep + 1) / loadingSteps.length) * 100);
      }, loadingSteps[currentStep].duration);
      return () => clearTimeout(timer);
    } else {
      const completeTimer = setTimeout(onComplete, 400);
      return () => clearTimeout(completeTimer);
    }
  }, [currentStep, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-xl"
    >
      <div className="max-w-lg w-full mx-4">
        <div className="glass-strong rounded-2xl p-8 border border-primary/30 shadow-2xl">
          {/* AI Brain animation */}
          <div className="flex justify-center mb-8">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-primary to-accent animate-pulse flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-primary-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              {/* Rotating ring */}
              <svg className="absolute inset-0 w-24 h-24 animate-spin-slow" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="2"
                  strokeDasharray="70 200"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgb(139, 92, 246)" />
                    <stop offset="100%" stopColor="rgb(6, 182, 212)" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          <div className="text-center mb-4">
            <h3 className="font-bold text-base">Multi-Engine AI Verification Pipeline</h3>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">ML + NLP + LLM Tri-Tier Orchestration</p>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-secondary rounded-full mb-6 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
            />
          </div>

          {/* Loading steps */}
          <div className="space-y-2.5">
            {loadingSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0.3 }}
                animate={{
                  opacity: index <= currentStep ? 1 : 0.3,
                }}
                className={`flex items-center gap-3 font-mono text-xs ${
                  index < currentStep
                    ? "text-success"
                    : index === currentStep
                    ? "text-primary font-semibold"
                    : "text-muted-foreground"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    index < currentStep
                      ? "bg-success"
                      : index === currentStep
                      ? "bg-primary animate-pulse"
                      : "bg-muted"
                  }`}
                />
                <span className="truncate">{step.text}</span>
                {index < currentStep && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="ml-auto text-success"
                  >
                    ✓
                  </motion.span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
