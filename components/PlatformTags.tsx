"use client";

const platforms = [
  { name: "ChatGPT", icon: "🤖" },
  { name: "Claude", icon: "🧠" },
  { name: "Gemini", icon: "✨" },
  { name: "Perplexity", icon: "🔍" },
  { name: "Kimi", icon: "🌙" },
  { name: "Copilot", icon: "💬" },
  { name: "DeepSeek", icon: "📝" },
  { name: "Poe", icon: "🦙" },
];

export default function PlatformTags() {
  return (
    <div className="mt-8 flex flex-wrap justify-center gap-2.5">
      {platforms.map((platform) => (
        <span
          key={platform.name}
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-600 transition-all duration-200 hover:border-indigo-300 hover:text-indigo-600"
        >
          <span>{platform.icon}</span>
          {platform.name}
        </span>
      ))}
    </div>
  );
}