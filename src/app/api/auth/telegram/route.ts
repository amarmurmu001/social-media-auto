import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory storage for demo purposes
// In production, use a database
const connectedAccounts = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const { username, botToken } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: 'Telegram username is required' },
        { status: 400 }
      );
    }

    // Simulate Telegram Bot API verification
    // In a real implementation, you would verify the bot token with Telegram API
    await new Promise(resolve => setTimeout(resolve, 500));

    // Store connection info
    const connectionId = `telegram_${Date.now()}`;
    connectedAccounts.set(connectionId, {
      platform: 'telegram',
      username,
      connectedAt: new Date().toISOString(),
      botToken: botToken || 'demo_token', // For demo purposes
    });

    return NextResponse.json({
      success: true,
      connectionId,
      platform: 'telegram',
      username,
      message: `Successfully connected to Telegram account @${username}`,
    });

  } catch (error) {
    console.error('Telegram auth error:', error);
    return NextResponse.json(
      { error: 'Failed to connect Telegram account' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return connected Telegram accounts
  const telegramAccounts = Array.from(connectedAccounts.values())
    .filter(account => account.platform === 'telegram');

  return NextResponse.json({
    connected: telegramAccounts.length > 0,
    accounts: telegramAccounts,
  });
}
