import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProductById } from '@/features/products/lib/server';
import ProductCustomization from '@/components/ProductCustomization';
import ProductImageCarousel from '@/components/ProductImageCarousel';
import { ProductService } from '@/api-lib/services/productService';
import { ProductRepository } from '@/api-lib/repositories/productRepository';
import prisma from '@/api-lib/config/database';

export const revalidate = 600;

export async function generateStaticParams() {
  try {
    const productRepository = new ProductRepository(prisma);
    const productService = new ProductService(productRepository);
    const result = await productService.getProducts();
    if (result.success && result.data?.products) {
      return result.data.products.map((p: { id: string }) => ({ id: p.id }));
    }
  } catch {
    // fall through — no static params, pages render on demand
  }
  return [];
}

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

const promises = [
  'Free shipping on orders over ₹5,000',
  '30-day return policy',
  'Lifetime warranty on craftsmanship',
  'Authenticity certificate included',
];

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) return notFound();

  return (
    <div className='min-h-screen bg-[#F6EEDF]'>
      <div className='max-w-7xl mx-auto px-6 lg:px-8 py-12'>
        {/* Breadcrumb */}
        <nav className='mb-12'>
          <div className='flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#1E240A]/35'>
            <Link
              href='/'
              className='hover:text-[#1E240A]/60 transition-colors'
            >
              Home
            </Link>
            <span className='text-[#1E240A]/20'>/</span>
            <Link
              href='/products'
              className='hover:text-[#1E240A]/60 transition-colors'
            >
              Collections
            </Link>
            <span className='text-[#1E240A]/20'>/</span>
            <span className='text-[#1E240A]/60'>{product.name}</span>
          </div>
        </nav>

        {/* Main grid — image slightly wider */}
        <div className='grid grid-cols-1 lg:grid-cols-[1.1fr,0.9fr] gap-16 lg:gap-20 items-start'>
          {/* Left — image carousel */}
          <ProductImageCarousel
            images={product.images || []}
            productName={product.name}
          />

          {/* Right — details, sticky on scroll */}
          <div className='lg:sticky lg:top-24'>
            {/* Category & badges */}
            <p className='text-[#1E240A]/40 text-[9px] uppercase tracking-[0.4em] mb-6'>
              {product.category}
              {product.isFeatured && (
                <span className='text-[#1E240A]/30'> · Featured</span>
              )}
              {product.isOnSale && (
                <span className='text-[#1E240A]'>
                  {' '}
                  · {product.salePercentage}% Off
                </span>
              )}
            </p>

            {/* Title */}
            <h1
              className='text-4xl lg:text-[2.75rem] text-[#1E240A] leading-[1.05] mb-8'
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 400,
                letterSpacing: '-0.02em',
              }}
            >
              {product.name}
            </h1>

            <div className='h-px bg-[#1E240A]/10 mb-8' />

            {/* Description */}
            <p className='text-[#1E240A]/60 text-sm font-light leading-[1.8] whitespace-pre-wrap mb-8'>
              {product.description}
            </p>

            {/* Customizations */}
            {product.customizations && product.customizations.length > 0 && (
              <div className='border-t border-[#1E240A]/10 pt-8 mb-8'>
                <ProductCustomization customizations={product.customizations} />
              </div>
            )}

            {/* CTA */}
            <div className='border-t border-[#1E240A]/10 pt-8 mb-8'>
              <Link
                href={`/contact?product=${encodeURIComponent(product.name)}`}
                className='block w-full'
              >
                <button type='button' className='btn-primary text-xs w-full'>
                  Inquire Now
                </button>
              </Link>
            </div>

            {/* Promises */}
            <div className='border-t border-[#1E240A]/10 pt-8 space-y-4 mb-8'>
              {promises.map(item => (
                <div key={item} className='flex items-start gap-4'>
                  <div className='w-px h-3.5 bg-[#1E240A]/25 mt-0.5 flex-shrink-0' />
                  <span className='text-[#1E240A]/50 text-xs font-light leading-relaxed'>
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className='flex flex-wrap gap-2'>
                {product.tags.map(tag => (
                  <span
                    key={tag}
                    className='px-3 py-1 border border-[#1E240A]/15 text-[#1E240A]/40 text-[10px] uppercase tracking-[0.2em]'
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Back */}
        <div className='mt-20 pt-10 border-t border-[#1E240A]/10'>
          <Link href='/products'>
            <button type='button' className='btn-outline text-xs'>
              ← Back to Collections
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
