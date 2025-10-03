import { ServerSignedImage } from '@/components/ServerSignedImage'

interface ProductImageProps {
  filePath: string
  alt: string
  className?: string
  signedUrl?: string
}

export function ProductImage({ filePath, alt, className, signedUrl }: ProductImageProps) {
  return (
    <ServerSignedImage
      filePath={filePath}
      alt={alt}
      width={300}
      height={300}
      className={`object-cover rounded-lg ${className}`}
      placeholder="blur"
      quality={85}
      signedUrl={signedUrl}
    />
  )
}

// Example usage in a product card
export function ProductCard({ product }: { product: { id: string; name: string; images: string[] } }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {product.images.length > 0 && (
        <ProductImage
          filePath={product.images[0]}
          alt={product.name}
          className="w-full h-48"
        />
      )}
      <div className="p-4">
        <h3 className="font-semibold text-lg">{product.name}</h3>
      </div>
    </div>
  )
}
