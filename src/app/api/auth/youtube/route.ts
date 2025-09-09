import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory storage for demo purposes
const connectedAccounts = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const { channelId, channelName, accessToken } = await request.json();

    if (!channelId || !channelName) {
      return NextResponse.json(
        { error: 'YouTube Channel ID and name are required' },
        { status: 400 }
      );
    }

    // Simulate YouTube API verification
    await new Promise(resolve => setTimeout(resolve, 900));

    const connectionId = `youtube_${Date.now()}`;
    connectedAccounts.set(connectionId, {
      platform: 'youtube',
      channelId,
      channelName,
      connectedAt: new Date().toISOString(),
      accessToken: accessToken || 'demo_token',
    });

    return NextResponse.json({
      success: true,
      connectionId,
      platform: 'youtube',
      channelName,
      message: `Successfully connected to YouTube channel: ${channelName}`,
    });

  } catch (error) {
    console.error('YouTube auth error:', error);
    return NextResponse.json(
      { error: 'Failed to connect YouTube channel' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const youtubeAccounts = Array.from(connectedAccounts.values())
    .filter(account => account.platform === 'youtube');

  return NextResponse.json({
    connected: youtubeAccounts.length > 0,
    accounts: youtubeAccounts,
  });
}
