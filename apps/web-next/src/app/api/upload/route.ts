import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { validateFileUpload, sanitizeInput } from '@/lib/validation';

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

    // For production (Vercel), convert to base64 data URL
    // For development, save to filesystem
    const isProduction = process.env.NODE_ENV === 'production';
    
    if (isProduction) {
      // Convert file to base64 for production
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString('base64');
      const dataUrl = `data:${file.type};base64,${base64}`;
      
      return NextResponse.json({
        success: true,
        url: dataUrl,
        filename: file.name,
        size: file.size,
        type: file.type
      });
    } else {
      // Development: save to filesystem
      const uploadsDir = join(process.cwd(), 'public', 'uploads');
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }

      const timestamp = Date.now();
      const sanitizedName = sanitizeInput(file.name.replace(/[^a-zA-Z0-9.-]/g, '_'));
      const filename = `${timestamp}-${sanitizedName}`;
      const filepath = join(uploadsDir, filename);

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filepath, buffer);

      const imageUrl = `/uploads/${filename}`;

      return NextResponse.json({
        success: true,
        url: imageUrl,
        filename: file.name,
        size: file.size,
        type: file.type
      });
    }

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, message: 'Upload failed' },
      { status: 500 }
    );
  }
}
