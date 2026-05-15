'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const promises = [
  {
    logo: '/images/certification/bis-hallmark-logo.png',
    alt: 'BIS Hallmark',
    num: '01',
    title: 'BIS Hallmarked',
    body: 'Every piece carries the Bureau of Indian Standards hallmark — your assurance of purity.',
  },
  {
    logo: '/images/certification/igi-certified-logo.png',
    alt: 'IGI Certified',
    num: '02',
    title: 'IGI Certified Diamonds',
    body: 'Each diamond is graded by the International Gemological Institute. No exceptions.',
  },
  {
    logo: '/images/certification/buyback-exchange-logo.png',
    alt: 'Buyback & Exchange',
    num: '03',
    title: 'Buyback & Exchange',
    body: 'Full buyback and exchange policy — because jewellery should hold its value as long as its memory.',
  },
];

export function PromiseSection() {
  return (
    <section className='bg-[#F6EEDF] py-24 px-6 lg:px-8'>
      <div className='max-w-7xl mx-auto'>
        {/* Section header */}
        <div className='flex flex-col md:flex-row md:items-end md:justify-between mb-20'>
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className='text-[#1E240A]/50 text-xs uppercase tracking-[0.25em] mb-4'
            >
              Our Promise
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                delay: 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                fontFamily: "'Playfair Display', serif",
                letterSpacing: '-0.02em',
              }}
              className='text-3xl md:text-4xl font-medium text-[#1E240A]'
            >
              Trust, built into
              <br />
              <span className='italic font-normal'>every piece.</span>
            </motion.h2>
          </div>
        </div>

        {/* Three rows — editorial numbered list style */}
        <div className='divide-y divide-[#1E240A]/10'>
          {promises.map((p, i) => (
            <motion.div
              key={p.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.7,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className='grid grid-cols-12 gap-6 py-10 group'
            >
              {/* Number */}
              <div className='col-span-2 md:col-span-1 flex items-start pt-1'>
                <span
                  className='text-[#1E240A]/20 text-2xl group-hover:text-[#1E240A]/40 transition-colors duration-500'
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {p.num}
                </span>
              </div>

              {/* Logo */}
              <div className='col-span-2 md:col-span-1 flex items-start pt-0.5'>
                <div className='w-10 h-10 rounded-full overflow-hidden ring-1 ring-[#1E240A]/10 group-hover:ring-[#1E240A]/30 transition-all duration-500 flex-shrink-0'>
                  <Image
                    src={p.logo}
                    alt={p.alt}
                    width={40}
                    height={40}
                    className='w-full h-full object-cover'
                  />
                </div>
              </div>

              {/* Title */}
              <div className='col-span-8 md:col-span-4 flex items-start'>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    letterSpacing: '-0.01em',
                  }}
                  className='text-xl md:text-2xl font-medium text-[#1E240A] leading-snug'
                >
                  {p.title}
                </h3>
              </div>

              {/* Body — right-aligned on desktop */}
              <div className='col-span-12 md:col-span-6 flex items-start md:justify-end'>
                <p className='text-[#1E240A]/55 text-sm font-light leading-relaxed max-w-xs'>
                  {p.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Closing quote */}
        <motion.blockquote
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className='mt-20 text-right'
        >
          <p
            style={{ fontFamily: "'Playfair Display', serif" }}
            className='text-lg md:text-xl font-light italic text-[#1E240A]/40 leading-relaxed max-w-lg ml-auto'
          >
            &ldquo;Every piece you buy is more than adornment — it&apos;s a
            promise.&rdquo;
          </p>
        </motion.blockquote>
      </div>
    </section>
  );
}
