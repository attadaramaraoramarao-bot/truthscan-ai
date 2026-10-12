"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  AlertTriangle,
  BarChart3,
  Activity,
  Clock,
  Globe,
  Zap,
  Shield,
} from "lucide-react";

const stats = [
  {
    label: "Articles Scanned",
    value: "2.4M+",
    change: "+12.5%",
    icon: BarChart3,
    color: "text-primary",
  },
  {
    label: "Fake News Detected",
    value: "847K",
    change: "+8.2%",
    icon: AlertTriangle,
    color: "text-destructive",
  },
  {
    label: "Accuracy Rate",
    value: "98.7%",
    change: "+0.3%",
    icon: TrendingUp,
    color: "text-success",
  },
  {
    label: "Avg Response Time",
    value: "0.8s",
    change: "-15%",
    icon: Zap,
    color: "text-accent",
  },
];

const trendingMisinformation = [
  { topic: "Climate Change Denial", threat: "HIGH", region: "Global", articles: 12453 },
  { topic: "Medical Misinformation", threat: "CRITICAL", region: "North America", articles: 8721 },
  { topic: "Political Manipulation", threat: "HIGH", region: "Europe", articles: 6234 },
  { topic: "Financial Scams", threat: "MEDIUM", region: "Asia Pacific", articles: 4521 },
];

const recentDetections = [
  { time: "2 min ago", result: "FAKE", confidence: 94, source: "Social Media" },
  { time: "5 min ago", result: "REAL", confidence: 87, source: "News Outlet" },
  { time: "8 min ago", result: "SUSPICIOUS", confidence: 62, source: "Blog Post" },
  { time: "12 min ago", result: "FAKE", confidence: 91, source: "Viral Post" },
  { time: "15 min ago", result: "REAL", confidence: 96, source: "Reuters" },
];

export function AnalyticsDashboard() {
  return (
    <section id="analytics" className="relative py-20 px-4">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto"
      >
        {/* Section header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4"
          >
            <Activity className="w-4 h-4 text-primary" />
            <span className="text-sm font-mono text-primary">LIVE ANALYTICS</span>
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Threat Intelligence <span className="text-gradient">Dashboard</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Real-time monitoring of global misinformation patterns
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                <span className="text-xs font-mono text-success bg-success/20 px-2 py-0.5 rounded">
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Dashboard grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Trending misinformation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                Trending Misinformation
              </h3>
              <span className="text-xs text-muted-foreground font-mono">Live updates</span>
            </div>
            <div className="space-y-4">
              {trendingMisinformation.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium mb-1">{item.topic}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Globe className="w-3 h-3" />
                      {item.region}
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xs font-mono px-2 py-1 rounded ${
                        item.threat === "CRITICAL"
                          ? "bg-destructive/20 text-destructive"
                          : item.threat === "HIGH"
                          ? "bg-warning/20 text-warning"
                          : "bg-accent/20 text-accent"
                      }`}
                    >
                      {item.threat}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.articles.toLocaleString()} articles
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent detections */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-accent" />
                Detection Timeline
              </h3>
            </div>
            <div className="space-y-3">
              {recentDetections.map((detection, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30"
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      detection.result === "FAKE"
                        ? "bg-destructive"
                        : detection.result === "REAL"
                        ? "bg-success"
                        : "bg-warning"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold ${
                          detection.result === "FAKE"
                            ? "text-destructive"
                            : detection.result === "REAL"
                            ? "text-success"
                            : "text-warning"
                        }`}
                      >
                        {detection.result}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {detection.confidence}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{detection.source}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {detection.time}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 glass rounded-2xl p-6"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Shield className="w-8 h-8 text-success" />
              <div>
                <p className="font-semibold">AI System Status</p>
                <p className="text-sm text-muted-foreground">All systems operational</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Uptime</p>
                <p className="font-mono font-bold text-success">99.99%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">API Latency</p>
                <p className="font-mono font-bold text-accent">45ms</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Models Active</p>
                <p className="font-mono font-bold text-primary">7</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
