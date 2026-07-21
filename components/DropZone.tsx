"use client";

import { useState, useCallback } from "react";
import { Clipboard, Link, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface DropZoneProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export default function DropZone({ onSubmit, isLoading }: DropZoneProps) {
  const [url, setUrl] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const text = e.dataTransfer.getData("text");
      if (text) {
        setUrl(text);
        onSubmit(text);
      }
    },
    [onSubmit]
  );

  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      const text = e.clipboardData?.getData("text");
      if (text && (text.includes("http") || text.includes("chat"))) {
        setUrl(text);
        onSubmit(text);
      }
    },
    [onSubmit]
  );

  // Listen for paste events
  useState(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("paste", handlePaste);
      return () => window.removeEventListener("paste", handlePaste);
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mx-auto max-w-3xl"
    >
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById("url-input")?.focus()}
        className={cn(
          "cursor-pointer rounded-2xl border-3 border-dashed p-8 text-center transition-all duration-300 md:p-12",
          isDragOver
            ? "border-pink-400 bg-pink-50 scale-[1.02]"
            : "border-slate-200 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50/50"
        )}
      >
        <AnimatePresence mode="wait">
          {isDragOver ? (
            <motion.div
              key="drop"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <Link className="mx-auto mb-3 h-12 w-12 text-pink-500" />
              <p className="text-lg font-semibold text-pink-600">Drop it here!</p>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <Clipboard className="mx-auto mb-3 h-12 w-12 text-indigo-400" />
              <h3 className="mb-1 text-lg font-semibold text-slate-800">
                Paste or Drop Your Chat Link
              </h3>
              <p className="text-sm text-slate-500">
                Supports Claude, ChatGPT, Gemini, Perplexity, Kimi, and more
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* URL Input */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Link className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            id="url-input"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && url && onSubmit(url)}
            placeholder="https://chat.openai.com/share/..."
            className="w-full rounded-xl border-2 border-slate-200 bg-white py-3.5 pl-10 pr-4 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
          />
        </div>
        <button
          onClick={() => url && onSubmit(url)}
          disabled={isLoading || !url}
          className={cn(
            "flex items-center justify-center gap-2 rounded-xl px-8 py-3.5 font-semibold text-white transition-all",
            isLoading || !url
              ? "cursor-not-allowed bg-slate-300"
              : "bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:translate-y-0"
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            "Summarize"
          )}
        </button>
      </div>
    </motion.div>
  );
}
