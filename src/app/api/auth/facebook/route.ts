import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory storage for demo purposes
const connectedAccounts = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const { pageId, pageName, accessToken } = await request.json();

    if (!pageId || !pageName) {
      return NextResponse.json(
        { error: 'Facebook Page ID and name are required' },
        { status: 400 }
      );
    }

    // Simulate Facebook API verification
    await new Promise(resolve => setTimeout(resolve, 600));

    const connectionId = `facebook_${Date.now()}`;
    connectedAccounts.set(connectionId, {
      platform: 'facebook',
      pageId,
      pageName,
      connectedAt: new Date().toISOString(),
      accessToken: accessToken || 'demo_token',
    });

    return NextResponse.json({
      success: true,
      connectionId,
      platform: 'facebook',
      pageName,
      message: `Successfully connected to Facebook Page: ${pageName}`,
    });

  } catch (error) {
    console.error('Facebook auth error:', error);
    return NextResponse.json(
      { error: 'Failed to connect Facebook Page' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const facebookAccounts = Array.from(connectedAccounts.values())
    .filter(account => account.platform === 'facebook');

  return NextResponse.json({
    connected: facebookAccounts.length > 0,
    accounts: facebookAccounts,
  });
}
