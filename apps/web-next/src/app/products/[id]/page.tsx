import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProductById } from '@/features/products/lib/server';
import ProductCustomization from '@/components/ProductCustomization';
import ProductImageCarousel from '@/components/ProductImageCarousel';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return notFound();
  }

  // Calculate total stock from variants
  // const totalStock = product.variants?.reduce((sum, variant) => sum + variant.stockQuantity, 0) || 0;
  // const isInStock = totalStock > 0;

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F6EEDF] to-[#F0E6D2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#1E240A] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-[#1E240A] transition-colors">
              Products
            </Link>
            <span>/</span>
            <span className="text-[#1E240A] font-medium">{product.name}</span>
          </div>
        </nav>

        {/* Main Product Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Product Images Carousel */}
          <ProductImageCarousel 
            images={product.images || []} 
            productName={product.name}
          />

          {/* Product Details */}
          <div className="space-y-8">
            {/* Product Header */}
            <div className="space-y-4">
              {/* Category and Badges */}
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 bg-[#1E240A]/10 text-[#1E240A] text-sm font-medium rounded-full uppercase tracking-wide">
                  {product.category}
                </span>
                {product.isFeatured && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                    Featured
                  </span>
                )}
                {product.isOnSale && (
                  <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                    {product.salePercentage}% Off
                  </span>
                )}
              </div>

              {/* Product Title */}
              <h1 className="text-4xl lg:text-5xl font-bold text-[#1E240A] leading-tight">
                {product.name}
              </h1>

              {/* Price */}
              {/* <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">Starting from</span>
                <span className="text-3xl lg:text-4xl font-bold text-[#1E240A]">
                  {formatPrice(Number(product.price))}
                </span>
                {product.compareAtPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(Number(product.compareAtPrice))}
                  </span>
                )}
              </div> */}
            </div>

            {/* Product Description */}
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed text-lg">
                {product.description}
              </p>
            </div>

            {/* Product Customizations */}
            {product.customizations && product.customizations.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <ProductCustomization
                  customizations={product.customizations}
                />
              </div>
            )}

            {/* Action Button */}
            <div>
              <Link
                href={`/contact?product=${encodeURIComponent(product.name)}`}
                className="flex items-center justify-center space-x-2 w-full py-4 px-8 bg-[#1E240A] text-white rounded-2xl font-semibold text-lg hover:bg-[#1E240A]/90 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <span>Inquire Now</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </Link>
            </div>

            {/* Product Features */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-[#1E240A] mb-4">Product Features</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#1E240A] rounded-full"></div>
                  <span className="text-gray-700">Free shipping on orders over ₹5,000</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#1E240A] rounded-full"></div>
                  <span className="text-gray-700">30-day return policy</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#1E240A] rounded-full"></div>
                  <span className="text-gray-700">Lifetime warranty on craftsmanship</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#1E240A] rounded-full"></div>
                  <span className="text-gray-700">Authenticity certificate included</span>
                </div>
              </div>
            </div>

            {/* Product Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-[#1E240A]">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Back to Products */}
        <div className="mt-16 text-center">
          <Link
            href="/products"
            className="inline-flex items-center px-8 py-4 border-2 border-[#1E240A] text-[#1E240A] rounded-2xl hover:bg-[#1E240A] hover:text-white transition-all duration-300 font-semibold text-lg"
          >
            ← Back to All Products
          </Link>
        </div>
      </div>
    </div>
  );
}