import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory storage for demo purposes
// In production, use a database
const connectedAccounts = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, accessToken } = await request.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'WhatsApp phone number is required' },
        { status: 400 }
      );
    }

    // Simulate WhatsApp Business API verification
    // In a real implementation, you would verify the access token with WhatsApp Business API
    await new Promise(resolve => setTimeout(resolve, 500));

    // Store connection info
    const connectionId = `whatsapp_${Date.now()}`;
    connectedAccounts.set(connectionId, {
      platform: 'whatsapp',
      phoneNumber,
      connectedAt: new Date().toISOString(),
      accessToken: accessToken || 'demo_token', // For demo purposes
    });

    return NextResponse.json({
      success: true,
      connectionId,
      platform: 'whatsapp',
      phoneNumber,
      message: `Successfully connected to WhatsApp Business account ${phoneNumber}`,
    });

  } catch (error) {
    console.error('WhatsApp auth error:', error);
    return NextResponse.json(
      { error: 'Failed to connect WhatsApp account' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return connected WhatsApp accounts
  const whatsappAccounts = Array.from(connectedAccounts.values())
    .filter(account => account.platform === 'whatsapp');

  return NextResponse.json({
    connected: whatsappAccounts.length > 0,
    accounts: whatsappAccounts,
  });
}
