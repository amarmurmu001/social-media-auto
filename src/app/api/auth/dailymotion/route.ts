import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory storage for demo purposes
// In production, use a database
const connectedAccounts = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const { username, accessToken } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: 'DailyMotion username is required' },
        { status: 400 }
      );
    }

    // Simulate DailyMotion API verification
    // In a real implementation, you would verify the access token with DailyMotion API
    await new Promise(resolve => setTimeout(resolve, 500));

    // Store connection info
    const connectionId = `dailymotion_${Date.now()}`;
    connectedAccounts.set(connectionId, {
      platform: 'dailymotion',
      username,
      connectedAt: new Date().toISOString(),
      accessToken: accessToken || 'demo_token', // For demo purposes
    });

    return NextResponse.json({
      success: true,
      connectionId,
      platform: 'dailymotion',
      username,
      message: `Successfully connected to DailyMotion account @${username}`,
    });

  } catch (error) {
    console.error('DailyMotion auth error:', error);
    return NextResponse.json(
      { error: 'Failed to connect DailyMotion account' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return connected DailyMotion accounts
  const dailymotionAccounts = Array.from(connectedAccounts.values())
    .filter(account => account.platform === 'dailymotion');

  return NextResponse.json({
    connected: dailymotionAccounts.length > 0,
    accounts: dailymotionAccounts,
  });
}
