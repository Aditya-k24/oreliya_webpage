'use client';

import { motion } from 'framer-motion';

const items = [
  'BIS Hallmarked Jewellery',
  'IGI Certified Diamonds',
  'Lab Grown Diamonds',
  'Custom Design',
  'Buyback & Exchange Policy',
  'Handcrafted in India',
];

export function MarqueeBand() {
  const repeated = [...items, ...items, ...items].map((item, i) => ({
    item,
    key: `${item}-${i}`,
  }));

  return (
    <div className='bg-[#1E240A] py-4 overflow-hidden'>
      <motion.div
        animate={{ x: ['0%', '-33.33%'] }}
        transition={{ repeat: Infinity, duration: 28, ease: 'linear' }}
        className='flex whitespace-nowrap'
      >
        {repeated.map(({ item, key }) => (
          <span
            key={key}
            className='text-[#F6EEDF] text-xs font-medium uppercase tracking-[0.2em] px-8 flex items-center gap-8'
          >
            {item}
            <span className='w-1 h-1 rounded-full bg-[#F6EEDF]/40 inline-block' />
          </span>
        ))}
      </motion.div>
    </div>
  );
}
