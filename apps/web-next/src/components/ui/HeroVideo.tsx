interface HeroVideoProps {
  href?: string;
  linkComponent?: React.ComponentType<any>;
}

export function HeroVideo({
  href = '/customization',
  linkComponent: Link,
}: HeroVideoProps) {
  const LinkComponent = Link || 'a';

  return (
    <section className='relative w-full h-screen flex items-center justify-center overflow-hidden'>
      <div className='absolute inset-0'>
        <video
          src='/assets/videos/home.mp4'
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
          <LinkComponent href={href}>
            <button type='button' className='btn-primary'>
              Custom Design
            </button>
          </LinkComponent>
        </div>
      </div>
    </section>
  );
}
