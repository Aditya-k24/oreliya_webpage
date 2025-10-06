import { supabaseAdmin } from './supabase'

export interface UploadResult {
  success: boolean
  url?: string
  filename?: string
  size?: number
  type?: string
  message?: string
}

export async function uploadToSupabaseStorage(
  file: File,
  bucket: 'production',
  folder: 'products' | 'customize' | string
): Promise<UploadResult> {
  try {
    // Generate unique filename
    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filename = `${timestamp}-${sanitizedName}`
    
    // Create file path with folder structure
    const filePath = `${folder}/${filename}`
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: 'public, max-age=31536000, immutable',
        upsert: false
      })
    
    if (error) {
      console.error('Supabase upload error:', error)
      return {
        success: false,
        message: `Upload failed: ${error.message}`
      }
    }
    
    // Generate signed URL for immediate display
    const signedUrlResult = await getSignedUrl(bucket, filePath, 86400) // 24 hours
    
    if (!signedUrlResult.success) {
      console.error('Failed to generate signed URL:', signedUrlResult.message)
      return {
        success: false,
        message: 'Upload successful but failed to generate display URL'
      }
    }
    
    return {
      success: true,
      url: signedUrlResult.signedUrl!, // Return signed URL for immediate display
      filename: file.name,
      size: file.size,
      type: file.type
    }
    
  } catch (error) {
    console.error('Upload error:', error)
    return {
      success: false,
      message: 'Upload failed due to an unexpected error'
    }
  }
}

export async function deleteFromSupabaseStorage(
  bucket: 'production',
  filePath: string
): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin.storage
      .from(bucket)
      .remove([filePath])
    
    if (error) {
      console.error('Supabase delete error:', error)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Delete error:', error)
    return false
  }
}

export async function getSignedUrl(
  bucket: 'production',
  filePath: string,
  expiresIn: number = 3600 // Default 1 hour
): Promise<{ success: boolean; signedUrl?: string; expiresAt?: string; message?: string }> {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .createSignedUrl(filePath, expiresIn)
    
    if (error) {
      console.error('Supabase signed URL error:', error)
      return {
        success: false,
        message: `Failed to generate signed URL: ${error.message}`
      }
    }
    
    return {
      success: true,
      signedUrl: data.signedUrl,
      expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString()
    }
  } catch (error) {
    console.error('Signed URL error:', error)
    return {
      success: false,
      message: 'Failed to generate signed URL due to an unexpected error'
    }
  }
}

// Batch signed URL generation for multiple files
export async function getSignedUrls(
  bucket: 'production',
  filePaths: string[],
  expiresIn: number = 3600
): Promise<Map<string, string>> {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .createSignedUrls(filePaths, expiresIn)
    
    if (error || !data) {
      console.error('Supabase batch signed URLs error:', error)
      return new Map()
    }
    
    const urlMap = new Map<string, string>()
    data.forEach((item) => {
      if (item.signedUrl && item.path) {
        urlMap.set(item.path, item.signedUrl)
      }
    })
    
    return urlMap
  } catch (error) {
    console.error('Batch signed URLs error:', error)
    return new Map()
  }
}
