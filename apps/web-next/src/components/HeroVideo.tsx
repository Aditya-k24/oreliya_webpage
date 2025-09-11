export function HeroVideo() {
  return (
    <section className='relative w-full h-screen flex items-center justify-center overflow-hidden'>
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
      <div className='relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-6xl mx-auto'>
        <div className='mb-12'>
          <h1 className='text-5xl md:text-7xl lg:text-8xl font-light text-white mb-6 tracking-tight leading-tight'>
            <span className='block font-light'>Timeless Jewellery</span>
          </h1>
          <p className='text-xl md:text-2xl lg:text-3xl text-white/90 mb-12 max-w-4xl leading-relaxed font-light'>
            Designed by us, Defined by you.
          </p>
        </div>
        <div className='mb-16'>
          <a href='/customization'>
            <button
              type='button'
              className='bg-[#1E240A] text-white font-medium py-4 px-8 border border-[#1E240A] hover:bg-white hover:text-[#1E240A] transition-all duration-300 uppercase tracking-wider text-sm rounded'
            >
              Custom Design
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}
