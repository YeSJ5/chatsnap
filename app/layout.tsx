import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "ChatSnap — AI Chat Link Summarizer",
  description: "Paste any AI chat link from ChatGPT, Claude, Gemini, Perplexity and get instant summaries, transcripts, and analysis.",
  keywords: ["AI", "chat", "summary", "ChatGPT", "Claude", "Gemini", "Perplexity", "Kimi"],
  openGraph: {
    title: "ChatSnap — AI Chat Link Summarizer",
    description: "Instantly summarize and analyze AI chat conversations",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
