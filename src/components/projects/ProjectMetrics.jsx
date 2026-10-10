import React from "react";
import { motion } from "framer-motion";
import { Zap, Award, Layers, Smartphone } from "lucide-react";

const STATS = [
  {
    number: "10,000+",
    unit: "Req / Sec",
    label: "Peak High-Concurrency System Scale",
    icon: Zap,
  },
  {
    number: "100 / 100",
    unit: "Lighthouse",
    label: "Core Web Vitals & Zero CLS Target",
    icon: Award,
  },
  {
    number: "6 Products",
    unit: "Shipped",
    label: "Full-Stack Enterprise & AI Web Apps",
    icon: Layers,
  },
  {
    number: "100%",
    unit: "Responsive",
    label: "Cross-Device Mobile & Desktop Polish",
    icon: Smartphone,
  },
];

export default function ProjectMetrics() {
  return (
    <div className="mb-14 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
      {STATS.map(({ number, unit, label, icon: Icon }, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: idx * 0.1 }}
          className="group relative overflow-hidden rounded-2xl border border-[var(--th-line)] bg-[var(--th-card)] p-5 shadow-sm transition-all duration-300 hover:border-gold/60 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-gold">
              {unit}
            </span>
            <span className="rounded-lg border border-[var(--th-line)] bg-[var(--th-bg)] p-2 text-gold transition-colors group-hover:border-gold/60">
              <Icon size={16} />
            </span>
          </div>
          <div className="mt-3">
            <div className="font-display text-2xl font-extrabold text-[var(--th-text)] sm:text-3xl">
              {number}
            </div>
            <p className="mt-1 text-xs text-[var(--th-text-60)]">
              {label}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
