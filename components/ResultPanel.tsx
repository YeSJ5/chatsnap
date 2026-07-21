"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  Download,
  FileText,
  ScrollText,
  BarChart3,
  Code,
  Check,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ResultPanelProps {
  result: any;
  mode: string;
  onModeChange: (mode: string) => void;
  onClose: () => void;
}

const modes = [
  { id: "summary", label: "Summary", icon: FileText },
  { id: "transcript", label: "Transcript", icon: ScrollText },
  { id: "analysis", label: "Analysis", icon: BarChart3 },
  { id: "markdown", label: "Markdown", icon: Code },
];

export default function ResultPanel({ result, mode, onModeChange, onClose }: ResultPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = getDisplayText(result, mode);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = getDisplayText(result, mode);
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chatsnap-${mode}-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-slate-800">
            {modes.find((m) => m.id === mode)?.label || "Result"}
          </h3>
          {result?.chatInfo && (
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
              {result.chatInfo.source} · {result.chatInfo.messageCount} messages
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
          >
            <Download className="h-4 w-4" />
            Download
          </button>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="flex gap-1 border-b border-slate-100 bg-slate-50/50 px-4 py-2">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => onModeChange(m.id)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all",
              mode === m.id
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            <m.icon className="h-4 w-4" />
            {m.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="max-h-[600px] overflow-y-auto p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            <ResultContent result={result} mode={mode} />
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function ResultContent({ result, mode }: { result: any; mode: string }) {
  if (!result?.result) return null;

  const data = result.result;

  switch (mode) {
    case "summary":
      return <SummaryView data={data} />;
    case "transcript":
      return <TranscriptView data={data} />;
    case "analysis":
      return <AnalysisView data={data} />;
    case "markdown":
      return <MarkdownView data={data} />;
    default:
      return <SummaryView data={data} />;
  }
}

function SummaryView({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      {/* Sentiment Badge */}
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold",
            data.sentiment === "positive"
              ? "bg-emerald-100 text-emerald-700"
              : data.sentiment === "negative"
              ? "bg-red-100 text-red-700"
              : "bg-slate-100 text-slate-700"
          )}
        >
          {data.sentiment?.charAt(0).toUpperCase() + data.sentiment?.slice(1)} Sentiment
        </span>
        <span className="text-xs text-slate-400">{data.wordCount} words</span>
      </div>

      {/* Summary Text */}
      <div className="rounded-xl bg-slate-50 p-5 text-slate-700 leading-relaxed">
        {data.summary}
      </div>

      {/* Key Points */}
      {data.keyPoints?.length > 0 && (
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
            Key Points
          </h4>
          <ul className="space-y-2">
            {data.keyPoints.map((point: string, i: number) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                <span className="text-slate-600">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Items */}
      {data.actionItems?.length > 0 && (
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
            Action Items
          </h4>
          <div className="space-y-2">
            {data.actionItems.map((item: string, i: number) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3"
              >
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-indigo-600" />
                <span className="text-sm text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Topics */}
      {data.topics?.length > 0 && (
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
            Topics
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.topics.map((topic: string, i: number) => (
              <span
                key={i}
                className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TranscriptView({ data }: { data: any }) {
  const lines = data.formatted?.split("\n") || [];
  return (
    <div className="space-y-4 font-mono text-sm">
      {lines.map((line: string, i: number) => {
        const isUser = line.includes("👤 User");
        const isAssistant = line.includes("🤖 Assistant");
        const isSeparator = line.includes("---");

        if (isSeparator) {
          return <hr key={i} className="border-slate-200" />;
        }

        if (isUser || isAssistant) {
          return (
            <div key={i} className="font-semibold text-slate-800">
              {line}
            </div>
          );
        }

        return (
          <p key={i} className="pl-4 text-slate-600">
            {line}
          </p>
        );
      })}
    </div>
  );
}

function AnalysisView({ data }: { data: any }) {
  const { sentimentBreakdown, topicDistribution, messageStats, insights } = data;

  return (
    <div className="space-y-8">
      {/* Sentiment */}
      <div>
        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
          Sentiment Breakdown
        </h4>
        <div className="flex h-8 overflow-hidden rounded-full">
          <div
            className="bg-emerald-400"
            style={{ width: `${sentimentBreakdown?.positive || 0}%` }}
          />
          <div
            className="bg-slate-300"
            style={{ width: `${sentimentBreakdown?.neutral || 0}%` }}
          />
          <div
            className="bg-red-400"
            style={{ width: `${sentimentBreakdown?.negative || 0}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-slate-500">
          <span>😊 Positive {sentimentBreakdown?.positive}%</span>
          <span>😐 Neutral {sentimentBreakdown?.neutral}%</span>
          <span>😟 Negative {sentimentBreakdown?.negative}%</span>
        </div>
      </div>

      {/* Topic Distribution */}
      <div>
        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
          Topic Distribution
        </h4>
        <div className="space-y-3">
          {topicDistribution?.map((topic: any, i: number) => (
            <div key={i}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="font-medium text-slate-700">{topic.topic}</span>
                <span className="text-slate-500">{topic.percentage}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${topic.percentage}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="User Messages" value={messageStats?.userMessages || 0} />
        <StatCard label="AI Responses" value={messageStats?.assistantMessages || 0} />
        <StatCard label="Avg Length" value={`${messageStats?.avgLength || 0} chars`} />
      </div>

      {/* Insights */}
      <div>
        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
          Insights
        </h4>
        <div className="space-y-3">
          {insights?.map((insight: string, i: number) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50 p-4"
            >
              <span className="mt-0.5 text-lg">💡</span>
              <p className="text-sm text-slate-600">{insight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center">
      <div className="text-2xl font-bold text-indigo-600">{value}</div>
      <div className="mt-1 text-xs font-medium text-slate-500">{label}</div>
    </div>
  );
}

function MarkdownView({ data }: { data: any }) {
  return (
    <pre className="overflow-x-auto rounded-xl bg-slate-900 p-6 text-sm leading-relaxed text-slate-300">
      <code>{data.markdown}</code>
    </pre>
  );
}

function getDisplayText(result: any, mode: string): string {
  if (!result?.result) return "";
  const data = result.result;
  switch (mode) {
    case "summary":
      return [
        `## Summary\n\n${data.summary}`,
        data.keyPoints?.length ? `\n### Key Points\n${data.keyPoints.map((p: string) => `- ${p}`).join("\n")}` : "",
        data.actionItems?.length ? `\n### Action Items\n${data.actionItems.map((a: string) => `- [ ] ${a}`).join("\n")}` : "",
      ].filter(Boolean).join("\n");
    case "transcript":
      return data.formatted || "";
    case "analysis":
      return JSON.stringify(data, null, 2);
    case "markdown":
      return data.markdown || "";
    default:
      return "";
  }
}
