import { NextRequest, NextResponse } from 'next/server';

// This would normally come from a database or shared storage
// For demo purposes, we'll simulate some connected accounts
const mockConnectedAccounts = {
  twitter: [
    { username: 'johndoe', connectedAt: '2024-01-15T10:30:00Z' }
  ],
  facebook: [
    { pageName: 'My Business Page', connectedAt: '2024-01-14T15:45:00Z' }
  ],
  linkedin: [],
  instagram: [],
  youtube: [
    { channelName: 'My Channel', connectedAt: '2024-01-13T09:20:00Z' }
  ],
};

export async function GET() {
  try {
    // In a real implementation, you would fetch from database
    const status = {
      twitter: { connected: mockConnectedAccounts.twitter.length > 0, accounts: mockConnectedAccounts.twitter },
      facebook: { connected: mockConnectedAccounts.facebook.length > 0, accounts: mockConnectedAccounts.facebook },
      linkedin: { connected: mockConnectedAccounts.linkedin.length > 0, accounts: mockConnectedAccounts.linkedin },
      instagram: { connected: mockConnectedAccounts.instagram.length > 0, accounts: mockConnectedAccounts.instagram },
      youtube: { connected: mockConnectedAccounts.youtube.length > 0, accounts: mockConnectedAccounts.youtube },
    };

    const totalConnected = Object.values(status).filter((s: any) => s.connected).length;

    return NextResponse.json({
      success: true,
      status,
      totalConnected,
      summary: `${totalConnected} of 5 platforms connected`,
    });

  } catch (error) {
    console.error('Auth status error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch authentication status' },
      { status: 500 }
    );
  }
}
