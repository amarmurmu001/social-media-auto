import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory storage for demo purposes
// In production, use a database
const connectedAccounts = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const { username, accessToken } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: 'Snapchat username is required' },
        { status: 400 }
      );
    }

    // Simulate Snapchat API verification
    // In a real implementation, you would verify the access token with Snapchat API
    await new Promise(resolve => setTimeout(resolve, 500));

    // Store connection info
    const connectionId = `snapchat_${Date.now()}`;
    connectedAccounts.set(connectionId, {
      platform: 'snapchat',
      username,
      connectedAt: new Date().toISOString(),
      accessToken: accessToken || 'demo_token', // For demo purposes
    });

    return NextResponse.json({
      success: true,
      connectionId,
      platform: 'snapchat',
      username,
      message: `Successfully connected to Snapchat account @${username}`,
    });

  } catch (error) {
    console.error('Snapchat auth error:', error);
    return NextResponse.json(
      { error: 'Failed to connect Snapchat account' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return connected Snapchat accounts
  const snapchatAccounts = Array.from(connectedAccounts.values())
    .filter(account => account.platform === 'snapchat');

  return NextResponse.json({
    connected: snapchatAccounts.length > 0,
    accounts: snapchatAccounts,
  });
}
