'use client';

import { motion } from 'framer-motion';

interface CTAStripProps {
  linkComponent?: React.ComponentType<any>;
}

export function CTAStrip({ linkComponent: Link }: CTAStripProps) {
  const LinkComponent = Link || 'a';

  return (
    <section className='bg-[#1E240A] py-28 px-6 lg:px-8 relative overflow-hidden'>
      {/* Subtle radial texture */}
      <div className='absolute inset-0 pointer-events-none'>
        <div className='absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#F6EEDF]/[0.03]' />
        <div className='absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#F6EEDF]/[0.03]' />
      </div>

      <div className='relative max-w-7xl mx-auto'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-end'>
          {/* Left — headline */}
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className='text-[#F6EEDF]/40 text-xs uppercase tracking-[0.3em] mb-8'
            >
              Begin
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
              className='text-4xl md:text-6xl text-[#F6EEDF] leading-[1.0]'
            >
              Ready to wear
              <br />
              something made
              <br />
              <span className='italic'>for you?</span>
            </motion.h2>
          </div>

          {/* Right — body + CTAs */}
          <div className='flex flex-col gap-8'>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className='w-12 h-px bg-[#F6EEDF]/30'
            />
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className='text-[#F6EEDF]/55 text-sm font-light leading-relaxed max-w-sm'
            >
              Start with a conversation. Tell us what you have in mind — we
              handle everything from sketch to setting.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className='flex flex-col sm:flex-row gap-4'
            >
              <LinkComponent href='/customization'>
                <button type='button' className='btn-secondary text-xs'>
                  Begin Your Design
                </button>
              </LinkComponent>
              <LinkComponent href='/contact'>
                <button type='button' className='btn-white-outline text-xs'>
                  Book a Consultation
                </button>
              </LinkComponent>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
