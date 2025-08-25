export function CraftsmanshipSection() {
  return (
    <section className='relative overflow-hidden'>
      <div className='absolute inset-0'>
        <img
          src='https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop'
          alt='Craftsmanship'
          className='w-full h-full object-cover'
        />
        <div className='absolute inset-0 bg-black/40' />
      </div>
      <div className='relative max-w-7xl mx-auto px-6 lg:px-8 py-24'>
        <div className='max-w-xl'>
          <h3 className='text-3xl md:text-5xl font-bold text-white mb-4'>
            Your story, our craft.
          </h3>
          <p className='text-white/90 text-lg mb-8'>
            Explore custom designs made just for you by master artisans.
          </p>
          <div className='flex gap-4'>
            <a
              href='/contact'
              className='px-6 py-3 rounded-lg bg-white text-gray-900 font-semibold hover:bg-gray-100'
            >
              Book a consultation
            </a>
            <a
              href='/products'
              className='px-6 py-3 rounded-lg border-2 border-white text-white font-semibold hover:bg-white hover:text-gray-900'
            >
              View collections
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
