import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProductById } from '@/features/products/lib/server';
import type { Product } from '@/types/product';

interface ProductPageProps {
  params: { id: string };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductById(params.id);

  if (!product) {
    notFound();
  }

  // Helper function to get a valid image URL
  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl) return '/placeholder-product.svg';
    
    // If it's already a full URL, return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // If it's a relative path, ensure it starts with slash and encode spaces
    if (imageUrl.startsWith('/')) {
      // Encode spaces and special characters in the URL
      const pathParts = imageUrl.split('/');
      const encodedParts = pathParts.map(part => 
        part.includes(' ') ? encodeURIComponent(part) : part
      );
      return encodedParts.join('/');
    }
    
    // If it's a relative path without leading slash, add one and encode
    return `/${encodeURIComponent(imageUrl)}`;
  };

  return (
    <div className="min-h-screen bg-[#F6EEDF]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#1E240A]">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-[#1E240A]">Products</Link>
            <span>/</span>
            <span className="text-[#1E240A]">{product.name}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative h-96 w-full rounded-lg overflow-hidden">
              <Image
                src={getImageUrl(product.images[0] || '/placeholder-product.svg')}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(1).map((image, index) => (
                  <div key={index} className="relative h-20 w-full rounded-lg overflow-hidden">
                    <Image
                      src={getImageUrl(image)}
                      alt={`${product.name} view ${index + 2}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 25vw, 12.5vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <span className="text-sm text-gray-500 uppercase tracking-wide">
                {product.category}
              </span>
              <h1 className="text-3xl font-bold text-[#1E240A] mt-2">
                {product.name}
              </h1>
            </div>

            <div className="text-3xl font-bold text-[#1E240A]">
              ${product.price.toFixed(2)}
            </div>

            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Availability:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  product.inStock 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <button 
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors duration-200 ${
                  product.inStock
                    ? 'bg-[#1E240A] text-white hover:bg-[#2A3A1A]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!product.inStock}
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>

            <div className="text-sm text-gray-500">
              <p>Free shipping on orders over $100</p>
              <p>30-day return policy</p>
              <p>Lifetime warranty on craftsmanship</p>
            </div>
          </div>
        </div>

        {/* Back to Products */}
        <div className="mt-12 text-center">
          <Link 
            href="/products"
            className="inline-flex items-center px-6 py-3 border border-[#1E240A] text-[#1E240A] rounded-lg hover:bg-[#1E240A] hover:text-white transition-colors duration-200"
          >
            ← Back to All Products
          </Link>
        </div>
      </div>
    </div>
  );
}
