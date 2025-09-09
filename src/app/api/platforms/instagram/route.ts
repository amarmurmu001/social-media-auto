import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { content, images, caption } = await request.json();

    // Instagram requires at least one image
    if (!images || images.length === 0) {
      return NextResponse.json(
        { error: 'Instagram posts require at least one image' },
        { status: 400 }
      );
    }

    // Instagram allows up to 10 images in a carousel post
    if (images.length > 10) {
      return NextResponse.json(
        { error: 'Instagram allows maximum 10 images per post' },
        { status: 400 }
      );
    }

    // Simulate Instagram API posting
    // In a real implementation, you would use Instagram Basic Display API or Graph API
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Instagram captions can be up to 2200 characters
    if (caption && caption.length > 2200) {
      return NextResponse.json(
        { error: 'Instagram captions cannot exceed 2,200 characters' },
        { status: 400 }
      );
    }

    // Simulate successful posting
    const postId = `instagram_${Date.now()}`;

    return NextResponse.json({
      success: true,
      platform: 'instagram',
      postId,
      url: `https://instagram.com/p/${postId}`,
      type: images.length > 1 ? 'carousel' : 'single_image',
      imageCount: images.length,
      captionLength: caption?.length || content?.length || 0,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Instagram API error:', error);
    return NextResponse.json(
      { error: 'Failed to post to Instagram' },
      { status: 500 }
    );
  }
}
