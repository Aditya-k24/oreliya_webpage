'use client';

import { motion } from 'framer-motion';

interface CraftsmanshipSectionProps {
  linkComponent?: React.ComponentType<any>;
}

export function CraftsmanshipSection({
  linkComponent: Link,
}: CraftsmanshipSectionProps) {
  const LinkComponent = Link || 'a';

  return (
    <section className='relative overflow-hidden' style={{ minHeight: '80vh' }}>
      {/* Video */}
      <div className='absolute inset-0'>
        <video
          src='/assets/videos/our-craft.mp4'
          autoPlay
          muted
          loop
          playsInline
          preload='metadata'
          className='w-full h-full object-cover'
        />
        {/* Right-side gradient so text on left stays readable */}
        <div className='absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10' />
        <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent' />
      </div>

      {/* Content — bottom-left aligned for consistency with hero */}
      <div className='relative flex items-end min-h-[80vh] w-full'>
        <div className='max-w-7xl mx-auto px-6 lg:px-8 pb-20 md:pb-28 w-full'>
          <div className='max-w-lg'>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className='text-white/40 text-xs uppercase tracking-[0.3em] mb-6'
            >
              Bespoke Craft
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.9,
                delay: 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 400,
                letterSpacing: '-0.02em',
              }}
              className='text-4xl md:text-6xl text-white leading-[1.0] mb-8'
            >
              Your story,
              <br />
              <span className='italic'>our craft.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className='text-white/55 text-sm font-light leading-relaxed mb-10 max-w-xs'
            >
              Every piece begins with a conversation. We work with you from
              concept to creation — entirely bespoke, entirely yours.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className='flex flex-col sm:flex-row gap-4'
            >
              <LinkComponent
                href='/customization'
                className='btn-primary text-xs'
              >
                Create Your Jewellery
              </LinkComponent>
              <LinkComponent
                href='/contact'
                className='btn-white-outline text-xs'
              >
                Get in Touch
              </LinkComponent>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
