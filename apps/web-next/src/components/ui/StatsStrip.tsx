'use client';

import { motion } from 'framer-motion';

const stats = [
  { number: '500+', label: 'Custom Designs Crafted' },
  { number: 'BIS', label: 'Hallmarked Every Piece' },
  { number: 'IGI', label: 'Certified Lab Diamonds' },
  { number: '100%', label: 'Buyback Guarantee' },
];

export function StatsStrip() {
  return (
    <section className='bg-[#1E240A] py-16 px-6 lg:px-8'>
      <div className='max-w-7xl mx-auto'>
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#F6EEDF]/10'>
          {stats.map((stat, i) => (
            <motion.div
              key={stat.number}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className='bg-[#1E240A] py-10 px-8 text-center lg:text-left'
            >
              <p
                className='text-[#F6EEDF] text-4xl md:text-5xl mb-3'
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 400,
                  letterSpacing: '-0.02em',
                }}
              >
                {stat.number}
              </p>
              <p className='text-[#F6EEDF]/50 text-xs uppercase tracking-[0.18em] font-light'>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
