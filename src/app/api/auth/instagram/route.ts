import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory storage for demo purposes
const connectedAccounts = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const { username, accountType, accessToken } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: 'Instagram username is required' },
        { status: 400 }
      );
    }

    // Simulate Instagram API verification
    await new Promise(resolve => setTimeout(resolve, 800));

    const connectionId = `instagram_${Date.now()}`;
    connectedAccounts.set(connectionId, {
      platform: 'instagram',
      username,
      accountType: accountType || 'personal',
      connectedAt: new Date().toISOString(),
      accessToken: accessToken || 'demo_token',
    });

    return NextResponse.json({
      success: true,
      connectionId,
      platform: 'instagram',
      username,
      message: `Successfully connected to Instagram account @${username}`,
    });

  } catch (error) {
    console.error('Instagram auth error:', error);
    return NextResponse.json(
      { error: 'Failed to connect Instagram account' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const instagramAccounts = Array.from(connectedAccounts.values())
    .filter(account => account.platform === 'instagram');

  return NextResponse.json({
    connected: instagramAccounts.length > 0,
    accounts: instagramAccounts,
  });
}
