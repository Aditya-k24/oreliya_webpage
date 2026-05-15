'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';

interface HeroVideoProps {
  href?: string;
  linkComponent?: React.ComponentType<any>;
}

export function HeroVideo({
  href = '/customization',
  linkComponent: Link,
}: HeroVideoProps) {
  const LinkComponent = Link || 'a';
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <section className='relative w-full min-h-screen flex items-end overflow-hidden -mt-[65px]'>
      {/* Video */}
      <div className='absolute inset-0'>
        <video
          ref={videoRef}
          src='/assets/videos/home.mp4'
          autoPlay
          muted
          loop
          playsInline
          preload='metadata'
          className='w-full h-full object-cover'
        />
        {/* Gradient: dark at bottom for text, subtle at top for nav */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/30' />
      </div>

      {/* Bottom-left editorial text — luxury brand positioning */}
      <div className='relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 pb-20 md:pb-28'>
        <div className='max-w-2xl'>
          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className='text-white/50 text-xs uppercase tracking-[0.35em] mb-6 font-light'
          >
            Fine Jewellery
          </motion.p>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className='text-5xl md:text-7xl lg:text-8xl text-white leading-[0.95] mb-8'
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 400,
              letterSpacing: '-0.02em',
            }}
          >
            Timeless
            <br />
            <span className='italic'>Jewellery.</span>
          </motion.h1>

          {/* Sub-line */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className='text-white/60 text-sm font-light mb-10 max-w-sm leading-relaxed tracking-wide'
          >
            Handcrafted jewellery in BIS-hallmarked silver and IGI-certified
            lab-grown diamonds. Designed by us, defined by you.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className='flex flex-row gap-4 items-center'
          >
            <LinkComponent href={href}>
              <button type='button' className='btn-primary text-xs'>
                Customise
              </button>
            </LinkComponent>
            <LinkComponent href='/products'>
              <button type='button' className='btn-white-outline text-xs'>
                Shop Now
              </button>
            </LinkComponent>
          </motion.div>
        </div>
      </div>

      {/* Scroll cue — right-bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className='absolute bottom-10 right-8 flex flex-col items-center gap-3'
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className='w-px h-14 bg-gradient-to-b from-white/60 to-transparent'
        />
        <span
          className='text-white/40 text-[9px] uppercase tracking-[0.3em]'
          style={{ writingMode: 'vertical-rl' }}
        >
          Scroll
        </span>
      </motion.div>
    </section>
  );
}
