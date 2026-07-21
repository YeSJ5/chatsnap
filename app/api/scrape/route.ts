import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { detectPlatform, extractChatId, generateMockData, ScrapedChat } from '@/lib/scraper';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || !url.startsWith('http')) {
      return NextResponse.json(
        { error: 'Invalid URL provided' },
        { status: 400 }
      );
    }

    const platform = detectPlatform(url);
    const chatId = extractChatId(url);

    // Attempt to fetch the shared chat page
    let scrapedData: ScrapedChat;

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        next: { revalidate: 0 },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      // Try to extract conversation data from the page
      // Different platforms store data differently
      const title = $('title').text() || `${platform} Conversation`;

      // Look for JSON-LD or meta tags with conversation data
      const scripts = $('script[type="application/json"]').toArray();
      let conversationData: any = null;

      for (const script of scripts) {
        try {
          const data = JSON.parse($(script).html() || '{}');
          if (data.messages || data.conversation || data.chat) {
            conversationData = data;
            break;
          }
        } catch {
          // Skip invalid JSON
        }
      }

      // Extract visible text as fallback
      const visibleText = $('body').text();

      if (conversationData && conversationData.messages) {
        scrapedData = {
          title,
          source: platform,
          messages: conversationData.messages.map((m: any) => ({
            role: m.role || 'assistant',
            content: m.content || m.text || '',
            timestamp: m.timestamp,
          })),
          metadata: {
            totalMessages: conversationData.messages.length,
            estimatedTokens: Math.round(visibleText.length / 4),
            date: new Date().toISOString(),
          },
        };
      } else {
        // Fallback: generate structured data from visible text
        const paragraphs = $('p, div[role="dialog"] div, .message, [data-testid="conversation-turn"]')
          .map((_, el) => $(el).text().trim())
          .get()
          .filter(t => t.length > 20);

        if (paragraphs.length > 0) {
          scrapedData = {
            title,
            source: platform,
            messages: paragraphs.slice(0, 20).map((text, i) => ({
              role: i % 2 === 0 ? 'user' : 'assistant',
              content: text,
            })),
            metadata: {
              totalMessages: paragraphs.length,
              estimatedTokens: Math.round(visibleText.length / 4),
              date: new Date().toISOString(),
            },
          };
        } else {
          // If scraping fails, use mock data for demo
          scrapedData = generateMockData(platform);
        }
      }
    } catch (fetchError) {
      console.warn('Fetch failed, using mock data:', fetchError);
      scrapedData = generateMockData(platform);
    }

    return NextResponse.json({
      success: true,
      data: scrapedData,
      platform,
      chatId,
      isMock: scrapedData.title.includes('Mock') || !chatId,
    });

  } catch (error) {
    console.error('Scrape error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat link', details: (error as Error).message },
      { status: 500 }
    );
  }
}
