import { NextRequest, NextResponse } from 'next/server';
import { validateFileUpload } from '@/lib/validation';
import { uploadToSupabaseStorage } from '@/lib/storage';

const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '10485760', 10); // 10MB
const ALLOWED_TYPES = (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/webp').split(',');

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file
    try {
      validateFileUpload(file, MAX_FILE_SIZE, ALLOWED_TYPES);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: error instanceof Error ? error.message : 'Invalid file' },
        { status: 400 }
      );
    }

    // Upload to customize folder in production bucket
    const result = await uploadToSupabaseStorage(file, 'production', 'customize');

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message || 'Upload failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      url: result.url,
      filename: result.filename,
      size: result.size,
      type: result.type
    });

  } catch (error) {
    console.error('Customization upload error:', error);
    return NextResponse.json(
      { success: false, message: 'Upload failed' },
      { status: 500 }
    );
  }
}
