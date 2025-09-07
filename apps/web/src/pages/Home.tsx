import { AnnouncementBar } from '../components/AnnouncementBar';
import { HeroVideo } from '../components/HeroVideo';
import { CraftsmanshipSection } from '../components/CraftsmanshipSection';
import { ServicesStrip } from '../components/ServicesStrip';
import { SectionHeading } from '../components/SectionHeading';

export function Home() {
  return (
    <div className='bg-white'>
      <AnnouncementBar />

      <HeroVideo />

      {/* Hero Logo Section */}
      <div className='max-w-7xl mx-auto px-6 lg:px-8 py-20 text-center'>
        <SectionHeading
          title='Explore Our Collections'
          subtitle='Discover the perfect piece for every occasion'
        />

        {/* Category Cards */}
        <div className='py-12'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 lg:gap-12 max-w-7xl mx-auto px-4'>
            {/* Engagement Rings Category */}
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

            {/* Mangalsutra Category */}
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

            {/* Earrings Category */}
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

            {/* Everyday Category */}
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

      {/* Our Promise Section with Logo Accent */}
      <div className='max-w-7xl mx-auto px-6 lg:px-8 py-20'>
        <div className='text-center mb-16'>
          <div className='flex flex-col items-center justify-center mb-6'>
            <div className='w-12 h-12 mb-4'>
              <img
                src='/logo-mark.svg'
                alt='Oreliya'
                className='w-full h-full object-contain'
              />
            </div>
            <SectionHeading
              title='Our Promise'
              subtitle='Quality craftsmanship meets timeless design'
            />
          </div>
        </div>

        <div className='grid md:grid-cols-3 gap-8 mt-8'>
          <div className='text-center group'>
            <div className='w-16 h-16 bg-[#1E240A] rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300'>
              <span className='text-white text-2xl'>✨</span>
            </div>
            <h3 className='text-lg font-medium mb-2 text-[#1E240A]'>
              Premium Quality
            </h3>
            <p className='text-black leading-relaxed'>
              Only the finest materials and craftsmanship
            </p>
          </div>
          <div className='text-center group'>
            <div className='w-16 h-16 bg-[#1E240A] rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300'>
              <span className='text-white text-2xl'>💎</span>
            </div>
            <h3 className='text-lg font-medium mb-2 text-[#1E240A]'>
              Timeless Design
            </h3>
            <p className='text-black leading-relaxed'>
              Classic pieces that never go out of style
            </p>
          </div>
          <div className='text-center group'>
            <div className='w-16 h-16 bg-[#1E240A] rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300'>
              <span className='text-white text-2xl'>❤️</span>
            </div>
            <h3 className='text-lg font-medium mb-2 text-[#1E240A]'>
              Made with Love
            </h3>
            <p className='text-black leading-relaxed'>
              Every piece crafted with care and attention
            </p>
          </div>
        </div>
      </div>

      <ServicesStrip />

      {/* Coming Soon Section with Logo */}
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

        {/* Elegant CTA Button */}
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
