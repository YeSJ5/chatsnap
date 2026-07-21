"use client";

import { useState, useCallback } from "react";
import Header from "@/components/Header";
import DropZone from "@/components/DropZone";
import PlatformTags from "@/components/PlatformTags";
import Features from "@/components/Features";
import ResultPanel from "@/components/ResultPanel";
import ToolsGrid from "@/components/ToolsGrid";
import Toast from "@/components/Toast";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [mode, setMode] = useState("summary");
  const [activeTool, setActiveTool] = useState("summarize");
  const [toast, setToast] = useState({ show: false, message: "" });

  const showToast = useCallback((message: string) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 2500);
  }, []);

  const handleSubmit = useCallback(
    async (url: string) => {
      if (!url.trim()) return;
      setIsLoading(true);
      setResult(null);

      try {
        const scrapeRes = await fetch("/api/scrape", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });

        const scrapeData = await scrapeRes.json();

        if (!scrapeData.success) {
          showToast(scrapeData.error || "Failed to fetch chat");
          setIsLoading(false);
          return;
        }

        const toolModeMap: Record<string, string> = {
          summarize: "summary",
          transcript: "transcript",
          analysis: "analysis",
          compare: "summary",
          export: "markdown",
          search: "summary",
        };

        const summarizeRes = await fetch("/api/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chatData: scrapeData.data,
            mode: toolModeMap[activeTool] || "summary",
          }),
        });

        const summarizeData = await summarizeRes.json();

        if (summarizeData.success) {
          setResult(summarizeData);
          setMode(toolModeMap[activeTool] || "summary");
          showToast(scrapeData.isMock ? "Demo mode: Mock data generated" : "Chat processed successfully!");
        } else {
          showToast(summarizeData.error || "Failed to summarize");
        }
      } catch (error) {
        showToast("Network error. Please try again.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    [activeTool, showToast]
  );

  const handleToolSelect = useCallback(
    (toolId: string) => {
      setActiveTool(toolId);
      showToast(`Tool selected: ${toolId}`);
    },
    [showToast]
  );

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <Header />

      <div className="mx-auto max-w-5xl px-4 -mt-8 relative z-10">
        <div className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/50 border border-slate-100 md:p-10">
          <DropZone onSubmit={handleSubmit} isLoading={isLoading} />
          <PlatformTags />
          <Features />
        </div>

        {result && (
          <ResultPanel
            result={result}
            mode={mode}
            onModeChange={setMode}
            onClose={() => setResult(null)}
          />
        )}

        <ToolsGrid onToolSelect={handleToolSelect} activeTool={activeTool} />
      </div>

      <Toast
        message={toast.message}
        isVisible={toast.show}
        onClose={() => setToast({ show: false, message: "" })}
      />
    </main>
  );
}