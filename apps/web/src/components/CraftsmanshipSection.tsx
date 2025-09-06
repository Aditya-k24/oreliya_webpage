export function CraftsmanshipSection() {
  return (
    <section className='relative overflow-hidden'>
      <div className='absolute inset-0'>
        <video
          src='/our-craft.mp4'
          autoPlay
          muted
          loop
          playsInline
          className='w-full h-full object-cover'
        />
        <div className='absolute inset-0 bg-black/40' />
      </div>
      <div className='relative max-w-7xl mx-auto px-6 lg:px-8 py-24'>
        <div className='max-w-xl'>
          <h3 className='text-3xl md:text-5xl font-bold text-white mb-4'>
            Your story, our craft.
          </h3>

          <div className='flex gap-4'>
            <a
              href='/contact'
              className='px-6 py-3 bg-[#1E240A] text-white font-medium hover:bg-[#2A3A1A] transition-colors uppercase tracking-wider text-sm rounded'
            >
              Get in touch
            </a>
            <a
              href='/customization'
              className='px-6 py-3 border-2 border-white text-white font-medium hover:bg-white hover:text-[#1E240A] transition-all uppercase tracking-wider text-sm rounded'
            >
              Create your jewellery
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
