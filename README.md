# ChatSnap — AI Chat Link Summarizer

A production-ready Next.js 14 app that lets you paste any AI chat link (ChatGPT, Claude, Gemini, Perplexity, Kimi, etc.) and instantly get summaries, transcripts, and deep analysis.

## Features

- 🔗 **Paste any chat link** — Supports 8+ AI platforms
- 📝 **Smart Summarize** — Extract key insights and action items
- 📜 **Clean Transcript** — Beautifully formatted conversation logs
- 🔬 **Deep Analysis** — Sentiment analysis, topic distribution, message stats
- ⬇️ **Export** — Download as Markdown, copy to clipboard
- 🎨 **iLovePDF-inspired UI** — Card-based tools, drag & drop, smooth animations

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (animations)
- **Cheerio** (web scraping)
- **Lucide React** (icons)

## Quick Start

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd chatsnap

# 2. Install dependencies
npm install

# 3. Run dev server
npm run dev

# 4. Open http://localhost:3000
```

## Deploy to Vercel

### Option 1: Vercel CLI (Fastest)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Option 2: GitHub + Vercel Dashboard

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/chatsnap.git
   git push -u origin main
   ```

2. **Import to Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Framework Preset: **Next.js**
   - Click **Deploy**

3. **Done!** Vercel will auto-build and deploy. You'll get a `.vercel.app` URL.

## Project Structure

```
chatsnap/
├── app/
│   ├── api/
│   │   ├── scrape/route.ts      # Scrapes chat links
│   │   └── summarize/route.ts   # Generates summaries
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                 # Main UI
├── components/
│   ├── Header.tsx
│   ├── DropZone.tsx
│   ├── PlatformTags.tsx
│   ├── Features.tsx
│   ├── ResultPanel.tsx
│   ├── ToolsGrid.tsx
│   └── Toast.tsx
├── lib/
│   ├── utils.ts
│   ├── scraper.ts               # Scraping logic
│   └── summarizer.ts            # Summary generation
├── package.json
├── tailwind.config.ts
└── next.config.js
```

## How It Works

1. **Scrape** (`/api/scrape`): Fetches the shared chat page, extracts conversation data using Cheerio. Falls back to mock data for demo purposes.
2. **Summarize** (`/api/summarize`): Processes the chat data based on selected mode (summary/transcript/analysis/markdown).
3. **Display**: Results shown in an interactive panel with copy/download/export options.

## Environment Variables (Optional)

For production with real LLM summarization, add:

```env
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-...
```

Then update `lib/summarizer.ts` to call the LLM API instead of using keyword-based summarization.

## License

MIT
