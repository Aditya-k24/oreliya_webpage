import Link from 'next/link';
import Image from 'next/image';
import {
  HeroVideo,
  CraftsmanshipSection,
  AnnouncementBar,
} from '@/components/ui';
import { getCategories } from '@/features/products/lib/server';
import type { Category } from '@/types/product';

interface CategoryCardProps {
  category: Category;
}

function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/products/${category.slug}`}>
      <div className='group cursor-pointer'>
        <div className='aspect-square bg-gradient-to-br from-[#1E240A] to-[#2A3A1A] rounded-2xl mb-4 overflow-hidden'>
          <Image
            src={category.image || '/placeholder-category.jpg'}
            alt={category.name}
            width={300}
            height={300}
            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
          />
        </div>
        <h3 className='text-lg font-medium text-[#1E240A] text-center group-hover:text-[#2A3A1A] transition-colors'>
          {category.name}
        </h3>
      </div>
    </Link>
  );
}

export default async function Page() {
  const categories = await getCategories();

  return (
    <>
      <AnnouncementBar />
      <div className='bg-[#1E240A]'>
        <HeroVideo linkComponent={Link} />

        {/* Explore Our Collections section */}
        <section className='max-w-7xl mx-auto px-6 lg:px-8 py-20 text-center'>
          <h2 className='text-3xl font-medium text-[#1E240A] mb-6'>
            Explore Our Collections
          </h2>
          <p className='text-gray-600 mb-12'>
            Discover the perfect piece for every occasion
          </p>

          <div className='grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 lg:gap-12'>
            {categories.map(category => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>

        <CraftsmanshipSection linkComponent={Link} />

        {/* Our Promise section */}
        <section className='bg-white py-20'>
          <div className='max-w-7xl mx-auto px-6 lg:px-8'>
            <div className='text-center mb-16'>
              <h2 className='text-4xl font-light text-[#1E240A] mb-4'>
                Our Promise
              </h2>
              <p className='text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed'>
                &quot;At Oreliya, we don&apos;t just sell jewellery - we deliver
                trust, authenticity, and lifelong value. Because for us, every
                piece you buy is more than adornment, it&apos;s a promise.&quot;
              </p>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-12'>
              <div className='text-center p-8 group'>
                <div className='w-16 h-16 bg-[#1E240A] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 overflow-hidden'>
                  <Image
                    src='/images/certification/bis-hallmark-logo.png'
                    alt='BIS Hallmark'
                    width={64}
                    height={64}
                    className='w-full h-full object-cover rounded-full'
                  />
                </div>
                <h3 className='text-xl font-medium text-[#1E240A] mb-4'>
                  BIS Hallmarked Jewellery
                </h3>
              </div>
              <div className='text-center p-8 group'>
                <div className='w-16 h-16 bg-[#1E240A] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 overflow-hidden'>
                  <Image
                    src='/images/certification/igi-certified-logo.png'
                    alt='IGI Certified'
                    width={64}
                    height={64}
                    className='w-full h-full object-cover rounded-full'
                  />
                </div>
                <h3 className='text-xl font-medium text-[#1E240A] mb-4'>
                  IGI Certified Diamonds
                </h3>
              </div>
              <div className='text-center p-8 group'>
                <div className='w-16 h-16 bg-[#1E240A] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 overflow-hidden'>
                  <Image
                    src='/images/certification/buyback-exchange-logo.png'
                    alt='Buyback & Exchange'
                    width={64}
                    height={64}
                    className='w-full h-full object-cover rounded-full'
                  />
                </div>
                <h3 className='text-xl font-medium text-[#1E240A] mb-4'>
                  Buyback & Exchange Policy
                </h3>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
