import { Link } from 'react-router-dom';
import { SectionHeading } from '../components/SectionHeading';

export function AboutPage() {
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header with Logo */}
        <div className='mb-16 text-center'>
          <div className='flex flex-col items-center justify-center mb-8'>
            <div className='w-16 h-16 lg:w-20 lg:h-20 mb-4'>
              <img
                src='/logo-mark.svg'
                alt='Oreliya logo mark'
                className='w-full h-full object-contain dark:hidden'
              />
              <img
                src='/logo-mark-white.svg'
                alt='Oreliya logo mark'
                className='w-full h-full object-contain hidden dark:block'
              />
            </div>
            <div className='h-12 lg:h-16 mb-4'>
              <img
                src='/logo.svg'
                alt='Oreliya'
                className='h-full w-auto object-contain dark:hidden'
              />
              <img
                src='/logo-white.svg'
                alt='Oreliya'
                className='h-full w-auto object-contain hidden dark:block'
              />
            </div>
          </div>

          <h1 className='text-5xl font-bold text-gray-900 dark:text-white mb-6'>
            About Oreliya
          </h1>
          <p className='text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto'>
            Crafting timeless elegance through modern technology and curated
            collections
          </p>
        </div>

        {/* Story Section */}
        <div className='mb-16'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
            <div>
              <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-6'>
                Our Story
              </h2>
              <p className='text-lg text-gray-600 dark:text-gray-300 mb-6'>
                Founded with a vision to bridge the gap between traditional
                luxury and contemporary innovation, Oreliya has been at the
                forefront of redefining the jewelry shopping experience.
              </p>
              <p className='text-lg text-gray-600 dark:text-gray-300 mb-6'>
                We believe that every piece tells a story, and every customer
                deserves an experience that matches the quality of our
                craftsmanship.
              </p>
              <Link
                to='/products'
                className='inline-flex items-center px-6 py-3 bg-[#BFA16A] text-white font-medium rounded-lg hover:bg-[#a88c4a] transition-colors'
              >
                Explore Our Collection
              </Link>
            </div>
            <div className='relative'>
              <div className='aspect-square bg-gradient-to-br from-[#BFA16A] to-[#a88c4a] rounded-2xl p-8 flex items-center justify-center'>
                <div className='text-white text-center'>
                  <div className='w-16 h-16 mx-auto mb-4'>
                    <img
                      src='/logo-mark-white.svg'
                      alt='Oreliya'
                      className='w-full h-full object-contain'
                    />
                  </div>
                  <h3 className='text-2xl font-bold mb-2'>Craftsmanship</h3>
                  <p className='text-[#BFA16A]'>Excellence in every detail</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className='mb-16'>
          <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center'>
            Our Values
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='text-center p-6 group'>
              <div className='w-16 h-16 bg-[#BFA16A] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300'>
                <div className='text-white text-2xl'>✨</div>
              </div>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-3'>
                Quality
              </h3>
              <p className='text-gray-600 dark:text-gray-300'>
                We source only the finest materials and work with master
                craftsmen to ensure every piece meets our exacting standards.
              </p>
            </div>
            <div className='text-center p-6 group'>
              <div className='w-16 h-16 bg-[#BFA16A] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300'>
                <div className='text-white text-2xl'>🌱</div>
              </div>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-3'>
                Sustainability
              </h3>
              <p className='text-gray-600 dark:text-gray-300'>
                Committed to ethical sourcing and environmentally responsible
                practices throughout our supply chain.
              </p>
            </div>
            <div className='text-center p-6 group'>
              <div className='w-16 h-16 bg-[#BFA16A] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300'>
                <div className='text-white text-2xl'>💝</div>
              </div>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-3'>
                Customer First
              </h3>
              <p className='text-gray-600 dark:text-gray-300'>
                Every decision we make is guided by our commitment to providing
                exceptional service and memorable experiences.
              </p>
            </div>
          </div>
        </div>

        {/* Our Promise Section with Logo Accent */}
        <div className='max-w-7xl mx-auto px-6 lg:px-8 py-20'>
          <div className='text-center mb-16'>
            <div className='flex flex-col items-center justify-center mb-6'>
              <div className='w-12 h-12 mb-4'>
                <img
                  src='/logo-mark.svg'
                  alt='Oreliya'
                  className='w-full h-full object-contain dark:hidden'
                />
                <img
                  src='/logo-mark-white.svg'
                  alt='Oreliya'
                  className='w-full h-full object-contain hidden dark:block'
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
              <div className='w-16 h-16 bg-[#BFA16A] rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300'>
                <span className='text-white text-2xl'>✨</span>
              </div>
              <h3 className='text-lg font-semibold mb-2 text-gray-900 dark:text-white'>
                Premium Quality
              </h3>
              <p className='text-gray-600 dark:text-gray-400'>
                Only the finest materials and craftsmanship
              </p>
            </div>
            <div className='text-center group'>
              <div className='w-16 h-16 bg-[#BFA16A] rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300'>
                <span className='text-white text-2xl'>💎</span>
              </div>
              <h3 className='text-lg font-semibold mb-2 text-gray-900 dark:text-white'>
                Timeless Design
              </h3>
              <p className='text-gray-600 dark:text-gray-400'>
                Classic pieces that never go out of style
              </p>
            </div>
            <div className='text-center group'>
              <div className='w-16 h-16 bg-[#BFA16A] rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300'>
                <span className='text-white text-2xl'>❤️</span>
              </div>
              <h3 className='text-lg font-semibold mb-2 text-gray-900 dark:text-white'>
                Made with Love
              </h3>
              <p className='text-gray-600 dark:text-gray-400'>
                Every piece crafted with care and attention
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className='mb-16'>
          <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center'>
            Meet Our Team
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {[
              {
                id: 1,
                name: 'Sarah Chen',
                role: 'Creative Director',
                emoji: '👩‍🎨',
              },
              {
                id: 2,
                name: 'Marcus Rodriguez',
                role: 'Head of Design',
                emoji: '👨‍💼',
              },
              {
                id: 3,
                name: 'Emma Thompson',
                role: 'Quality Assurance',
                emoji: '👩‍🔬',
              },
              {
                id: 4,
                name: 'David Kim',
                role: 'Customer Experience',
                emoji: '👨‍💻',
              },
            ].map(member => (
              <div
                key={member.id}
                className='text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm group hover:shadow-lg transition-shadow duration-300'
              >
                <div className='text-4xl mb-4 group-hover:scale-110 transition-transform duration-300'>
                  {member.emoji}
                </div>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                  {member.name}
                </h3>
                <p className='text-gray-600 dark:text-gray-300'>
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section with Logo */}
        <div className='text-center bg-gradient-to-r from-[#BFA16A] to-[#a88c4a] rounded-2xl p-12 text-white'>
          <div className='flex items-center justify-center mb-6'>
            <div className='w-12 h-12'>
              <img
                src='/logo-mark-white.svg'
                alt='Oreliya'
                className='w-full h-full object-contain'
              />
            </div>
            <h2 className='text-3xl font-bold'>Ready to Start Your Journey?</h2>
          </div>
          <p className='text-xl mb-8 opacity-90'>
            Discover the perfect piece that tells your unique story
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link
              to='/products'
              className='px-8 py-3 bg-white text-[#BFA16A] font-medium rounded-lg hover:bg-gray-100 transition-colors'
            >
              Shop Now
            </Link>
            <Link
              to='/contact'
              className='px-8 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-[#BFA16A] transition-colors'
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
