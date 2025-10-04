'use client';

import Image from 'next/image';
import { useState } from 'react';

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
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  return (
    <div className="space-y-6">
      {/* Main Image */}
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white shadow-2xl">
        <Image
          src={validImages[selectedImageIndex]}
          alt={`${productName} - Main Image`}
          fill
          className="object-cover transition-opacity duration-300"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority={selectedImageIndex === 0}
        />
        
        {/* Image Counter - Only show if more than 1 image */}
        {validImages.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
            {selectedImageIndex + 1} / {validImages.length}
          </div>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {validImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {validImages.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#1E240A] focus:ring-offset-2 ${
                index === selectedImageIndex
                  ? 'ring-4 ring-[#1E240A] shadow-lg scale-105'
                  : 'ring-2 ring-gray-200 shadow-md hover:ring-[#1E240A]/50'
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
              {index === selectedImageIndex && (
                <div className="absolute inset-0 bg-[#1E240A]/10" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Dot Indicators */}
      {validImages.length > 1 && validImages.length <= 5 && (
        <div className="flex justify-center space-x-2 lg:hidden">
          {validImages.map((_, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#1E240A] focus:ring-offset-2 ${
                index === selectedImageIndex
                  ? 'bg-[#1E240A] w-8'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

