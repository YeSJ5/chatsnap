"use client";

import { CheckCircle, X } from "lucide-react";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export default function Toast({ message, isVisible, onClose }: ToastProps) {
  if (!isVisible) return null;
  
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl bg-slate-800 px-5 py-3 text-white shadow-2xl animate-slide-up">
      <CheckCircle className="h-5 w-5 text-emerald-400" />
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 text-slate-400 hover:text-white">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}