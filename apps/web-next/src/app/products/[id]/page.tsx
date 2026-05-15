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

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return notFound();
  }

  return (
    <div className='min-h-screen bg-[#F6EEDF]'>
      <div className='max-w-7xl mx-auto px-6 lg:px-8 py-12'>
        {/* Breadcrumb */}
        <nav className='mb-12'>
          <div className='flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#1E240A]/40'>
            <Link
              href='/'
              className='hover:text-[#1E240A]/70 transition-colors'
            >
              Home
            </Link>
            <span>/</span>
            <Link
              href='/products'
              className='hover:text-[#1E240A]/70 transition-colors'
            >
              Collections
            </Link>
            <span>/</span>
            <span className='text-[#1E240A]/70'>{product.name}</span>
          </div>
        </nav>

        {/* Main Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24'>
          {/* Image Carousel */}
          <ProductImageCarousel
            images={product.images || []}
            productName={product.name}
          />

          {/* Details */}
          <div className='space-y-8'>
            {/* Category & Badges */}
            <div className='flex items-center gap-3 flex-wrap'>
              <span className='text-[#1E240A]/50 text-[10px] uppercase tracking-[0.3em]'>
                {product.category}
              </span>
              {product.isFeatured && (
                <span className='text-[#1E240A]/50 text-[10px] uppercase tracking-[0.3em]'>
                  · Featured
                </span>
              )}
              {product.isOnSale && (
                <span className='text-[#1E240A] text-[10px] uppercase tracking-[0.3em]'>
                  · {product.salePercentage}% Off
                </span>
              )}
            </div>

            {/* Title */}
            <div className='pb-8 border-b border-[#1E240A]/10'>
              <h1
                className='text-4xl lg:text-5xl text-[#1E240A] leading-[1.1]'
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 400,
                  letterSpacing: '-0.02em',
                }}
              >
                {product.name}
              </h1>
            </div>

            {/* Description */}
            <p className='text-[#1E240A]/65 text-sm font-light leading-relaxed whitespace-pre-wrap'>
              {product.description}
            </p>

            {/* Customizations */}
            {product.customizations && product.customizations.length > 0 && (
              <div className='border-t border-[#1E240A]/10 pt-8'>
                <ProductCustomization customizations={product.customizations} />
              </div>
            )}

            {/* Inquire CTA */}
            <div className='pt-2'>
              <Link
                href={`/contact?product=${encodeURIComponent(product.name)}`}
                className='block w-full'
              >
                <button type='button' className='btn-primary text-xs w-full'>
                  Inquire Now
                </button>
              </Link>
            </div>

            {/* Promise */}
            <div className='border-t border-[#1E240A]/10 pt-8 space-y-4'>
              {[
                'Free shipping on orders over ₹5,000',
                '30-day return policy',
                'Lifetime warranty on craftsmanship',
                'Authenticity certificate included',
              ].map(item => (
                <div key={item} className='flex items-start gap-4'>
                  <div className='w-px h-4 bg-[#1E240A]/30 mt-0.5 flex-shrink-0' />
                  <span className='text-[#1E240A]/55 text-xs font-light leading-relaxed'>
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className='flex flex-wrap gap-2 pt-2'>
                {product.tags.map(tag => (
                  <span
                    key={tag}
                    className='px-3 py-1 border border-[#1E240A]/20 text-[#1E240A]/50 text-[10px] uppercase tracking-[0.2em]'
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Back Link */}
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
