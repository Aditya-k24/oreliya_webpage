export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { filePath, expiresIn = 3600 } = await request.json() // Default 1 hour

    if (!filePath) {
      return NextResponse.json(
        { success: false, message: 'File path is required' },
        { status: 400 }
      )
    }

    // Generate signed URL for private bucket access
    const { data, error } = await supabaseAdmin.storage
      .from('production')
      .createSignedUrl(filePath, expiresIn)

    if (error) {
      console.error('Signed URL generation error:', error)
      return NextResponse.json(
        { success: false, message: 'Failed to generate signed URL' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      signedUrl: data.signedUrl,
      expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString()
    })

  } catch (error) {
    console.error('Signed URL error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
