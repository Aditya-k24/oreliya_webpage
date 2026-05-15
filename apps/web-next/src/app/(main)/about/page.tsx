import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className='bg-[#F6EEDF]'>
      {/* Hero */}
      <div className='max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-24'>
        <p className='text-[#1E240A]/40 text-[9px] uppercase tracking-[0.4em] mb-6'>
          Our Story
        </p>
        <h1
          className='text-5xl md:text-7xl text-[#1E240A] leading-[0.95] mb-10 max-w-3xl'
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 400,
            letterSpacing: '-0.02em',
          }}
        >
          A Heritage of
          <br />
          <span className='italic'>Craftsmanship.</span>
        </h1>
        <p className='text-[#1E240A]/55 text-sm font-light leading-relaxed max-w-md mb-10'>
          A legacy built on the belief that jewellery should never be
          one-size-fits-all. Every individual is unique — and their jewellery
          should reflect that.
        </p>
        <Link href='/customization'>
          <button type='button' className='btn-primary text-xs'>
            Start Custom Design
          </button>
        </Link>
      </div>

      {/* Divider */}
      <div className='w-full h-px bg-[#1E240A]/10' />

      {/* Story */}
      <div className='max-w-7xl mx-auto px-6 lg:px-8 py-24'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start'>
          {/* Text */}
          <div>
            <p className='text-[#1E240A]/40 text-[9px] uppercase tracking-[0.4em] mb-8'>
              The Beginning
            </p>
            <h2
              className='text-3xl md:text-4xl text-[#1E240A] leading-[1.1] mb-10'
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 400,
                letterSpacing: '-0.01em',
              }}
            >
              Our Story
            </h2>
            <div className='space-y-6 text-[#1E240A]/60 text-sm font-light leading-relaxed'>
              <p>
                My love for jewellery has always been more than just an
                accessory — it&apos;s an expression of who I am. But every time
                I stepped into a store, I faced the same struggle: I could never
                find the piece that truly spoke to me. Even after spending
                thousands, I often walked away settling for something that
                didn&apos;t feel mine.
              </p>
              <p>
                That&apos;s when it struck me — jewellery should never be
                one-size-fits-all. Every individual is unique, and their
                jewellery should reflect that uniqueness.
              </p>
              <p>
                With this belief, I set out to create something different — a
                brand where design meets individuality. A space where you
                don&apos;t just buy jewellery; you define it. Where each piece
                is thoughtfully crafted to capture your personality, your
                essence, your story — all while ensuring exceptional quality and
                fair pricing.
              </p>
            </div>
            <p
              className='mt-10 text-[#1E240A] text-base italic'
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 400,
              }}
            >
              &ldquo;This is more than jewellery. It&apos;s art. It&apos;s
              expression. It&apos;s you.&rdquo;
            </p>
            <p className='mt-4 text-[#1E240A]/50 text-xs uppercase tracking-[0.25em]'>
              Designed by us, defined by you.
            </p>
          </div>

          {/* Image */}
          <div className='relative aspect-[4/5] overflow-hidden'>
            <Image
              src='/uploads/carftsmen.jpeg'
              alt='Artisan crafting jewellery'
              fill
              className='object-cover'
              sizes='(max-width: 1024px) 100vw, 50vw'
            />
          </div>
        </div>
      </div>

      {/* Values */}
      <div className='bg-[#1E240A]'>
        <div className='max-w-7xl mx-auto px-6 lg:px-8 py-24'>
          <p className='text-[#F6EEDF]/30 text-[9px] uppercase tracking-[0.4em] mb-10'>
            What We Stand For
          </p>
          <h2
            className='text-4xl md:text-5xl text-[#F6EEDF] leading-[1.0] mb-16 max-w-lg'
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 400,
              letterSpacing: '-0.02em',
            }}
          >
            Our Values
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-px bg-[#F6EEDF]/10'>
            {[
              {
                n: '01',
                title: 'Excellence',
                body: 'We pursue perfection in every detail, from material selection to final finishing, ensuring each piece meets our exacting standards.',
              },
              {
                n: '02',
                title: 'Innovation',
                body: 'Embracing new techniques while honouring traditional methods, we push boundaries to create unique and beautiful designs.',
              },
              {
                n: '03',
                title: 'Integrity',
                body: 'Every piece we create is a reflection of our values — built with honesty, transparency, and genuine care.',
              },
            ].map(v => (
              <div key={v.n} className='bg-[#1E240A] p-8 lg:p-10'>
                <p className='text-[#F6EEDF]/20 text-[9px] uppercase tracking-widest mb-6'>
                  {v.n}
                </p>
                <h3
                  className='text-xl text-[#F6EEDF] mb-4'
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 400,
                  }}
                >
                  {v.title}
                </h3>
                <p className='text-[#F6EEDF]/45 text-xs font-light leading-relaxed'>
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className='max-w-7xl mx-auto px-6 lg:px-8 py-24'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-end'>
          <div>
            <p className='text-[#1E240A]/40 text-[9px] uppercase tracking-[0.4em] mb-6'>
              Begin
            </p>
            <h2
              className='text-4xl md:text-5xl text-[#1E240A] leading-[1.0]'
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 400,
                letterSpacing: '-0.02em',
              }}
            >
              Ready to begin
              <br />
              <span className='italic'>your journey?</span>
            </h2>
          </div>
          <div className='flex flex-col sm:flex-row gap-4'>
            <Link href='/customization'>
              <button type='button' className='btn-primary text-xs'>
                Start Custom Design
              </button>
            </Link>
            <Link href='/contact'>
              <button type='button' className='btn-outline text-xs'>
                Contact Us
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
