import { NextRequest, NextResponse } from 'next/server';
import { generateSummary, generateTranscript, generateAnalysis } from '@/lib/summarizer';
import { ScrapedChat } from '@/lib/scraper';

export async function POST(request: NextRequest) {
  try {
    const { chatData, mode = 'summary' } = await request.json();

    if (!chatData) {
      return NextResponse.json(
        { error: 'No chat data provided' },
        { status: 400 }
      );
    }

    const chat: ScrapedChat = chatData;

    let result;

    switch (mode) {
      case 'summary':
        result = generateSummary(chat);
        break;
      case 'transcript':
        result = generateTranscript(chat);
        break;
      case 'analysis':
        result = generateAnalysis(chat);
        break;
      case 'markdown':
        const transcript = generateTranscript(chat);
        result = { markdown: transcript.markdown };
        break;
      default:
        result = generateSummary(chat);
    }

    return NextResponse.json({
      success: true,
      mode,
      result,
      chatInfo: {
        title: chat.title,
        source: chat.source,
        messageCount: chat.metadata.totalMessages,
      },
    });

  } catch (error) {
    console.error('Summarize error:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary', details: (error as Error).message },
      { status: 500 }
    );
  }
}
