import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit for free tier)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 5MB for free tier.' },
        { status: 400 }
      );
    }

    // In a real implementation, you would:
    // 1. Upload to cloud storage (AWS S3, Cloudinary, etc.)
    // 2. Process/optimize the image
    // 3. Store metadata in database
    // 4. Return the public URL

    // For demo purposes, we'll simulate the upload
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate a fake URL for demo
    const imageId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const imageUrl = `https://example.com/uploads/${imageId}.${file.type.split('/')[1]}`;

    return NextResponse.json({
      success: true,
      imageId,
      url: imageUrl,
      filename: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
