import Link from 'next/link';
import Image from 'next/image';
import {
  HeroVideo,
  CraftsmanshipSection,
  AnnouncementBar,
} from '@/components/ui';

const categories = [
  {
    name: 'Rings',
    image: '/images/categories/engagement_rings.png',
    href: '/products?category=Rings',
  },
  {
    name: 'Necklace',
    image: '/images/categories/Mangalsutra.png',
    href: '/products?category=Necklace',
  },
  {
    name: 'Earrings',
    image: '/images/categories/Earrings.png',
    href: '/products?category=Earrings',
  },
  {
    name: 'Everyday Rings',
    image: '/images/categories/everyday.png',
    href: '/products?category=Rings&subcategory=Everyday Rings',
  },
];

export default function Page() {
  return (
    <>
      <AnnouncementBar />
      <div className='bg-[#F6EEDF]'>
        <HeroVideo linkComponent={Link} />

        {/* Categories section */}
        <section className='max-w-7xl mx-auto px-6 lg:px-8 py-20 text-center'>
          <h2 className='text-3xl font-medium text-[#1E240A] mb-6'>
            Explore Our Collections
          </h2>
          <p className='text-gray-600 mb-12'>
            Discover our exquisite collection of handcrafted jewelry pieces
          </p>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="group"
              >
                <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8">
            <Link 
              href="/products"
              className="inline-flex items-center px-8 py-3 bg-[#1E240A] text-white rounded-lg hover:bg-[#2A3A1A] transition-colors duration-200"
            >
              View All Products
            </Link>
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