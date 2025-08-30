export function GemstoneGuidance() {
  return (
    <section className='py-20 bg-[#213326] text-white'>
      <div className='max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center'>
        <div>
          <h3 className='text-sm tracking-widest text-[#1E240A] mb-3'>
            Gemstone Guidance
          </h3>
          <h2 className='text-3xl md:text-4xl font-bold mb-6 leading-tight'>
            Lab Grown Diamonds • Sapphires • Moissanite
          </h2>
          <p className='text-white/80 mb-8'>
            Discover the brilliance that matches your values. Our experts will
            help you choose the perfect stone for your story.
          </p>
          <a
            href='/products'
            className='inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-gray-900 font-semibold hover:bg-gray-100'
          >
            Explore stones
            <span aria-hidden>→</span>
          </a>
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <img
            src='https://images.unsplash.com/photo-1520975682031-d0f9c6a0e6a6?q=80&w=1200&auto=format&fit=crop'
            alt='Diamond close-up'
            className='w-full h-64 object-cover rounded-xl shadow-lg'
          />
          <img
            src='https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop'
            alt='Jewellery detail'
            className='w-full h-64 object-cover rounded-xl shadow-lg'
          />
          <img
            src='https://images.unsplash.com/photo-1520975682031-d0f9c6a0e6a6?q=80&w=1200&auto=format&fit=crop'
            alt='Gemstone'
            className='w-full h-64 object-cover rounded-xl shadow-lg'
          />
          <img
            src='https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop'
            alt='Craft'
            className='w-full h-64 object-cover rounded-xl shadow-lg'
          />
        </div>
      </div>
    </section>
  );
}
