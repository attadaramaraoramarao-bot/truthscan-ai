"use client";

import { motion } from "framer-motion";
import { 
  Server, 
  Code2, 
  Cpu, 
  Database,
  BarChart3,
  Brain,
  Sparkles,
  FileCode,
  ShieldCheck,
  Search,
  Bot,
  Layers
} from "lucide-react";

const technologies = [
  {
    name: "Flask & Next.js API",
    description: "Backend architecture",
    icon: Server,
    color: "from-primary to-primary/50",
  },
  {
    name: "Python 3.13",
    description: "Core ML language",
    icon: Code2,
    color: "from-accent to-accent/50",
  },
  {
    name: "Scikit-learn",
    description: "ML training & inference",
    icon: Cpu,
    color: "from-warning to-warning/50",
  },
  {
    name: "Multinomial Naive Bayes",
    description: "Probabilistic classification",
    icon: Sparkles,
    color: "from-warning to-primary",
  },
  {
    name: "TF-IDF Vectorizer",
    description: "N-gram feature extraction",
    icon: FileCode,
    color: "from-accent to-primary",
  },
  {
    name: "NLP Stylistics Pipeline",
    description: "Emotion & sentiment lexicon",
    icon: Brain,
    color: "from-success to-accent",
  },
  {
    name: "Large Language Models",
    description: "Contextual semantic reasoning",
    icon: Bot,
    color: "from-primary to-accent",
  },
  {
    name: "Evidence Verification Engine",
    description: "Fact-checking cross-reference",
    icon: Search,
    color: "from-success to-primary",
  },
];

export function TechnologiesSection() {
  return (
    <section className="relative py-20 px-4">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto"
      >
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4"
          >
            <Code2 className="w-4 h-4 text-accent" />
            <span className="text-sm font-mono text-accent">TECH STACK</span>
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powered by <span className="text-gradient">Hybrid ML, NLP &amp; LLM Architecture</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Combines classical statistical NLP with state-of-the-art Large Language Models and evidence-based fact verification.
          </p>
        </div>

        {/* Technologies grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {technologies.map((tech, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ scale: 1.04, y: -4 }}
              className="group"
            >
              <div className="glass rounded-2xl p-6 h-full transition-all duration-300 hover:border-primary/50 relative overflow-hidden">
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${tech.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                
                <div className="relative z-10">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tech.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <tech.icon className="w-6 h-6 text-foreground" />
                  </div>
                  <h3 className="font-semibold text-sm md:text-base mb-1">{tech.name}</h3>
                  <p className="text-xs text-muted-foreground">{tech.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
