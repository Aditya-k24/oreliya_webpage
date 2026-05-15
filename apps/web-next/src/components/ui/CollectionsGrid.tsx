'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface Category {
  name: string;
  image: string;
  href: string;
}

interface CollectionsGridProps {
  categories: Category[];
  linkComponent?: React.ComponentType<any>;
}

export function CollectionsGrid({
  categories,
  linkComponent: Link,
}: CollectionsGridProps) {
  const LinkComponent = Link || 'a';

  return (
    <section className='bg-[#F6EEDF] pt-20 pb-24'>
      {/* Header */}
      <div className='max-w-7xl mx-auto px-6 lg:px-8 mb-10 flex items-end justify-between'>
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className='text-[#1E240A]/50 text-[10px] uppercase tracking-[0.35em] mb-3'
          >
            Collections
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 400,
              letterSpacing: '-0.02em',
            }}
            className='text-3xl md:text-4xl text-[#1E240A]'
          >
            Shop by Category
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <LinkComponent href='/products'>
            <span className='text-[10px] uppercase tracking-[0.25em] text-[#1E240A]/50 hover:text-[#1E240A] transition-colors duration-300 border-b border-[#1E240A]/25 hover:border-[#1E240A] pb-0.5'>
              View All
            </span>
          </LinkComponent>
        </motion.div>
      </div>

      {/*
        4 equal portrait columns — gap-px hairline separators.
        All 4 items fill a single row on desktop; 2×2 on mobile.
        No orphaned items, no mixed aspect ratios.
        Images carry their own category name — no text overlay needed.
      */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-px bg-[#1E240A]/10'>
        {categories.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{
              duration: 0.7,
              delay: i * 0.07,
              ease: [0.22, 1, 0.36, 1],
            }}
            className='bg-[#F6EEDF]'
          >
            <LinkComponent href={cat.href} className='block group'>
              <div className='relative w-full aspect-[2/3] overflow-hidden'>
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className='object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.04]'
                  sizes='(max-width: 768px) 50vw, 25vw'
                />
                <div className='absolute inset-0 bg-[#1E240A]/0 group-hover:bg-[#1E240A]/12 transition-colors duration-500' />
              </div>
            </LinkComponent>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
