import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { validateFileUpload, sanitizeInput } from '@/lib/validation';
import { createErrorResponse, AppError } from '@/lib/error-handler';
import { logger } from '@/lib/logger';

const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '10485760'); // 10MB
const ALLOWED_TYPES = (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/webp').split(',');

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('image') as unknown as File;

    if (!file) {
      throw new AppError('No file uploaded', 400);
    }

    // Validate file
    validateFileUpload(file, MAX_FILE_SIZE, ALLOWED_TYPES);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename with clean name
    const timestamp = Date.now();
    const originalName = sanitizeInput(file.name);
    const cleanName = originalName
      .replace(/\s+/g, '-')           // Replace spaces with hyphens
      .replace(/[^a-zA-Z0-9.-]/g, '') // Remove special characters except dots and hyphens
      .replace(/--+/g, '-')           // Replace multiple hyphens with single
      .toLowerCase();                 // Convert to lowercase
    
    const filename = `${timestamp}-${cleanName}`;
    const path = join(uploadsDir, filename);

    await writeFile(path, buffer);

    // Return the public URL
    const url = `/uploads/${filename}`;
    
    logger.info('File uploaded successfully', { 
      filename, 
      size: file.size, 
      type: file.type 
    });
    
    return NextResponse.json({ success: true, url });
  } catch (error) {
    logger.error('File upload failed', { error: error instanceof Error ? error.message : error });
    const errorResponse = createErrorResponse(error);
    return NextResponse.json(errorResponse, { 
      status: error instanceof AppError ? error.statusCode : 500 
    });
  }
}
