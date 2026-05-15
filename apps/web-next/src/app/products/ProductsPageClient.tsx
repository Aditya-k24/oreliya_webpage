'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Product } from '@/types/product';
import { SignedImage } from '@/components/SignedImage';
import { SearchAndFilter } from '@/features/ui/components/SearchAndFilter';

interface ProductCardProps {
  product: Product;
  index: number;
}

function ProductCard({ product, index }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.04, 0.4),
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link href={`/products/${product.id}`} prefetch className='group block'>
        <div className='relative w-full aspect-[3/4] overflow-hidden bg-[#1E240A]/5'>
          {product.images[0] ? (
            <SignedImage
              filePath={product.images[0]}
              alt={product.name}
              fill
              className='object-cover transition-transform duration-700 group-hover:scale-105'
              sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
              priority={false}
            />
          ) : (
            <div className='w-full h-full flex items-center justify-center'>
              <span className='text-[#1E240A]/20 text-[10px] uppercase tracking-widest'>
                No image
              </span>
            </div>
          )}
        </div>

        <div className='pt-4'>
          <p className='text-[#1E240A]/40 text-[10px] uppercase tracking-[0.25em] mb-1.5'>
            {product.category}
          </p>
          <h3
            className='text-[#1E240A] text-base leading-snug group-hover:text-[#1E240A]/70 transition-colors duration-300'
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 400,
            }}
          >
            {product.name}
          </h3>
        </div>
      </Link>
    </motion.div>
  );
}

interface ProductsPageClientProps {
  initialProducts: Product[];
  initialCategory?: string;
}

const PAGE_SIZE = 12;

const categoryLabels: Record<string, string> = {
  rings: 'Rings',
  'special-offer-rings': 'Special Offers',
  necklaces: 'Necklaces',
  earrings: 'Earrings',
  bracelets: 'Bracelets',
  mangalsutra: 'Mangalsutra',
  other: 'Other',
};

export default function ProductsPageClient({
  initialProducts,
  initialCategory = '',
}: ProductsPageClientProps) {
  const [filteredProducts, setFilteredProducts] =
    useState<Product[]>(initialProducts);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filteredProducts]);

  const heading = initialCategory
    ? categoryLabels[initialCategory.toLowerCase()] || initialCategory
    : 'All Collections';

  const eyebrow = initialCategory ? 'Collections' : 'Our Jewellery';

  return (
    <div className='min-h-screen bg-[#F6EEDF]'>
      {/* Page Header */}
      <div className='max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-10'>
        <div className='flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6'>
          <div>
            {initialCategory && (
              <Link
                href='/products'
                className='text-[#1E240A]/40 text-[10px] uppercase tracking-[0.3em] hover:text-[#1E240A]/70 transition-colors mb-4 block'
              >
                ← All Collections
              </Link>
            )}
            <p className='text-[#1E240A]/40 text-[10px] uppercase tracking-[0.35em] mb-5'>
              {eyebrow}
            </p>
            <h1
              className='text-5xl md:text-6xl text-[#1E240A] leading-[1.0]'
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 400,
                letterSpacing: '-0.02em',
              }}
            >
              {heading}
            </h1>
          </div>

          <div className='flex items-center gap-6 pb-1'>
            <span className='text-[#1E240A]/40 text-[10px] uppercase tracking-[0.25em]'>
              {filteredProducts.length} piece
              {filteredProducts.length !== 1 ? 's' : ''}
            </span>
            <SearchAndFilter
              key={initialCategory || 'all-products'}
              products={initialProducts}
              onFilteredProducts={setFilteredProducts}
              initialCategory={initialCategory}
            />
          </div>
        </div>

        <div className='mt-10 h-px bg-[#1E240A]/10' />
      </div>

      {/* Grid */}
      <div className='max-w-7xl mx-auto px-6 lg:px-8 pb-28'>
        {filteredProducts.length === 0 ? (
          <div className='py-24 text-center'>
            <p className='text-[#1E240A]/50 text-sm mb-2'>
              No pieces match your selection.
            </p>
            <p className='text-[#1E240A]/30 text-xs mb-10'>
              Try adjusting your filters.
            </p>
            <Link href='/products'>
              <button type='button' className='btn-outline text-xs'>
                View All Pieces
              </button>
            </Link>
          </div>
        ) : (
          <>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10'>
              {filteredProducts.slice(0, visibleCount).map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>

            {visibleCount < filteredProducts.length && (
              <div className='text-center mt-16'>
                <button
                  type='button'
                  onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                  className='btn-outline text-xs'
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
