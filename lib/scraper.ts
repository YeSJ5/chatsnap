export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface ScrapedChat {
  title: string;
  source: string;
  messages: ChatMessage[];
  metadata: {
    totalMessages: number;
    estimatedTokens: number;
    date?: string;
  };
}

// Detect which platform a URL belongs to
export function detectPlatform(url: string): string {
  const domain = new URL(url).hostname.toLowerCase();

  if (domain.includes('chat.openai.com') || domain.includes('chatgpt.com')) return 'ChatGPT';
  if (domain.includes('claude.ai')) return 'Claude';
  if (domain.includes('gemini.google.com') || domain.includes('bard.google.com')) return 'Gemini';
  if (domain.includes('perplexity.ai')) return 'Perplexity';
  if (domain.includes('kimi.moonshot.cn')) return 'Kimi';
  if (domain.includes('copilot.microsoft.com')) return 'Copilot';
  if (domain.includes('deepseek.com')) return 'DeepSeek';
  if (domain.includes('poe.com')) return 'Poe';
  if (domain.includes('huggingface.co')) return 'HuggingFace';

  return 'Unknown';
}

// Extract chat ID from various URL formats
export function extractChatId(url: string): string | null {
  const patterns = [
    /chat.openai.com\/share\/([a-zA-Z0-9_-]+)/,
    /chatgpt.com\/share\/([a-zA-Z0-9_-]+)/,
    /claude.ai\/share\/([a-zA-Z0-9_-]+)/,
    /gemini.google.com\/app\/([a-zA-Z0-9_-]+)/,
    /perplexity.ai\/search\/([a-zA-Z0-9_-]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

// Generate mock data for demo purposes when scraping fails
export function generateMockData(platform: string): ScrapedChat {
  const topics = [
    'Microservices Architecture Decision',
    'React vs Vue Frontend Debate',
    'Database Schema Design',
    'CI/CD Pipeline Setup',
    'API Gateway Configuration',
  ];

  const topic = topics[Math.floor(Math.random() * topics.length)];

  return {
    title: `${platform} Conversation: ${topic}`,
    source: platform,
    messages: [
      {
        role: 'user',
        content: `Hey, I need help with ${topic.toLowerCase()}. We are building a new system and need to make some key architectural decisions.`,
      },
      {
        role: 'assistant',
        content: `I would be happy to help with ${topic.toLowerCase()}. Let me break this down into key considerations. First, let us look at your current requirements and constraints.`,
      },
      {
        role: 'user',
        content: 'We have about 10K daily users now but expect 10x growth in 6 months. Budget is moderate, team is 5 engineers.',
      },
      {
        role: 'assistant',
        content: 'With that growth trajectory, scalability should be your primary concern. I recommend starting with a modular monolith that can be easily decomposed into microservices later. This gives you velocity now without painting yourself into a corner.',
      },
      {
        role: 'user',
        content: 'That makes sense. What about the tech stack? React or Vue for frontend?',
      },
      {
        role: 'assistant',
        content: 'For a team of 5 with growth plans, React + TypeScript is the safer bet. Larger ecosystem, more hiring pool, better tooling. Vue is simpler but React has more enterprise-grade libraries.',
      },
      {
        role: 'user',
        content: 'Database choice? PostgreSQL or MongoDB?',
      },
      {
        role: 'assistant',
        content: 'PostgreSQL. ACID compliance is non-negotiable for financial data, and you can always add MongoDB later for analytics/logs if needed. PostgreSQL also handles JSON well now.',
      },
      {
        role: 'user',
        content: "Perfect. Let us lock this in. Timeline?",
      },
      {
        role: 'assistant',
        content: '6-week sprint: Week 1-2: Setup & scaffolding, Week 3-4: Core features, Week 5: Integration testing, Week 6: Deploy & monitor. I will draft a detailed plan.',
      },
      {
        role: 'user',
        content: 'Awesome. Can you also help with the CI/CD pipeline setup?',
      },
      {
        role: 'assistant',
        content: 'Absolutely. GitHub Actions + Docker + AWS ECS is the golden path. I will set up automated testing, building, and deployment with rollback capabilities.',
      },
    ],
    metadata: {
      totalMessages: 12,
      estimatedTokens: 2847,
      date: new Date().toISOString(),
    },
  };
}
