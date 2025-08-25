import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { SearchBar } from '../components/SearchBar';
import { Pagination } from '../components/Pagination';
import { Badge } from '../components/Badge';
import { apiClient } from '../api/client';

interface ProductVariant {
  id: string;
  name: string;
  value: string;
  priceAdjustment?: number;
}

interface ProductCustomization {
  id: string;
  name: string;
  type: 'text' | 'select' | 'checkbox';
  options?: string[];
  priceAdjustment?: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  tags: string[];
  isOnSale: boolean;
  salePercentage?: number;
  variants: ProductVariant[];
  customizations: ProductCustomization[];
}

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || ''
  );
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || ''
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (searchQuery) params.append('search', searchQuery);
      params.append('page', currentPage.toString());
      params.append('limit', '12');

      const response = await apiClient.get(`/products?${params.toString()}`);
      if (response.data.success) {
        setProducts(response.data.data.products);
        setTotalPages(response.data.data.pagination.totalPages);
      }
    } catch (error) {
      // Error handling - could implement user notification here
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery, currentPage]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await apiClient.get('/products/categories');
      if (response.data.success) {
        setCategories(response.data.data.categories);
      }
    } catch (error) {
      // Error handling - could implement user notification here
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
    setCurrentPage(1);
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (category === selectedCategory) {
        newParams.delete('category');
      } else {
        newParams.set('category', category);
      }
      newParams.set('page', '1');
      return newParams;
    });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (query) {
        newParams.set('search', query);
      } else {
        newParams.delete('search');
      }
      newParams.set('page', '1');
      return newParams;
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('page', page.toString());
      return newParams;
    });
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-[#BFA16A]' />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-4'>
            Our Collection
          </h1>
          <p className='text-lg text-gray-600 dark:text-gray-300'>
            Discover our curated selection of luxury products
          </p>
        </div>

        {/* Search and Filters */}
        <div className='mb-8 space-y-4'>
          <SearchBar onSearch={handleSearch} placeholder='Search products...' />

          {/* Category Filters */}
          <div className='flex flex-wrap gap-2'>
            <Badge
              variant={selectedCategory === '' ? 'primary' : 'secondary'}
              onClick={() => handleCategoryChange('')}
              className='cursor-pointer'
            >
              All
            </Badge>
            {categories.map(category => (
              <Badge
                key={category}
                variant={
                  selectedCategory === category ? 'primary' : 'secondary'
                }
                onClick={() => handleCategoryChange(category)}
                className='cursor-pointer'
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8'>
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <div className='text-center py-16'>
            <div className='text-gray-400 dark:text-gray-500 text-6xl mb-4'>
              🔍
            </div>
            <h3 className='text-xl font-medium text-gray-900 dark:text-white mb-2'>
              No products found
            </h3>
            <p className='text-gray-600 dark:text-gray-400'>
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
