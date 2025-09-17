import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { content, images } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required for Moj posts' },
        { status: 400 }
      );
    }

    // Simulate Moj API posting
    // In a real implementation, you would use Moj API
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Moj has a 2000 character limit for captions
    if (content.length > 2000) {
      return NextResponse.json(
        { error: 'Moj captions cannot exceed 2000 characters' },
        { status: 400 }
      );
    }

    // Moj allows up to 9 images per post
    if (images && images.length > 9) {
      return NextResponse.json(
        { error: 'Moj allows maximum 9 images per post' },
        { status: 400 }
      );
    }

    // Simulate successful posting
    const postId = `moj_${Date.now()}`;

    return NextResponse.json({
      success: true,
      platform: 'moj',
      postId,
      url: `https://mojapp.in/post/${postId}`,
      characterCount: content.length,
      imageCount: images?.length || 0,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Moj API error:', error);
    return NextResponse.json(
      { error: 'Failed to post to Moj' },
      { status: 500 }
    );
  }
}
