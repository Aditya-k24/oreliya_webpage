export default function AboutPage() {
  return (
    <div className='bg-white'>
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
          <a
            href='/customization'
            className='inline-flex items-center px-8 py-4 bg-[#1E240A] text-white font-medium rounded-none border border-[#1E240A] hover:bg-white hover:text-[#1E240A] transition-all duration-300 uppercase tracking-wider text-sm'
          >
            Start Custom Design
          </a>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-6 lg:px-8 py-20'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
          <div>
            <h2 className='text-4xl font-light text-[#1E240A] mb-6 leading-tight'>
              Our Story
            </h2>
            <p className='text-lg text-gray-600 mb-6 leading-relaxed'>
              My love for jewelry has always been more than just an accessory —
              it&apos;s an expression of who I am. But every time I stepped into
              a store, I faced the same struggle: I could never find the piece
              that truly spoke to me. Even after spending thousands, I often
              walked away settling for something that didn&apos;t feel mine.
            </p>
            <p className='text-lg text-gray-600 mb-6 leading-relaxed'>
              That&apos;s when it struck me — jewelry should never be
              one-size-fits-all. Every individual is unique, and their jewelry
              should reflect that uniqueness.
            </p>
            <p className='text-lg text-gray-600 mb-6 leading-relaxed'>
              With this belief, I set out to create something different — a
              brand where design meets individuality. A space where you
              don&apos;t just buy jewelry; you define it. Where each piece is
              thoughtfully crafted to capture your personality, your essence,
              your story — all while ensuring exceptional quality and fair
              pricing.
            </p>
            <p className='text-lg text-gray-600 mb-4 leading-relaxed font-medium'>
              This is more than jewelry. It&apos;s art. It&apos;s expression.
              It&apos;s you.
            </p>
            <p className='text-lg text-[#1E240A] font-medium leading-relaxed'>
              Designed by us, defined by you.
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

      <div className='max-w-7xl mx-auto px-6 lg:px-8 py-20 text-center'>
        <h2 className='text-4xl font-light text-[#1E240A] mb-6'>
          Ready to Begin Your Journey?
        </h2>
        <p className='text-lg text-[#1E240A]/80 mb-8 leading-relaxed'>
          Start your custom design journey and create a piece that tells your
          unique story
        </p>
        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <a
            href='/customization'
            className='px-8 py-4 bg-white text-[#1E240A] font-medium rounded-none hover:bg-[#F6EEDF] transition-colors uppercase tracking-wider text-sm'
          >
            Start Custom Design
          </a>
          <a
            href='/contact'
            className='px-8 py-4 border-2 border-white text-white font-medium rounded-none hover:bg-white hover:text-[#1E240A] transition-all uppercase tracking-wider text-sm'
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
