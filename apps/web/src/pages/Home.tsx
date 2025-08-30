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
        <div className='flex items-center justify-center mb-8'>
          <div className='w-20 h-20 lg:w-24 lg:h-24'>
            <img
              src='/logo-mark.svg'
              alt='Oreliya logo mark'
              className='w-full h-full object-contain'
            />
          </div>
          <div className='h-16 lg:h-20'>
            <img
              src='/logo.svg'
              alt='Oreliya'
              className='h-full w-auto object-contain'
            />
          </div>
        </div>

        <SectionHeading
          title='Welcome to Oreliya'
          subtitle='Crafting timeless jewelry with passion and precision'
        />
        <div className='text-center py-12'>
          <p className='text-lg text-black max-w-2xl mx-auto leading-relaxed'>
            Our collection is being carefully curated. Check back soon for our
            latest pieces.
          </p>
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
          <button className='bg-[#1E240A] text-white font-medium py-4 px-8 border border-[#1E240A] hover:bg-white hover:text-[#1E240A] transition-all duration-300 uppercase tracking-wider text-sm'>
            Start Custom Design
          </button>
        </a>
      </div>
    </div>
  );
}
