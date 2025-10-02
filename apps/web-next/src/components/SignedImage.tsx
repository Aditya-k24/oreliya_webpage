'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useSignedUrl } from '@/hooks/useSignedUrl'

interface SignedImageProps {
  filePath: string
  alt: string
  width?: number
  height?: number
  className?: string
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  priority?: boolean
  quality?: number
  sizes?: string
  fill?: boolean
  style?: React.CSSProperties
  onLoad?: () => void
  onError?: () => void
}

export function SignedImage({
  filePath,
  alt,
  width,
  height,
  className,
  placeholder = 'empty',
  blurDataURL,
  priority = false,
  quality = 75,
  sizes,
  fill = false,
  style,
  onLoad,
  onError
}: SignedImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageError, setImageError] = useState(false)
  const { getSignedUrl, isLoading, error } = useSignedUrl()

  useEffect(() => {
    if (!filePath) return

    const fetchSignedUrl = async () => {
      const result = await getSignedUrl(filePath)
      if (result.success && result.signedUrl) {
        setImageUrl(result.signedUrl)
        setImageError(false)
      } else {
        setImageError(true)
        onError?.()
      }
    }

    fetchSignedUrl()
  }, [filePath, getSignedUrl, onError])

  // Show loading state
  if (isLoading || (!imageUrl && !imageError)) {
    return (
      <div 
        className={`bg-gray-200 animate-pulse ${className}`}
        style={{ width, height, ...style }}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      </div>
    )
  }

  // Show error state
  if (imageError || error) {
    return (
      <div 
        className={`bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center ${className}`}
        style={{ width, height, ...style }}
      >
        <div className="text-gray-500 text-sm text-center">
          <div>Failed to load image</div>
          {error && <div className="text-xs mt-1">{error}</div>}
        </div>
      </div>
    )
  }

  // Show image
  if (imageUrl) {
    return (
      <Image
        src={imageUrl}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        className={className}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        priority={priority}
        quality={quality}
        sizes={sizes}
        fill={fill}
        style={style}
        onLoad={onLoad}
        onError={() => {
          setImageError(true)
          onError?.()
        }}
      />
    )
  }

  return null
}
