import { NextRequest, NextResponse } from 'next/server';

// This would normally come from a database or shared storage
// For demo purposes, we'll simulate some connected accounts
const mockConnectedAccounts = {
  whatsapp: [
    { phoneNumber: '+1234567890', connectedAt: '2024-01-16T10:30:00Z' }
  ],
  instagram: [],
  youtube: [
    { channelName: 'My Channel', connectedAt: '2024-01-13T09:20:00Z' }
  ],
  twitter: [
    { username: 'johndoe', connectedAt: '2024-01-15T10:30:00Z' }
  ],
  linkedin: [],
  telegram: [
    { username: 'mybot', connectedAt: '2024-01-14T12:00:00Z' }
  ],
  moj: [],
  pinterest: [
    { username: 'mypins', connectedAt: '2024-01-12T14:30:00Z' }
  ],
  dailymotion: [],
  snapchat: [
    { username: 'mysnaps', connectedAt: '2024-01-11T16:20:00Z' }
  ],
  facebook: [
    { pageName: 'My Business Page', connectedAt: '2024-01-14T15:45:00Z' }
  ],
};

export async function GET() {
  try {
    // In a real implementation, you would fetch from database
    const status = {
      whatsapp: { connected: mockConnectedAccounts.whatsapp.length > 0, accounts: mockConnectedAccounts.whatsapp },
      instagram: { connected: mockConnectedAccounts.instagram.length > 0, accounts: mockConnectedAccounts.instagram },
      youtube: { connected: mockConnectedAccounts.youtube.length > 0, accounts: mockConnectedAccounts.youtube },
      twitter: { connected: mockConnectedAccounts.twitter.length > 0, accounts: mockConnectedAccounts.twitter },
      linkedin: { connected: mockConnectedAccounts.linkedin.length > 0, accounts: mockConnectedAccounts.linkedin },
      telegram: { connected: mockConnectedAccounts.telegram.length > 0, accounts: mockConnectedAccounts.telegram },
      moj: { connected: mockConnectedAccounts.moj.length > 0, accounts: mockConnectedAccounts.moj },
      pinterest: { connected: mockConnectedAccounts.pinterest.length > 0, accounts: mockConnectedAccounts.pinterest },
      dailymotion: { connected: mockConnectedAccounts.dailymotion.length > 0, accounts: mockConnectedAccounts.dailymotion },
      snapchat: { connected: mockConnectedAccounts.snapchat.length > 0, accounts: mockConnectedAccounts.snapchat },
      facebook: { connected: mockConnectedAccounts.facebook.length > 0, accounts: mockConnectedAccounts.facebook },
    };

    const totalConnected = Object.values(status).filter((s: any) => s.connected).length;

    return NextResponse.json({
      success: true,
      status,
      totalConnected,
      summary: `${totalConnected} of 11 platforms connected`,
    });

  } catch (error) {
    console.error('Auth status error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch authentication status' },
      { status: 500 }
    );
  }
}
