'use client';

import { useState, useEffect } from 'react';

export default function SimpleProductsPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    console.log('SimpleProductsPage useEffect triggered');
    
    const fetchProducts = async () => {
      try {
        console.log('Fetching products...');
        const response = await fetch('/api/products');
        const data = await response.json();
        console.log('Products data:', data);
        setProducts(data.success ? data.data.products : []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        console.log('Setting loading to false');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  console.log('SimpleProductsPage rendered, loading:', loading);

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
          <h1 className="text-4xl font-bold text-[#1E240A] mb-4">Our Products</h1>
          <p className="text-sm text-gray-500 mb-4">Debug: Component rendered successfully</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-600">₹{product.price.toLocaleString('en-IN')}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
