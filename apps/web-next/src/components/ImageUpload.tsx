'use client'

import { useState, useRef } from 'react'
import { useImageUpload } from '@/hooks/useImageUpload'

interface ImageUploadProps {
  onUploadComplete: (result: { url: string; filename: string }) => void
  folder?: 'products' | 'customize' | string
  accept?: string
  maxSize?: number
  className?: string
  children?: React.ReactNode
}

export function ImageUpload({
  onUploadComplete,
  folder = 'products',
  accept = 'image/*',
  maxSize = 10 * 1024 * 1024, // 10MB
  className = '',
  children
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { uploadImage, isUploading, uploadProgress } = useImageUpload()

  const handleFile = async (file: File) => {
    setError(null)

    // Validate file size
    if (file.size > maxSize) {
      setError(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`)
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    const result = await uploadImage(file, { folder })

    if (result.success && result.url && result.filename) {
      onUploadComplete({
        url: result.url,
        filename: result.filename
      })
    } else {
      setError(result.message || 'Upload failed')
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const onButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
        disabled={isUploading}
      />
      
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
      >
        {isUploading ? (
          <div className="space-y-2">
            <div className="text-sm text-gray-600">Uploading...</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        ) : children ? (
          children
        ) : (
          <div className="space-y-2">
            <div className="text-gray-600">
              Drag and drop an image here, or click to select
            </div>
            <div className="text-sm text-gray-500">
              Max size: {Math.round(maxSize / 1024 / 1024)}MB
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  )
}
