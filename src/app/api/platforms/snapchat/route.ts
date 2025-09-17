import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { content, images } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required for Snapchat posts' },
        { status: 400 }
      );
    }

    // Simulate Snapchat API posting
    // In a real implementation, you would use Snapchat API
    await new Promise(resolve => setTimeout(resolve, 1100));

    // Snapchat has a 250 character limit for captions
    if (content.length > 250) {
      return NextResponse.json(
        { error: 'Snapchat captions cannot exceed 250 characters' },
        { status: 400 }
      );
    }

    // Snapchat requires at least 1 image or video per snap
    if (!images || images.length === 0) {
      return NextResponse.json(
        { error: 'Snapchat requires at least 1 image or video per snap' },
        { status: 400 }
      );
    }

    // Snapchat allows up to 1 media file per snap
    if (images && images.length > 1) {
      return NextResponse.json(
        { error: 'Snapchat allows only 1 media file per snap' },
        { status: 400 }
      );
    }

    // Simulate successful posting
    const snapId = `snapchat_${Date.now()}`;

    return NextResponse.json({
      success: true,
      platform: 'snapchat',
      snapId,
      url: `https://snapchat.com/snap/${snapId}`,
      characterCount: content.length,
      imageCount: images?.length || 0,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Snapchat API error:', error);
    return NextResponse.json(
      { error: 'Failed to post to Snapchat' },
      { status: 500 }
    );
  }
}
