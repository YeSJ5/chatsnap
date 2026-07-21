"use client";

import { Link2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Header() {
  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-6 py-16 text-white md:py-20">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0 animate-drift"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)`,
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium backdrop-blur-sm"
        >
          <Sparkles className="h-4 w-4" />
          <span>Now supporting 8+ AI platforms</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-4 text-4xl font-extrabold tracking-tight md:text-6xl"
        >
          <span className="inline-flex items-center gap-3">
            <Link2 className="h-10 w-10 md:h-14 md:w-14" />
            ChatSnap
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto max-w-2xl text-lg opacity-90 md:text-xl"
        >
          Paste any AI chat link — ChatGPT, Claude, Gemini, Perplexity, Kimi —
          and instantly get clean summaries, formatted transcripts, and deep analysis.
        </motion.p>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 80V40C240 80 480 0 720 40C960 80 1200 0 1440 40V80H0Z"
            fill="white"
          />
        </svg>
      </div>
    </header>
  );
}
