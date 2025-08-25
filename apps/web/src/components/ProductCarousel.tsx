import { useRef } from 'react';
import { ProductCard, Product } from './ProductCard';

interface ProductCarouselProps {
  title: string;
  products: Product[];
  subtitle?: string;
}

export function ProductCarousel({
  title,
  subtitle,
  products,
}: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dx: number) => {
    scrollRef.current?.scrollBy({ left: dx, behavior: 'smooth' });
  };

  return (
    <section className='py-14 bg-white dark:bg-gray-900'>
      <div className='max-w-7xl mx-auto px-6 lg:px-8'>
        <div className='flex items-end justify-between mb-6'>
          <div>
            <h2 className='text-2xl md:text-3xl font-bold text-gray-900 dark:text-white'>
              {title}
            </h2>
            {subtitle && (
              <p className='text-gray-600 dark:text-gray-300 mt-1'>
                {subtitle}
              </p>
            )}
          </div>
          <div className='hidden md:flex gap-2'>
            <button
              type='button'
              onClick={() => scrollBy(-400)}
              className='w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              aria-label='Scroll left'
            >
              ←
            </button>
            <button
              type='button'
              onClick={() => scrollBy(400)}
              className='w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              aria-label='Scroll right'
            >
              →
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className='flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4'
        >
          {products.map(product => (
            <div
              key={product.id}
              className='min-w-[260px] max-w-[280px] snap-start'
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
