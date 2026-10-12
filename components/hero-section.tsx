"use client";

import { motion } from "framer-motion";
import { Brain, Shield, Zap } from "lucide-react";

export function HeroSection({
  onStartDetection,
  onViewAnalytics,
}: {
  onStartDetection: () => void;
  onViewAnalytics: () => void;
}) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
      
      {/* AI Hologram illustration */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative mb-8"
      >
        <div className="relative w-32 h-32 md:w-40 md:h-40">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-accent to-primary opacity-20 animate-spin-slow" />
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 backdrop-blur-xl border border-primary/30 flex items-center justify-center">
            <Brain className="w-16 h-16 md:w-20 md:h-20 text-primary animate-pulse" />
          </div>
          <div className="absolute -inset-4 rounded-full border border-primary/20 animate-ping opacity-30" />
        </div>
      </motion.div>

      {/* Main heading */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-center z-10"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-accent" />
          <span className="text-sm font-mono text-accent tracking-widest uppercase">
            TRUTHSCAN AI
          </span>
          <Shield className="w-5 h-5 text-accent" />
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
          <span className="text-gradient">AI-Powered</span>
          <br />
          <span className="text-foreground">Fake News Detection</span>
        </h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Detect misinformation using{" "}
          <span className="text-primary font-medium">Machine Learning</span> and{" "}
          <span className="text-accent font-medium">NLP Intelligence</span>
        </motion.p>
      </motion.div>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="flex flex-col sm:flex-row gap-4 z-10"
      >
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(139, 92, 246, 0.5)" }}
          whileTap={{ scale: 0.98 }}
          onClick={onStartDetection}
          className="group relative px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl overflow-hidden transition-all duration-300"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="relative flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Start Detection
          </span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05, borderColor: "rgba(6, 182, 212, 0.8)" }}
          whileTap={{ scale: 0.98 }}
          onClick={onViewAnalytics}
          className="px-8 py-4 glass neon-border font-semibold rounded-xl transition-all duration-300 hover:bg-card/60"
        >
          <span className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-accent" />
            View Analytics
          </span>
        </motion.button>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-primary"
          />
        </div>
      </motion.div>
    </section>
  );
}
