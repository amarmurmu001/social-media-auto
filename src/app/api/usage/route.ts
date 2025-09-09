import { NextRequest, NextResponse } from 'next/server';
import { rateLimiter } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
  try {
    // In a real app, get user ID from authentication
    // For demo purposes, use a fixed identifier
    const userId = 'demo_user';

    const usage = rateLimiter.getUsage(userId);

    return NextResponse.json({
      success: true,
      usage,
      limits: {
        free: true,
        upgradeMessage: "Upgrade to premium for unlimited posts!",
      },
    });

  } catch (error) {
    console.error('Usage API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch usage data' },
      { status: 500 }
    );
  }
}
