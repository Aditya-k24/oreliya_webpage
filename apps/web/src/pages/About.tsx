import { Link } from 'react-router-dom';

export function About() {
  return (
    <div className='bg-white'>
      {/* Hero Section */}
      <div className='bg-[#F6EEDF] py-20'>
        <div className='max-w-7xl mx-auto px-6 lg:px-8 text-center'>
          <div className='mb-8'>
            <div className='w-16 h-16 bg-[#1E240A] rounded-full mx-auto mb-6 flex items-center justify-center'>
              <span className='text-white text-2xl'>✨</span>
            </div>
            <h1 className='text-5xl md:text-6xl font-light text-[#1E240A] mb-6 tracking-tight leading-tight'>
              Our Heritage
            </h1>
            <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
              A legacy of craftsmanship and innovation that spans generations,
              creating timeless pieces that tell your story.
            </p>
          </div>

          <Link
            to='/customization'
            className='inline-flex items-center px-8 py-4 bg-[#1E240A] text-white font-medium rounded-none border border-[#1E240A] hover:bg-white hover:text-[#1E240A] transition-all duration-300 uppercase tracking-wider text-sm'
          >
            Start Custom Design
          </Link>
        </div>
        </div>

      {/* Mission Section */}
      <div className='max-w-7xl mx-auto px-6 lg:px-8 py-20'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
            <div>
            <h2 className='text-4xl font-light text-[#1E240A] mb-6 leading-tight'>
              Our Mission
              </h2>
            <p className='text-lg text-gray-600 mb-8 leading-relaxed'>
              To create exceptional jewelry that transcends time, combining
              traditional craftsmanship with contemporary design. Every piece is
              a testament to our commitment to excellence and beauty.
            </p>
            <p className='text-lg text-gray-600 leading-relaxed'>
              We believe that jewelry should not only adorn but inspire,
              connecting generations through shared stories and timeless
              elegance.
            </p>
            </div>

            <div className='relative'>
            <div className='aspect-square bg-gradient-to-br from-[#1E240A] to-[#2A3A1A] rounded-2xl p-12 flex items-center justify-center'>
                <div className='text-white text-center'>
                <div className='w-16 h-16 mx-auto mb-6'>
                  <span className='text-4xl'>💎</span>
                </div>
                <h3 className='text-2xl font-medium mb-2'>Craftsmanship</h3>
                <p className='text-[#F6EEDF]'>Excellence in every detail</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
      <div className='bg-[#F6EEDF] py-20'>
        <div className='max-w-7xl mx-auto px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-light text-[#1E240A] mb-4'>
            Our Values
          </h2>
            <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
              The principles that guide our work and define our legacy
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-12'>
            <div className='text-center p-8 group'>
              <div className='w-16 h-16 bg-[#1E240A] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300'>
                <div className='text-white text-2xl'>✨</div>
              </div>
              <h3 className='text-xl font-medium text-[#1E240A] mb-4'>
                Excellence
              </h3>
              <p className='text-gray-600 leading-relaxed'>
                We pursue perfection in every detail, from material selection to
                final finishing, ensuring each piece meets our exacting
                standards.
              </p>
            </div>

            <div className='text-center p-8 group'>
              <div className='w-16 h-16 bg-[#1E240A] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300'>
                <div className='text-white text-2xl'>🌱</div>
              </div>
              <h3 className='text-xl font-medium text-[#1E240A] mb-4'>
                Innovation
              </h3>
              <p className='text-gray-600 leading-relaxed'>
                Embracing new techniques while honoring traditional methods, we
                push boundaries to create unique and beautiful designs.
              </p>
            </div>

            <div className='text-center p-8 group'>
              <div className='w-16 h-16 bg-[#1E240A] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300'>
                <div className='text-white text-2xl'>💝</div>
              </div>
              <h3 className='text-xl font-medium text-[#1E240A] mb-4'>
                Integrity
              </h3>
              <p className='text-gray-600 leading-relaxed'>
                Every piece we create is a reflection of our values, built with
                honesty, transparency, and genuine care.
              </p>
            </div>
            </div>
          </div>
        </div>

      {/* Team Section */}
        <div className='max-w-7xl mx-auto px-6 lg:px-8 py-20'>
          <div className='text-center mb-16'>
          <h2 className='text-4xl font-light text-[#1E240A] mb-4'>
            Meet Our Team
          </h2>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            The passionate artisans and designers behind every creation
          </p>
              </div>

        <div className='grid md:grid-cols-3 gap-12'>
          <div className='text-center group'>
            <div className='w-32 h-32 bg-[#1E240A] rounded-full mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300'>
              <span className='text-white text-4xl'>👨‍🎨</span>
            </div>
            <h3 className='text-xl font-medium text-[#1E240A] mb-2'>
              Master Craftsman
            </h3>
            <p className='text-gray-600 leading-relaxed'>
              With over 30 years of experience, our lead artisan brings
              traditional techniques to life in every piece.
            </p>
          </div>

            <div className='text-center group'>
            <div className='w-32 h-32 bg-[#1E240A] rounded-full mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300'>
              <span className='text-white text-4xl'>👩‍🎨</span>
            </div>
            <h3 className='text-xl font-medium text-[#1E240A] mb-2'>
              Creative Director
              </h3>
            <p className='text-gray-600 leading-relaxed'>
              Our visionary designer who transforms inspiration into
              breathtaking jewelry that captures the essence of beauty.
              </p>
            </div>

            <div className='text-center group'>
            <div className='w-32 h-32 bg-[#1E240A] rounded-full mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300'>
              <span className='text-white text-4xl'>👨‍💼</span>
            </div>
            <h3 className='text-xl font-medium text-[#1E240A] mb-2'>
              Quality Specialist
            </h3>
            <p className='text-gray-600 leading-relaxed'>
              Ensuring every piece meets our exacting standards before it
              reaches your hands.
            </p>
            </div>
          </div>
        </div>

      {/* CTA Section */}
      <div className='bg-gradient-to-r from-[#1E240A] to-[#2A3A1A] py-20 text-center'>
        <div className='max-w-4xl mx-auto px-6 lg:px-8'>
          <h2 className='text-4xl font-light text-white mb-6'>
            Ready to Begin Your Journey?
          </h2>
          <p className='text-lg text-[#F6EEDF] mb-8 leading-relaxed'>
            Start your custom design journey and create a piece that tells your
            unique story
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link
              to='/customization'
              className='px-8 py-4 bg-white text-[#1E240A] font-medium rounded-none hover:bg-[#F6EEDF] transition-colors uppercase tracking-wider text-sm'
            >
              Start Custom Design
            </Link>
            <Link
              to='/contact'
              className='px-8 py-4 border-2 border-white text-white font-medium rounded-none hover:bg-white hover:text-[#1E240A] transition-all uppercase tracking-wider text-sm'
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
