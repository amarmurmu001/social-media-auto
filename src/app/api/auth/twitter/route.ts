import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory storage for demo purposes
// In production, use a database
const connectedAccounts = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const { username, accessToken } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: 'Twitter username is required' },
        { status: 400 }
      );
    }

    // Simulate Twitter OAuth verification
    // In a real implementation, you would verify the access token with Twitter API
    await new Promise(resolve => setTimeout(resolve, 500));

    // Store connection info
    const connectionId = `twitter_${Date.now()}`;
    connectedAccounts.set(connectionId, {
      platform: 'twitter',
      username,
      connectedAt: new Date().toISOString(),
      accessToken: accessToken || 'demo_token', // For demo purposes
    });

    return NextResponse.json({
      success: true,
      connectionId,
      platform: 'twitter',
      username,
      message: `Successfully connected to Twitter account @${username}`,
    });

  } catch (error) {
    console.error('Twitter auth error:', error);
    return NextResponse.json(
      { error: 'Failed to connect Twitter account' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return connected Twitter accounts
  const twitterAccounts = Array.from(connectedAccounts.values())
    .filter(account => account.platform === 'twitter');

  return NextResponse.json({
    connected: twitterAccounts.length > 0,
    accounts: twitterAccounts,
  });
}
