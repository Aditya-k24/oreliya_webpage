import { HeroVideo } from '@/components/HeroVideo';
import { CraftsmanshipSection } from '@/components/CraftsmanshipSection';
import { AnnouncementBar } from '@/components/AnnouncementBar';

export default function Page() {
  return (
    <div className='bg-white'>
      <AnnouncementBar />
      <HeroVideo />
      {/* Explore Our Collections section */}
      <div className='max-w-7xl mx-auto px-6 lg:px-8 py-20 text-center'>
        <h2 className='text-3xl font-medium text-[#1E240A] mb-6'>
          Explore Our Collections
        </h2>
        <p className='text-gray-600'>
          Discover the perfect piece for every occasion
        </p>
        <div className='py-12'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 lg:gap-12 max-w-7xl mx-auto px-4'>
            <a
              href='/products?category=engagement-rings'
              className='group relative overflow-hidden rounded-lg shadow-sm hover:shadow-xl transition-all duration-700 transform hover:-translate-y-2 border border-gray-100 hover:border-gray-200'
            >
              <div className='aspect-[3/4] relative bg-white'>
                <img
                  src='/images/categories/engagement_rings.png'
                  alt='Engagement Rings Collection'
                  className='w-full h-full object-cover group-hover:scale-103 transition-transform duration-1200 ease-out'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700' />
                <div className='absolute inset-0 ring-1 ring-inset ring-black/5 group-hover:ring-black/10 transition-all duration-700' />
              </div>
            </a>
            <a
              href='/products?category=mangalsutra'
              className='group relative overflow-hidden rounded-lg shadow-sm hover:shadow-xl transition-all duration-700 transform hover:-translate-y-2 border border-gray-100 hover:border-gray-200'
            >
              <div className='aspect-[3/4] relative bg-white'>
                <img
                  src='/images/categories/Mangalsutra.png'
                  alt='Mangalsutra Collection'
                  className='w-full h-full object-cover group-hover:scale-103 transition-transform duration-1200 ease-out'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700' />
                <div className='absolute inset-0 ring-1 ring-inset ring-black/5 group-hover:ring-black/10 transition-all duration-700' />
              </div>
            </a>
            <a
              href='/products?category=earrings'
              className='group relative overflow-hidden rounded-lg shadow-sm hover:shadow-xl transition-all duration-700 transform hover:-translate-y-2 border border-gray-100 hover:border-gray-200'
            >
              <div className='aspect-[3/4] relative bg-white'>
                <img
                  src='/images/categories/Earrings.png'
                  alt='Earrings Collection'
                  className='w-full h-full object-cover group-hover:scale-103 transition-transform duration-1200 ease-out'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700' />
                <div className='absolute inset-0 ring-1 ring-inset ring-black/5 group-hover:ring-black/10 transition-all duration-700' />
              </div>
            </a>
            <a
              href='/products?category=everyday'
              className='group relative overflow-hidden rounded-lg shadow-sm hover:shadow-xl transition-all duration-700 transform hover:-translate-y-2 border border-gray-100 hover:border-gray-200'
            >
              <div className='aspect-[3/4] relative bg-white'>
                <img
                  src='/images/categories/everyday.png'
                  alt='Everyday Collection'
                  className='w-full h-full object-cover group-hover:scale-103 transition-transform duration-1200 ease-out'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700' />
                <div className='absolute inset-0 ring-1 ring-inset ring-black/5 group-hover:ring-black/10 transition-all duration-700' />
              </div>
            </a>
          </div>
        </div>
      </div>
      <CraftsmanshipSection />
      {/* Coming soon section */}
      <div className='max-w-7xl mx-auto px-6 lg:px-8 py-20 text-center'>
        <div className='flex flex-col items-center justify-center mb-8'>
          <div className='w-10 h-10 mb-4'>
            <img
              src='/logo-mark.svg'
              alt='Oreliya'
              className='w-full h-full object-contain'
            />
          </div>
          <h2 className='text-3xl font-medium text-[#1E240A] mb-4'>
            Coming Soon
          </h2>
        </div>
        <p className='text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8'>
          We&apos;re working hard to bring you our beautiful collection. In the
          meantime, explore our custom design services to create your perfect
          piece.
        </p>
        <a href='/customization'>
          <button
            type='button'
            className='bg-[#1E240A] text-white font-medium py-4 px-8 border border-[#1E240A] hover:bg-white hover:text-[#1E240A] transition-all duration-300 uppercase tracking-wider text-sm rounded'
          >
            Start Custom Design
          </button>
        </a>
      </div>
    </div>
  );
}
