"use client";

import { motion } from "framer-motion";
import { FileText, Cpu, BarChart3, Bot, Search, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: FileText,
    title: "1. News Input",
    description: "Article ingestion & validation",
    color: "text-accent",
    bg: "bg-accent/20",
  },
  {
    icon: Cpu,
    title: "2. NLP Preprocessing",
    description: "Normalization & tokenization",
    color: "text-primary",
    bg: "bg-primary/20",
  },
  {
    icon: BarChart3,
    title: "3. ML Naive Bayes",
    description: "TF-IDF probability scoring",
    color: "text-success",
    bg: "bg-success/20",
  },
  {
    icon: Bot,
    title: "4. LLM Reasoning",
    description: "Context & bias breakdown",
    color: "text-warning",
    bg: "bg-warning/20",
  },
  {
    icon: Search,
    title: "5. Fact Checking",
    description: "Evidence registry cross-ref",
    color: "text-accent",
    bg: "bg-accent/20",
  },
  {
    icon: CheckCircle2,
    title: "6. Multi-Model Delivery",
    description: "Synthesized verdict with context",
    color: "text-success",
    bg: "bg-success/20",
  },
];

export function WorkflowVisualization() {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
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
            <Cpu className="w-4 h-4 text-primary" />
            <span className="text-sm font-mono text-primary">END-TO-END PIPELINE</span>
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Detection &amp; Verification <span className="text-gradient">Workflow</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Content flows sequentially through statistical NLP, machine learning, semantic LLM analysis, and authoritative fact verification.
          </p>
        </div>

        {/* Pipeline visualization */}
        <div className="relative">
          {/* Connection line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-accent via-primary to-success hidden lg:block" />

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-2">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="glass rounded-2xl p-4 md:p-5 text-center relative z-10 h-full flex flex-col justify-between"
                >
                  <div>
                    <motion.div
                      animate={{
                        boxShadow: [
                          "0 0 0 rgba(139, 92, 246, 0)",
                          "0 0 20px rgba(139, 92, 246, 0.3)",
                          "0 0 0 rgba(139, 92, 246, 0)",
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                      className={`w-12 h-12 mx-auto rounded-xl ${step.bg} flex items-center justify-center mb-3`}
                    >
                      <step.icon className={`w-6 h-6 ${step.color}`} />
                    </motion.div>
                    <h3 className="font-semibold text-xs md:text-sm mb-1">{step.title}</h3>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-tight mt-1">{step.description}</p>
                </motion.div>

                {/* Arrow connector for mobile */}
                {index < steps.length - 1 && (
                  <div className="absolute -right-2 top-1/2 -translate-y-1/2 text-primary hidden md:block lg:hidden">
                    →
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
