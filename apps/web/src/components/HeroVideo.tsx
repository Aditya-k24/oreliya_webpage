export function HeroVideo() {
  return (
    <section className='relative w-full h-screen flex items-center justify-center overflow-hidden'>
      {/* Video background */}
      <div className='absolute inset-0'>
        <video
          src='/home.mp4'
          autoPlay
          muted
          loop
          playsInline
          className='w-full h-full object-cover'
        />
        <div className='absolute inset-0 bg-black/40' />
      </div>

      {/* Main content */}
      <div className='relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-6xl mx-auto'>
        {/* Subtle accent line */}
        <div className='w-24 h-px bg-white mb-8' />

        <div className='mb-12'>
          <h1 className='text-6xl md:text-7xl lg:text-8xl font-light text-white mb-6 tracking-tight leading-tight'>
            <span className='block font-light'>Timeless</span>
            <span className='block font-medium'>Elegance</span>
          </h1>

          <p className='text-xl md:text-2xl lg:text-3xl text-white/90 mb-12 max-w-4xl leading-relaxed font-light'>
            Discover our curated collection of exceptional jewelry pieces, where
            heritage meets contemporary craftsmanship.
          </p>
        </div>

        {/* Call to action button */}
        <div className='mb-16'>
          <a href='/customization'>
            <button
              type='button'
              className='bg-[#1E240A] text-white font-medium py-4 px-8 border border-[#1E240A] hover:bg-white hover:text-[#1E240A] transition-all duration-300 uppercase tracking-wider text-sm'
            >
              Custom Design
            </button>
          </a>
        </div>

        {/* Elegant feature indicators */}
        <div className='flex items-center gap-12 text-white/80 text-sm uppercase tracking-widest'>
          <div className='flex items-center gap-3'>
            <div className='w-1 h-1 bg-white rounded-full' />
            <span>Artisan Crafted</span>
          </div>
          <div className='flex items-center gap-3'>
            <div className='w-1 h-1 bg-white rounded-full' />
            <span>Heritage Quality</span>
          </div>
          <div className='flex items-center gap-3'>
            <div className='w-1 h-1 bg-white rounded-full' />
            <span>Timeless Design</span>
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className='absolute bottom-20 left-1/2 transform -translate-x-1/2 w-48 h-px bg-white' />
    </section>
  );
}
