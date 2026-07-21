"use client";

import { motion } from "framer-motion";
import { Check, Zap, FileText, Download, Shield } from "lucide-react";

const features = [
  { icon: Zap, text: "One-click summaries" },
  { icon: FileText, text: "Clean formatting" },
  { icon: Download, text: "Export to PDF / Markdown" },
  { icon: Shield, text: "100% free & private" },
];

export default function Features() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="mt-8 flex flex-wrap justify-center gap-6"
    >
      {features.map((feature, i) => (
        <motion.div
          key={feature.text}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 + i * 0.1 }}
          className="flex items-center gap-2 text-sm text-slate-500"
        >
          <feature.icon className="h-4 w-4 text-emerald-500" />
          {feature.text}
        </motion.div>
      ))}
    </motion.div>
  );
}
