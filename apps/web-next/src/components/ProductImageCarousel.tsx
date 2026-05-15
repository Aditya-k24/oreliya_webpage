'use client';

import { useState } from 'react';
import { SignedImage } from './SignedImage';

interface ProductImageCarouselProps {
  images: string[];
  productName: string;
}

export default function ProductImageCarousel({
  images,
  productName,
}: ProductImageCarouselProps) {
  const validImages =
    images && images.length > 0 ? images : ['/placeholder-product.svg'];

  const [selected, setSelected] = useState(0);

  return (
    <div className='flex gap-3'>
      {/* Thumbnail strip — left side, vertical */}
      {validImages.length > 1 && (
        <div className='flex flex-col gap-2 flex-shrink-0'>
          {validImages.map((img, i) => (
            <button
              key={img}
              type='button'
              onClick={() => setSelected(i)}
              aria-label={`View image ${i + 1}`}
              className={`relative w-14 aspect-square overflow-hidden flex-shrink-0 transition-opacity duration-200 focus:outline-none ${
                i === selected
                  ? 'opacity-100 ring-1 ring-[#1E240A]/40'
                  : 'opacity-40 hover:opacity-70'
              }`}
            >
              <SignedImage
                filePath={img}
                alt={`${productName} ${i + 1}`}
                fill
                className='object-cover'
                sizes='56px'
              />
            </button>
          ))}
        </div>
      )}

      {/* Main image */}
      <div className='relative flex-1 aspect-[3/4] overflow-hidden bg-[#1E240A]/5'>
        <SignedImage
          filePath={validImages[selected]}
          alt={productName}
          fill
          className='object-cover transition-opacity duration-300'
          sizes='(max-width: 1024px) 100vw, 50vw'
          priority={selected === 0}
        />
      </div>
    </div>
  );
}
