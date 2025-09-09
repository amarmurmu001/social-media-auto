import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { title, description, video, privacy } = await request.json();

    if (!title || !description) {
      return NextResponse.json(
        { error: 'YouTube posts require a title and description' },
        { status: 400 }
      );
    }

    // Simulate YouTube API posting
    // In a real implementation, you would use YouTube Data API v3
    await new Promise(resolve => setTimeout(resolve, 2000));

    // YouTube titles can be up to 100 characters, descriptions up to 5000
    if (title.length > 100) {
      return NextResponse.json(
        { error: 'YouTube titles cannot exceed 100 characters' },
        { status: 400 }
      );
    }

    if (description.length > 5000) {
      return NextResponse.json(
        { error: 'YouTube descriptions cannot exceed 5,000 characters' },
        { status: 400 }
      );
    }

    // Simulate successful posting
    const videoId = `youtube_${Date.now()}`;

    return NextResponse.json({
      success: true,
      platform: 'youtube',
      videoId,
      url: `https://youtube.com/watch?v=${videoId}`,
      title,
      description: description.substring(0, 100) + '...',
      privacy: privacy || 'public',
      hasVideo: !!video,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('YouTube API error:', error);
    return NextResponse.json(
      { error: 'Failed to post to YouTube' },
      { status: 500 }
    );
  }
}
