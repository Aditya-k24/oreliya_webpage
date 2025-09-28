'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchAndFilter } from '@/features/ui/components/SearchAndFilter';
import type { Product } from '@/types/product';

// Mock function to get products (replace with your actual data fetching)
async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch('/api/products');
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

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const category = searchParams.get('category');
  const subcategory = searchParams.get('subcategory');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getProducts();
        setAllProducts(products);
        
        // Initial filter by category and subcategory if specified in URL
        let initialProducts = products;
        if (category) {
          initialProducts = initialProducts.filter(product => product.category === category);
        }
        if (subcategory) {
          initialProducts = initialProducts.filter(product => product.subcategory === subcategory);
        }
        
        setFilteredProducts(initialProducts);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, subcategory]);

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
            {subcategory ? subcategory : category ? category : 'Our Products'}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {subcategory 
              ? `Explore our collection of ${subcategory.toLowerCase()}`
              : category 
                ? `Explore our collection of ${category.toLowerCase()}`
                : 'Discover our exquisite collection of handcrafted jewelry pieces'
            }
          </p>
          {(category || subcategory) && (
            <div className="mt-4 space-x-4">
              {subcategory && category && (
                <Link 
                  href={`/products?category=${encodeURIComponent(category)}`}
                  className="inline-flex items-center text-[#1E240A] hover:text-[#2A3A1A] transition-colors duration-200"
                >
                  ← View All {category}
                </Link>
              )}
              {category && (
                <Link 
                  href="/products"
                  className="inline-flex items-center text-[#1E240A] hover:text-[#2A3A1A] transition-colors duration-200"
                >
                  ← View All Products
                </Link>
              )}
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

