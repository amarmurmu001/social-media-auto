import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory storage for demo purposes
const connectedAccounts = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const { profileId, profileName, accessToken } = await request.json();

    if (!profileId || !profileName) {
      return NextResponse.json(
        { error: 'LinkedIn Profile ID and name are required' },
        { status: 400 }
      );
    }

    // Simulate LinkedIn API verification
    await new Promise(resolve => setTimeout(resolve, 700));

    const connectionId = `linkedin_${Date.now()}`;
    connectedAccounts.set(connectionId, {
      platform: 'linkedin',
      profileId,
      profileName,
      connectedAt: new Date().toISOString(),
      accessToken: accessToken || 'demo_token',
    });

    return NextResponse.json({
      success: true,
      connectionId,
      platform: 'linkedin',
      profileName,
      message: `Successfully connected to LinkedIn profile: ${profileName}`,
    });

  } catch (error) {
    console.error('LinkedIn auth error:', error);
    return NextResponse.json(
      { error: 'Failed to connect LinkedIn profile' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const linkedinAccounts = Array.from(connectedAccounts.values())
    .filter(account => account.platform === 'linkedin');

  return NextResponse.json({
    connected: linkedinAccounts.length > 0,
    accounts: linkedinAccounts,
  });
}
