"use client";

import { useState, useCallback, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { ParticleBackground } from "@/components/particle-background";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { DetectionPanel } from "@/components/detection-panel";
import { LoadingSequence } from "@/components/loading-sequence";
import { ResultSection, type AnalysisResult } from "@/components/result-section";
import { WorkflowVisualization } from "@/components/workflow-visualization";
import { AnalyticsDashboard } from "@/components/analytics-dashboard";
import { TechnologiesSection } from "@/components/technologies-section";
import { Footer } from "@/components/footer";

export default function TruthScanPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  
  // Pending result buffer while the loading sequence animation runs
  const pendingResultRef = useRef<AnalysisResult | null>(null);

  const handleAnalyze = useCallback(async (text: string, headline?: string) => {
    setIsAnalyzing(true);
    setShowLoading(true);
    setApiError(null);
    pendingResultRef.current = null;

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          headline: headline || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const data: AnalysisResult = await response.json();
      pendingResultRef.current = data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Network error occurred while analyzing article.";
      setApiError(message);
      setShowLoading(false);
      setIsAnalyzing(false);
    }
  }, []);

  const handleLoadingComplete = useCallback(() => {
    setShowLoading(false);
    setIsAnalyzing(false);
    if (pendingResultRef.current) {
      setResult(pendingResultRef.current);
      // Smoothly scroll down to results
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    }
  }, []);

  const handleReset = useCallback(() => {
    setResult(null);
    setApiError(null);
    pendingResultRef.current = null;
    document.getElementById("detection")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const scrollToDetection = () => {
    document.getElementById("detection")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToAnalytics = () => {
    document.getElementById("analytics")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="relative min-h-screen bg-background overflow-x-hidden">
      {/* Background effects */}
      <ParticleBackground />
      
      {/* Fixed gradient orbs */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px]" />
      </div>

      {/* Navigation */}
      <Navbar />

      {/* Content */}
      <div className="relative z-10">
        <HeroSection 
          onStartDetection={scrollToDetection}
          onViewAnalytics={scrollToAnalytics}
        />
        
        <DetectionPanel 
          onAnalyze={handleAnalyze}
          isAnalyzing={isAnalyzing}
        />

        {/* API Error Notification */}
        {apiError && (
          <div className="max-w-4xl mx-auto px-4 mb-8">
            <div className="p-4 rounded-2xl bg-destructive/15 border border-destructive/30 text-destructive text-sm flex items-center justify-between">
              <div>
                <p className="font-bold">Analysis Failed</p>
                <p className="text-xs text-muted-foreground mt-0.5">{apiError}</p>
              </div>
              <button
                type="button"
                onClick={() => setApiError(null)}
                className="text-xs underline hover:text-foreground"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        <AnimatePresence>
          {result && (
            <ResultSection 
              result={result}
              onReset={handleReset}
            />
          )}
        </AnimatePresence>

        <WorkflowVisualization />
        
        <AnalyticsDashboard />
        
        <TechnologiesSection />
        
        <Footer />
      </div>

      {/* Loading overlay */}
      <AnimatePresence>
        {showLoading && (
          <LoadingSequence onComplete={handleLoadingComplete} />
        )}
      </AnimatePresence>
    </main>
  );
}
