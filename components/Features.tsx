"use client";

import { Zap, FileText, Download, Shield } from "lucide-react";

const features = [
  { icon: Zap, text: "One-click summaries" },
  { icon: FileText, text: "Clean formatting" },
  { icon: Download, text: "Export to PDF / Markdown" },
  { icon: Shield, text: "100% free & private" },
];

export default function Features() {
  return (
    <div className="mt-8 flex flex-wrap justify-center gap-6">
      {features.map((feature) => (
        <div
          key={feature.text}
          className="flex items-center gap-2 text-sm text-slate-500"
        >
          <feature.icon className="h-4 w-4 text-emerald-500" />
          {feature.text}
        </div>
      ))}
    </div>
  );
}