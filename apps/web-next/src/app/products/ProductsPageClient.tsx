'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types/product';
import { SearchAndFilter } from '@/features/ui/components/SearchAndFilter';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`} className="group">
      <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
        ) : (
          <Image
            src="/placeholder-product.svg"
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 drop-shadow-lg text-center">
            {product.name}
          </h3>
          
          {/* Price section commented out */}
          {/* <div className="flex flex-col">
            <span className="text-xs text-white/80 font-medium drop-shadow">Starting from</span>
            <span className="text-lg font-bold text-white drop-shadow-lg">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          </div> */}
        </div>
      </div>
    </Link>
  );
}

interface ProductsPageClientProps {
  initialProducts: Product[];
  initialCategory?: string;
}

export default function ProductsPageClient({ initialProducts, initialCategory = '' }: ProductsPageClientProps) {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts);

  // Generate dynamic heading based on category
  const getHeading = () => {
    if (!initialCategory) return 'Our Products';
    
    const categoryMap: { [key: string]: string } = {
      'rings': 'Our Rings',
      'necklaces': 'Our Necklaces', 
      'earrings': 'Our Earrings',
      'bracelets': 'Our Bracelets',
      'mangalsutra': 'Our Mangalsutra',
      'other': 'Our Other Products'
    };
    
    return categoryMap[initialCategory.toLowerCase()] || `Our ${initialCategory.charAt(0).toUpperCase() + initialCategory.slice(1)}s`;
  };

  return (
    <div className="min-h-screen bg-[#F6EEDF]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#1E240A] mb-4">
            {getHeading()}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {initialCategory 
              ? `Discover our exquisite collection of ${initialCategory.toLowerCase()}`
              : 'Discover our exquisite collection of handcrafted jewelry pieces'
            }
          </p>
          {initialCategory && (
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

        <div className="mb-8">
          <SearchAndFilter 
            products={initialProducts} 
            onFilteredProducts={setFilteredProducts}
          />
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No products match your search criteria.</p>
            <p className="text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
            <Link 
              href="/products"
              className="inline-block mt-4 px-6 py-2 bg-[#1E240A] text-white rounded-lg hover:bg-[#2A3A1A] transition-colors"
            >
              View All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
