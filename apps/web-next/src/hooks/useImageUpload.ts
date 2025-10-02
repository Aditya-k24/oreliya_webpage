import { useState } from 'react'

interface UploadOptions {
  folder?: 'products' | 'customize' | string
  onProgress?: (progress: number) => void
}

interface UploadResult {
  success: boolean
  url?: string
  filename?: string
  size?: number
  type?: string
  message?: string
}

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const uploadImage = async (
    file: File,
    options: UploadOptions = {}
  ): Promise<UploadResult> => {
    setIsUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('folder', options.folder || 'products')

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90))
      }, 100)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.message || 'Upload failed')
      }

      return result

    } catch (error) {
      console.error('Upload error:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Upload failed'
      }
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const uploadCustomizationImage = async (file: File): Promise<UploadResult> => {
    return uploadImage(file, { folder: 'customize' })
  }

  const uploadProductImage = async (file: File, subfolder?: string): Promise<UploadResult> => {
    return uploadImage(file, { folder: subfolder ? `products/${subfolder}` : 'products' })
  }

  return {
    uploadImage,
    uploadCustomizationImage,
    uploadProductImage,
    isUploading,
    uploadProgress
  }
}
