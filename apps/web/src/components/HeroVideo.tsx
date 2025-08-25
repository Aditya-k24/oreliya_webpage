import { Button } from '@oreliya/ui';

export function HeroVideo() {
  return (
    <section className='relative w-full h-[80vh] md:h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black'>
      {/* Fallback background gradient if video doesn't load */}
      <div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black opacity-90' />

      {/* Optional video background - you can add your video file */}
      {/* <video
      className="absolute inset-0 w-full h-full object-cover opacity-60"
      src="/videos/hero.mp4"
      autoPlay
      loop
      muted
      playsInline
      poster="/images/hero-poster.jpg"
    /> */}

      <div className='relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-6xl mx-auto'>
        <div className='mb-6'>
          <h1 className='text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 tracking-tight leading-tight'>
            <span className='block'>Discover</span>
            <span className='block text-[color:var(--oreliya-gold)]'>
              Luxury
            </span>
          </h1>
          <p className='text-xl md:text-2xl lg:text-3xl text-gray-200 mb-6 max-w-3xl leading-relaxed font-light'>
            Experience timeless elegance with our curated collection of premium
            products. Where sophistication meets innovation.
          </p>
        </div>

        <div className='flex flex-col sm:flex-row gap-6 items-center'>
          <a href='/products'>
            <Button size='large' variant='primary'>
              Explore Collection
            </Button>
          </a>
          <a href='/customization'>
            <Button size='large' variant='outline'>
              Custom Design
            </Button>
          </a>
        </div>

        <div className='mt-8 flex items-center gap-8 text-gray-300 text-sm'>
          <div className='flex items-center gap-2'>
            <div className='w-2 h-2 bg-[color:var(--oreliya-gold)] rounded-full' />
            <span>Premium Quality</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-2 h-2 bg-[color:var(--oreliya-gold)] rounded-full' />
            <span>Worldwide Shipping</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-2 h-2 bg-[color:var(--oreliya-gold)] rounded-full' />
            <span>24/7 Support</span>
          </div>
        </div>
      </div>

      {/* Enhanced gradient overlay */}
      <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-0' />
    </section>
  );
}
