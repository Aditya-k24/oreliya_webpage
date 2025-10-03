import Image from 'next/image';

interface ProductImageCarouselProps {
  images: string[];
  productName: string;
}

// Helper function to get a valid image URL
const getImageUrl = (imageUrl: string) => {
  if (!imageUrl) return '/placeholder-product.svg';
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  return imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
};

export default function ProductImageCarousel({ images, productName }: ProductImageCarouselProps) {
  const validImages = images && images.length > 0 
    ? images.map(getImageUrl) 
    : ['/placeholder-product.svg'];

  return (
    <div className="space-y-6">
      {/* Main Image - Server-side rendered */}
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white shadow-2xl">
        <Image
          src={validImages[0]}
          alt={`${productName} - Main Image`}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
        
        {/* Image Counter - Only show if more than 1 image */}
        {validImages.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
            1 / {validImages.length}
          </div>
        )}
      </div>

      {/* Thumbnail Gallery - Server-side rendered */}
      {validImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {validImages.map((image, index) => (
            <div
              key={index}
              className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-300 ${
                index === 0
                  ? 'ring-4 ring-[#1E240A] shadow-lg scale-105'
                  : 'ring-2 ring-gray-200 shadow-md'
              }`}
            >
              <Image
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 25vw, 12.5vw"
              />
              {/* Active indicator overlay */}
              {index === 0 && (
                <div className="absolute inset-0 bg-[#1E240A]/10" />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Dot Indicators - Server-side rendered */}
      {validImages.length > 1 && validImages.length <= 5 && (
        <div className="flex justify-center space-x-2 lg:hidden">
          {validImages.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === 0
                  ? 'bg-[#1E240A] w-8'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

