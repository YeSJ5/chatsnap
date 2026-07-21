"use client";

import {
  FileText,
  ScrollText,
  BarChart3,
  GitCompare,
  Download,
  Search,
  Sparkles,
} from "lucide-react";

const tools = [
  {
    id: "summarize",
    name: "Smart Summarize",
    description: "Extract key insights, decisions, and action items from any conversation in seconds.",
    icon: FileText,
    badge: "Most Popular",
    badgeClass: "bg-amber-100 text-amber-700",
  },
  {
    id: "transcript",
    name: "Clean Transcript",
    description: "Convert messy chat exports into beautifully formatted, readable documents.",
    icon: ScrollText,
    badge: null,
    badgeClass: "",
  },
  {
    id: "analysis",
    name: "Deep Analysis",
    description: "Get sentiment analysis, topic breakdown, and conversation flow visualization.",
    icon: BarChart3,
    badge: "New",
    badgeClass: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "compare",
    name: "Compare Chats",
    description: "Side-by-side comparison of how different AI models answered the same prompt.",
    icon: GitCompare,
    badge: null,
    badgeClass: "",
  },
  {
    id: "export",
    name: "Export & Share",
    description: "Export as PDF, Markdown, HTML, or generate a shareable link with custom styling.",
    icon: Download,
    badge: null,
    badgeClass: "",
  },
  {
    id: "search",
    name: "Chat Search",
    description: "Search across all your imported chats. Find that one specific answer instantly.",
    icon: Search,
    badge: null,
    badgeClass: "",
  },
];

interface ToolsGridProps {
  onToolSelect: (toolId: string) => void;
  activeTool: string;
}

export default function ToolsGrid({ onToolSelect, activeTool }: ToolsGridProps) {
  return (
    <div className="mt-12">
      <h2 className="mb-6 text-2xl font-bold text-slate-800 flex items-center gap-2">
        <Sparkles className="h-6 w-6 text-indigo-500" />
        Tools
      </h2>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <div
            key={tool.id}
            onClick={() => onToolSelect(tool.id)}
            className={`group cursor-pointer rounded-2xl border bg-white p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
              activeTool === tool.id
                ? "border-indigo-300 shadow-lg shadow-indigo-500/10"
                : "border-slate-200 hover:border-indigo-200"
            }`}
          >
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
              <tool.icon className="h-6 w-6 text-indigo-600" />
            </div>

            <h3 className="mb-2 text-lg font-semibold text-slate-800">{tool.name}</h3>
            <p className="text-sm leading-relaxed text-slate-500">{tool.description}</p>

            {tool.badge && (
              <span className={`mt-4 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${tool.badgeClass}`}>
                {tool.badge}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}