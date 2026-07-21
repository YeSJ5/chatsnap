"use client";

import { motion } from "framer-motion";

const platforms = [
  { name: "ChatGPT", icon: "🤖", color: "hover:border-emerald-400 hover:text-emerald-600" },
  { name: "Claude", icon: "🧠", color: "hover:border-orange-400 hover:text-orange-600" },
  { name: "Gemini", icon: "✨", color: "hover:border-blue-400 hover:text-blue-600" },
  { name: "Perplexity", icon: "🔍", color: "hover:border-teal-400 hover:text-teal-600" },
  { name: "Kimi", icon: "🌙", color: "hover:border-indigo-400 hover:text-indigo-600" },
  { name: "Copilot", icon: "💬", color: "hover:border-cyan-400 hover:text-cyan-600" },
  { name: "DeepSeek", icon: "📝", color: "hover:border-violet-400 hover:text-violet-600" },
  { name: "Poe", icon: "🦙", color: "hover:border-rose-400 hover:text-rose-600" },
];

export default function PlatformTags() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="mt-8 flex flex-wrap justify-center gap-2.5"
    >
      {platforms.map((platform, i) => (
        <motion.span
          key={platform.name}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 + i * 0.05 }}
          className={`inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-600 transition-all duration-200 cursor-default ${platform.color}`}
        >
          <span>{platform.icon}</span>
          {platform.name}
        </motion.span>
      ))}
    </motion.div>
  );
}
