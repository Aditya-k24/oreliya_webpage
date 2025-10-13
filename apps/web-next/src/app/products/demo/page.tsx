'use client';

import { useState, useEffect } from 'react';
import { SearchAndFilter } from '@/features/ui/components/SearchAndFilter';
import type { Product } from '@/types/product';

// Mock function to get products
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

export default function ProductsDemoPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getProducts();
        setAllProducts(products);
        setFilteredProducts(products);
      } catch (error) {
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
            Search & Filter Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the power of our search and filter component with real-time filtering and sorting.
          </p>
        </div>

        {/* Search and Filter Component */}
        <div className="mb-8">
          <SearchAndFilter 
            products={allProducts} 
            onFilteredProducts={setFilteredProducts}
          />
        </div>

        {/* Results Summary */}
        <div className="mb-6 text-center">
          <p className="text-[#1E240A]/70 text-lg">
            Showing <span className="font-semibold">{filteredProducts.length}</span> of{' '}
            <span className="font-semibold">{allProducts.length}</span> products
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-6">
              <svg className="w-16 h-16 text-[#1E240A]/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-gray-600 text-lg mb-2">No products match your search criteria</p>
            <p className="text-gray-500">Try adjusting your filters or search terms to see more results</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
                <div className="relative h-64 w-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1E240A]/10 to-[#F6EEDF]/50 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-[#1E240A]/20 rounded-full flex items-center justify-center mx-auto mb-2">
                        <svg className="w-8 h-8 text-[#1E240A]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <p className="text-xs text-[#1E240A]/60">Product Image</p>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-[#1E240A] mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2 whitespace-pre-wrap">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-[#1E240A]">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500 capitalize">
                        {product.category}
                      </span>
                      {product.subcategory && (
                        <span className="text-xs text-gray-400">
                          • {product.subcategory}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.inStock 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
