import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory storage for demo purposes
// In production, use a database
const connectedAccounts = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const { username, accessToken } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: 'Pinterest username is required' },
        { status: 400 }
      );
    }

    // Simulate Pinterest API verification
    // In a real implementation, you would verify the access token with Pinterest API
    await new Promise(resolve => setTimeout(resolve, 500));

    // Store connection info
    const connectionId = `pinterest_${Date.now()}`;
    connectedAccounts.set(connectionId, {
      platform: 'pinterest',
      username,
      connectedAt: new Date().toISOString(),
      accessToken: accessToken || 'demo_token', // For demo purposes
    });

    return NextResponse.json({
      success: true,
      connectionId,
      platform: 'pinterest',
      username,
      message: `Successfully connected to Pinterest account @${username}`,
    });

  } catch (error) {
    console.error('Pinterest auth error:', error);
    return NextResponse.json(
      { error: 'Failed to connect Pinterest account' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return connected Pinterest accounts
  const pinterestAccounts = Array.from(connectedAccounts.values())
    .filter(account => account.platform === 'pinterest');

  return NextResponse.json({
    connected: pinterestAccounts.length > 0,
    accounts: pinterestAccounts,
  });
}
