"use client";

import { motion } from "framer-motion";
import {
  FileText,
  ScrollText,
  BarChart3,
  GitCompare,
  Download,
  Search,
  Star,
  Sparkles,
} from "lucide-react";

const tools = [
  {
    id: "summarize",
    name: "Smart Summarize",
    description: "Extract key insights, decisions, and action items from any conversation in seconds.",
    icon: FileText,
    badge: { text: "Most Popular", class: "bg-amber-100 text-amber-700" },
    gradient: "from-indigo-500/10 to-purple-500/10",
  },
  {
    id: "transcript",
    name: "Clean Transcript",
    description: "Convert messy chat exports into beautifully formatted, readable documents.",
    icon: ScrollText,
    badge: null,
    gradient: "from-blue-500/10 to-cyan-500/10",
  },
  {
    id: "analysis",
    name: "Deep Analysis",
    description: "Get sentiment analysis, topic breakdown, and conversation flow visualization.",
    icon: BarChart3,
    badge: { text: "New", class: "bg-emerald-100 text-emerald-700" },
    gradient: "from-pink-500/10 to-rose-500/10",
  },
  {
    id: "compare",
    name: "Compare Chats",
    description: "Side-by-side comparison of how different AI models answered the same prompt.",
    icon: GitCompare,
    badge: null,
    gradient: "from-orange-500/10 to-amber-500/10",
  },
  {
    id: "export",
    name: "Export & Share",
    description: "Export as PDF, Markdown, HTML, or generate a shareable link with custom styling.",
    icon: Download,
    badge: null,
    gradient: "from-teal-500/10 to-emerald-500/10",
  },
  {
    id: "search",
    name: "Chat Search",
    description: "Search across all your imported chats. Find that one specific answer instantly.",
    icon: Search,
    badge: null,
    gradient: "from-violet-500/10 to-purple-500/10",
  },
];

interface ToolsGridProps {
  onToolSelect: (toolId: string) => void;
  activeTool: string;
}

export default function ToolsGrid({ onToolSelect, activeTool }: ToolsGridProps) {
  return (
    <div className="mt-12">
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="mb-6 text-2xl font-bold text-slate-800"
      >
        <span className="inline-flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-indigo-500" />
          Tools
        </span>
      </motion.h2>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool, i) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4 }}
            onClick={() => onToolSelect(tool.id)}
            className={`group cursor-pointer rounded-2xl border bg-white p-6 transition-all duration-300 hover:shadow-xl ${
              activeTool === tool.id
                ? "border-indigo-300 shadow-lg shadow-indigo-500/10"
                : "border-slate-200 hover:border-indigo-200"
            }`}
          >
            {/* Top accent bar */}
            <div
              className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${tool.gradient} opacity-0 transition-opacity group-hover:opacity-100`}
            />

            <div
              className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${tool.gradient}`}
            >
              <tool.icon className="h-6 w-6 text-indigo-600" />
            </div>

            <h3 className="mb-2 text-lg font-semibold text-slate-800">{tool.name}</h3>
            <p className="text-sm leading-relaxed text-slate-500">{tool.description}</p>

            {tool.badge && (
              <span
                className={`mt-4 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${tool.badge.class}`}
              >
                {tool.badge.text}
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
