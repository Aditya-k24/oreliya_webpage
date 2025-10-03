import Image from 'next/image'

interface ServerSignedImageProps {
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
  style?: React.CSSProperties
  onLoad?: () => void
  onError?: () => void
  signedUrl?: string // Pre-signed URL for server-side rendering
}

export function ServerSignedImage({
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
  style,
  onLoad,
  onError,
  signedUrl
}: ServerSignedImageProps) {
  // Use signedUrl if provided (for server-side rendering), otherwise fallback to filePath
  const imageSrc = signedUrl || filePath

  // If no signed URL is provided and it's a local path, use it directly
  const finalSrc = imageSrc.startsWith('http') ? imageSrc : 
                   imageSrc.startsWith('/') ? imageSrc : 
                   `/${imageSrc}`

  return (
    <Image
      src={finalSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      priority={priority}
      quality={quality}
      sizes={sizes}
      style={style}
      onLoad={onLoad}
      onError={onError}
    />
  )
}
