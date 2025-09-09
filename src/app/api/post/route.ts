import { NextRequest, NextResponse } from 'next/server';
import { rateLimiter } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const { content, platforms } = await request.json();

    if (!content || !platforms || platforms.length === 0) {
      return NextResponse.json(
        { error: 'Content and platforms are required' },
        { status: 400 }
      );
    }

    // In a real app, get user ID from authentication
    const userId = 'demo_user';

    // Check rate limits
    const dailyLimit = rateLimiter.checkLimit(userId, 'day');
    if (!dailyLimit.allowed) {
      const resetDate = new Date(dailyLimit.resetTime * 1000);
      return NextResponse.json(
        {
          error: 'Daily limit exceeded',
          message: `You've reached your daily limit of 5 posts. Try again after ${resetDate.toLocaleString()}.`,
          resetTime: dailyLimit.resetTime,
          limit: 'daily'
        },
        { status: 429 }
      );
    }

    const hourlyLimit = rateLimiter.checkLimit(userId, 'hour');
    if (!hourlyLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Hourly limit exceeded',
          message: 'You can only post 2 times per hour. Please wait before trying again.',
          resetTime: hourlyLimit.resetTime,
          limit: 'hourly'
        },
        { status: 429 }
      );
    }

    const minuteLimit = rateLimiter.checkLimit(userId, 'minute');
    if (!minuteLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: 'You can only post once per minute. Please wait before trying again.',
          resetTime: minuteLimit.resetTime,
          limit: 'minute'
        },
        { status: 429 }
      );
    }

    // Record usage
    rateLimiter.recordUsage(userId, 'day');
    rateLimiter.recordUsage(userId, 'hour');
    rateLimiter.recordUsage(userId, 'minute');

    // Simulate posting to multiple platforms
    const results = [];

    for (const platform of platforms) {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Here you would integrate with actual social media APIs
        // For now, we'll simulate successful posting
        const result = {
          platform,
          status: 'success',
          postId: `${platform}_${Date.now()}`,
          timestamp: new Date().toISOString(),
        };

        results.push(result);
        console.log(`Posted to ${platform}: ${content.substring(0, 50)}...`);
      } catch (error) {
        results.push({
          platform,
          status: 'error',
          error: `Failed to post to ${platform}`,
        });
      }
    }

    const successCount = results.filter(r => r.status === 'success').length;
    const errorCount = results.filter(r => r.status === 'error').length;

    return NextResponse.json({
      success: true,
      message: `Posted to ${successCount} platform${successCount !== 1 ? 's' : ''}${errorCount > 0 ? `, ${errorCount} failed` : ''}`,
      results,
    });

  } catch (error) {
    console.error('Post API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
