'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
// import { useSearchParams } from 'next/navigation';
import { SearchAndFilter } from '@/features/ui/components/SearchAndFilter';
import type { Product } from '@/types/product';

// Function to get products from the API
async function getProducts(): Promise<Product[]> {
  try {
    // Use internal API route so newly created products (mock in dev) are visible
    const response = await fetch('/api/products', { cache: 'no-store' });
    const data = await response.json();
    return data.success ? data.data.products : [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

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
      <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl">
        {/* Background Image */}
        <Image
          src={product.images[0] ? getImageUrl(product.images[0]) : '/placeholder-product.svg'}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 drop-shadow-lg">
            {product.name}
          </h3>
          
          <div className="flex flex-col">
            <span className="text-xs text-white/80 font-medium drop-shadow">Starting from</span>
            <span className="text-lg font-bold text-white drop-shadow-lg">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setCategory(params.get('category') || '');
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getProducts();
        setAllProducts(products);
        // Don't pre-filter here - let SearchAndFilter handle all filtering
        setFilteredProducts(products);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6EEDF] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E240A] mx-auto mb-4"></div>
          <p className="text-[#1E240A]/70">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6EEDF]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#1E240A] mb-4">
            {category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Our Products'}
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

            {/* Search and Filter Component */}
            <div className="mb-8">
              <SearchAndFilter 
                products={allProducts} 
                onFilteredProducts={setFilteredProducts}
              />
            </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No products match your search criteria.</p>
            <p className="text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <>
            <div className="mb-6 text-center">
              <p className="text-[#1E240A]/70">
                Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

