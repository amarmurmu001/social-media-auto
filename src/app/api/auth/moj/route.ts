import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory storage for demo purposes
// In production, use a database
const connectedAccounts = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const { username, accessToken } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: 'Moj username is required' },
        { status: 400 }
      );
    }

    // Simulate Moj API verification
    // In a real implementation, you would verify the access token with Moj API
    await new Promise(resolve => setTimeout(resolve, 500));

    // Store connection info
    const connectionId = `moj_${Date.now()}`;
    connectedAccounts.set(connectionId, {
      platform: 'moj',
      username,
      connectedAt: new Date().toISOString(),
      accessToken: accessToken || 'demo_token', // For demo purposes
    });

    return NextResponse.json({
      success: true,
      connectionId,
      platform: 'moj',
      username,
      message: `Successfully connected to Moj account @${username}`,
    });

  } catch (error) {
    console.error('Moj auth error:', error);
    return NextResponse.json(
      { error: 'Failed to connect Moj account' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return connected Moj accounts
  const mojAccounts = Array.from(connectedAccounts.values())
    .filter(account => account.platform === 'moj');

  return NextResponse.json({
    connected: mojAccounts.length > 0,
    accounts: mojAccounts,
  });
}
