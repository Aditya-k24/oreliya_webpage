import Link from 'next/link';
import Image from 'next/image';
import {
  HeroVideo,
  CraftsmanshipSection,
  AnnouncementBar,
} from '@/components/ui';
import { getCategories } from '@/features/products/lib/server';
import type { Category } from '@/types/product';

interface CategoryCardProps {
  category: Category;
}

function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/products?category=${category.slug}`}
      className='group relative overflow-hidden rounded-lg shadow-sm hover:shadow-2xl transition-all duration-700 ease-out transform hover:-translate-y-3 hover:scale-[1.02] border border-gray-100 hover:border-gray-200'
    >
      <div className='aspect-[3/4] relative bg-white'>
        <Image
          src={category.image}
          alt={category.name}
          fill
          className='object-cover group-hover:scale-105 transition-transform duration-1200 ease-out'
          sizes='(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700' />
        <div className='absolute inset-0 ring-1 ring-inset ring-black/5 group-hover:ring-black/10 transition-all duration-700' />
      </div>
    </Link>
  );
}

export default async function Page() {
  const categories = await getCategories();

  return (
    <>
      <AnnouncementBar />
      <div className='bg-[#F6EEDF]'>
        <HeroVideo linkComponent={Link} />

        {/* Explore Our Collections section */}
        <section className='max-w-7xl mx-auto px-6 lg:px-8 py-20 text-center'>
          <h2 className='text-3xl font-medium text-[#1E240A] mb-6'>
            Explore Our Collections
          </h2>
          <p className='text-gray-600 mb-12'>
            Discover the perfect piece for every occasion
          </p>

          <div className='grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 lg:gap-12'>
            {categories.map(category => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>

        <CraftsmanshipSection linkComponent={Link} />

        {/* Coming soon section */}
        <section className='max-w-7xl mx-auto px-6 lg:px-8 py-20 text-center'>
          <div className='flex flex-col items-center justify-center mb-8'>
            <div className='w-10 h-10 mb-4'>
              <Image
                src='/logo-mark.svg'
                alt='Oreliya'
                width={40}
                height={40}
                className='w-full h-full object-contain'
              />
            </div>
            <h2 className='text-3xl font-medium text-[#1E240A] mb-4'>
              Coming Soon
            </h2>
          </div>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8'>
            We&apos;re working hard to bring you our beautiful collection. In
            the meantime, explore our custom design services to create your
            perfect piece.
          </p>
          <Link href='/customization'>
            <button type='button' className='btn-primary'>
              Start Custom Design
            </button>
          </Link>
        </section>
      </div>
    </>
  );
}
