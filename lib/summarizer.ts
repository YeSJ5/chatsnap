import { ScrapedChat, ChatMessage } from './scraper';

export interface SummaryResult {
  summary: string;
  keyPoints: string[];
  actionItems: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  topics: string[];
  wordCount: number;
}

export interface TranscriptResult {
  formatted: string;
  markdown: string;
  html: string;
}

export interface AnalysisResult {
  sentimentBreakdown: { positive: number; neutral: number; negative: number };
  topicDistribution: { topic: string; percentage: number }[];
  messageStats: { userMessages: number; assistantMessages: number; avgLength: number };
  insights: string[];
}

// Simple keyword-based summarization (replace with LLM API in production)
export function generateSummary(chat: ScrapedChat): SummaryResult {
  const allText = chat.messages.map(m => m.content).join(' ');
  const sentences = allText.match(/[^.!?]+[.!?]+/g) || [];

  // Extract key sentences (first sentence of each message + sentences with keywords)
  const keywords = ['decision', 'choose', 'recommend', 'conclusion', 'agree', 'plan', 'timeline', 'action', 'next step'];
  const keySentences = sentences.filter(s => 
    keywords.some(kw => s.toLowerCase().includes(kw))
  ).slice(0, 5);

  // Extract action items
  const actionPatterns = [
    /(?:will|should|need to|must|going to)\s+([^.,]+)/gi,
    /(?:draft|create|set up|schedule|build|implement|deploy)\s+([^.,]+)/gi,
  ];
  const actionItems: string[] = [];
  for (const pattern of actionPatterns) {
    let match;
    while ((match = pattern.exec(allText)) !== null) {
      if (match[1] && match[1].length > 5) {
        actionItems.push(match[1].trim());
      }
    }
  }

  // Extract topics
  const topicWords = ['architecture', 'frontend', 'backend', 'database', 'API', 'deployment', 'testing', 'design', 'security', 'performance'];
  const topics = topicWords.filter(tw => allText.toLowerCase().includes(tw));

  // Simple sentiment
  const positiveWords = ['perfect', 'great', 'awesome', 'excellent', 'love', 'happy', 'agree', 'yes'];
  const negativeWords = ['bad', 'wrong', 'issue', 'problem', 'concern', 'worry', 'no', "do not"];
  const posCount = positiveWords.filter(w => allText.toLowerCase().includes(w)).length;
  const negCount = negativeWords.filter(w => allText.toLowerCase().includes(w)).length;
  let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
  if (posCount > negCount) sentiment = 'positive';
  if (negCount > posCount) sentiment = 'negative';

  return {
    summary: keySentences.join(' ') || chat.messages.slice(0, 3).map(m => m.content).join(' '),
    keyPoints: keySentences.map(s => s.trim()),
    actionItems: [...new Set(actionItems)].slice(0, 6),
    sentiment,
    topics: topics.length > 0 ? topics : ['General Discussion'],
    wordCount: allText.split(/\s+/).length,
  };
}

export function generateTranscript(chat: ScrapedChat): TranscriptResult {
  const formatted = chat.messages.map((m, i) => {
    const role = m.role === 'user' ? '👤 User' : '🤖 Assistant';
    return `${role}:\n${m.content}\n`;
  }).join('\n---\n\n');

  const markdown = `## ${chat.title}\n\n**Source:** ${chat.source}\n**Date:** ${chat.metadata.date ? new Date(chat.metadata.date).toLocaleDateString() : 'Unknown'}\n**Messages:** ${chat.metadata.totalMessages}\n\n---\n\n${chat.messages.map(m => {
    const role = m.role === 'user' ? '**User**' : '**Assistant**';
    return `${role}:\n${m.content}`;
  }).join('\n\n---\n\n')}`;

  const html = chat.messages.map(m => {
    const isUser = m.role === 'user';
    return `<div class="message ${isUser ? 'user' : 'assistant'}">\n  <div class="message-header">${isUser ? '👤' : '🤖'} ${isUser ? 'User' : 'Assistant'}</div>\n  <div class="message-content">${m.content}</div>\n</div>`;
  }).join('\n');

  return { formatted, markdown, html };
}

export function generateAnalysis(chat: ScrapedChat): AnalysisResult {
  const allText = chat.messages.map(m => m.content).join(' ');
  const userMessages = chat.messages.filter(m => m.role === 'user');
  const assistantMessages = chat.messages.filter(m => m.role === 'assistant');

  // Sentiment analysis
  const positiveWords = ['perfect', 'great', 'awesome', 'excellent', 'love', 'happy', 'agree', 'yes', 'good', 'best'];
  const negativeWords = ['bad', 'wrong', 'issue', 'problem', 'concern', 'worry', 'no', "do not", 'hate', 'terrible'];
  const posCount = positiveWords.filter(w => allText.toLowerCase().includes(w)).length;
  const negCount = negativeWords.filter(w => allText.toLowerCase().includes(w)).length;
  const total = posCount + negCount + 1;

  // Topic distribution
  const topicMap: Record<string, string[]> = {
    'Architecture': ['architecture', 'microservice', 'monolith', 'scalable', 'system'],
    'Frontend': ['react', 'vue', 'angular', 'frontend', 'ui', 'component'],
    'Backend': ['api', 'backend', 'server', 'endpoint', 'rest', 'graphql'],
    'Database': ['database', 'sql', 'nosql', 'postgres', 'mongo', 'schema'],
    'DevOps': ['deploy', 'ci/cd', 'pipeline', 'docker', 'kubernetes', 'aws'],
    'Planning': ['timeline', 'sprint', 'milestone', 'plan', 'schedule', 'week'],
  };

  const topicDistribution = Object.entries(topicMap).map(([topic, words]) => {
    const count = words.filter(w => allText.toLowerCase().includes(w)).length;
    return { topic, count };
  }).filter(t => t.count > 0).map(t => ({
    topic: t.topic,
    percentage: Math.round((t.count / Math.max(...Object.entries(topicMap).map(([_, w]) => w.filter(word => allText.toLowerCase().includes(word)).length))) * 100) || 0,
  })).sort((a, b) => b.percentage - a.percentage);

  const totalTopicCount = topicDistribution.reduce((sum, t) => sum + t.percentage, 0) || 1;
  const normalizedTopics = topicDistribution.map(t => ({
    ...t,
    percentage: Math.round((t.percentage / totalTopicCount) * 100),
  }));

  return {
    sentimentBreakdown: {
      positive: Math.round((posCount / total) * 100),
      neutral: Math.round((1 / total) * 100),
      negative: Math.round((negCount / total) * 100),
    },
    topicDistribution: normalizedTopics.length > 0 ? normalizedTopics : [{ topic: 'General', percentage: 100 }],
    messageStats: {
      userMessages: userMessages.length,
      assistantMessages: assistantMessages.length,
      avgLength: Math.round(allText.length / chat.messages.length),
    },
    insights: [
      `Conversation has ${chat.metadata.totalMessages} messages with ${chat.metadata.estimatedTokens} estimated tokens.`,
      `User initiated ${userMessages.length} prompts, Assistant responded ${assistantMessages.length} times.`,
      `Average message length is ${Math.round(allText.length / chat.messages.length)} characters.`,
      `Dominant topics: ${normalizedTopics.slice(0, 3).map(t => t.topic).join(', ') || 'General Discussion'}.`,
    ],
  };
}
