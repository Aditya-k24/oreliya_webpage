import Link from 'next/link';
import Image from 'next/image';
import { getProducts } from '@/features/products/lib/server';
import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
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
    <Link href={`/products/${product.id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 group-hover:scale-105">
        <div className="relative h-64 w-full">
          <Image
            src={product.images[0] ? getImageUrl(product.images[0]) : '/placeholder-product.svg'}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg text-[#1E240A] mb-2 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-[#1E240A]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            <span className="text-sm text-gray-500 capitalize">
              {product.category}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

interface ProductsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const allProducts = await getProducts();
  const { category } = await searchParams;
  
  // Filter products by category if specified
  const products = category 
    ? allProducts.filter(product => product.category === category)
    : allProducts;

  return (
    <div className="min-h-screen bg-[#F6EEDF]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#1E240A] mb-4">
            {category ? category : 'Our Products'}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {category 
              ? `Explore our collection of ${category.toLowerCase()}`
              : 'Discover our exquisite collection of handcrafted jewelry pieces'
            }
          </p>
          {category && (
            <div className="mt-4">
              <Link 
                href="/products"
                className="inline-flex items-center text-[#1E240A] hover:text-[#2A3A1A] transition-colors duration-200"
              >
                ← View All Products
              </Link>
            </div>
          )}
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No products available at the moment.</p>
            <p className="text-gray-500 mt-2">Check back soon for new arrivals!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
