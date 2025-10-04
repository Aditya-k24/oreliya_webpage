'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Product } from '@/types/product';

interface SearchAndFilterProps {
  products: Product[];
  onFilteredProducts: (filteredProducts: Product[]) => void;
  className?: string;
  initialCategory?: string;
}

interface FilterState {
  search: string;
  category: string;
  subcategory: string;
  minPrice: string;
  maxPrice: string;
  inStock: boolean | null;
  sortBy: 'name' | 'price-asc' | 'price-desc' | 'newest';
}

const categories = [
  { value: '', label: 'All Categories' },
  { value: 'rings', label: 'Rings' },
  { value: 'necklaces', label: 'Necklaces' },
  { value: 'earrings', label: 'Earrings' },
  { value: 'bracelets', label: 'Bracelets' },
  { value: 'mangalsutra', label: 'Mangalsutra' },
  { value: 'other', label: 'Other' },
];

const sortOptions = [
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'price-asc', label: 'Price (Low to High)' },
  { value: 'price-desc', label: 'Price (High to Low)' },
  { value: 'newest', label: 'Newest First' },
];

export function SearchAndFilter({ products, onFilteredProducts, className = '', initialCategory = '' }: SearchAndFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showSidebar, setShowSidebar] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: '',
    subcategory: '',
    minPrice: '',
    maxPrice: '',
    inStock: null,
    sortBy: 'name',
  });

  // Initialize filters from URL on mount, prioritizing initialCategory prop
  useEffect(() => {
    setFilters({
      search: searchParams.get('search') || '',
      category: initialCategory || searchParams.get('category') || '',
      subcategory: searchParams.get('subcategory') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      inStock: searchParams.get('inStock') === 'true' ? true : (searchParams.get('inStock') === 'false' ? false : null),
      sortBy: (searchParams.get('sortBy') as FilterState['sortBy']) || 'name',
    });
  }, [searchParams, initialCategory]);

  // Get available subcategories based on selected category
  const availableSubcategories = filters.category
    ? products
        .filter(product => product.category === filters.category)
        .map(product => product.subcategory)
        .filter((subcategory, index, array) => subcategory && array.indexOf(subcategory) === index)
        .map(subcategory => ({ value: subcategory!, label: subcategory! }))
    : [];

  // Apply filters whenever filters change
  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
      );
    }

    // Category filter (case-insensitive)
    if (filters.category) {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Subcategory filter
    if (filters.subcategory) {
      filtered = filtered.filter(product => product.subcategory === filters.subcategory);
    }

    // Price range filter
    if (filters.minPrice) {
      const minPrice = parseFloat(filters.minPrice);
      filtered = filtered.filter(product => product.price >= minPrice);
    }
    if (filters.maxPrice) {
      const maxPrice = parseFloat(filters.maxPrice);
      filtered = filtered.filter(product => product.price <= maxPrice);
    }

    // Stock filter
    if (filters.inStock !== null) {
      filtered = filtered.filter(product => product.inStock === filters.inStock);
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    onFilteredProducts(filtered);
  }, [products, filters, onFilteredProducts]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.search) params.set('search', filters.search);
    if (filters.category) params.set('category', filters.category);
    if (filters.subcategory) params.set('subcategory', filters.subcategory);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    if (filters.inStock !== null) params.set('inStock', filters.inStock.toString());
    if (filters.sortBy !== 'name') params.set('sortBy', filters.sortBy);

    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : '';
    
    // Only update URL if it's different from current and not the initial load
    if (window.location.search !== newUrl && !initialCategory) {
      router.replace(`${window.location.pathname}${newUrl}`, { scroll: false });
    }
  }, [filters, router, initialCategory]);

  const handleFilterChange = (key: keyof FilterState, value: string | boolean | null) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      
      // Reset subcategory when category changes
      if (key === 'category' && value !== prev.category) {
        newFilters.subcategory = '';
      }
      
      return newFilters;
    });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      subcategory: '',
      minPrice: '',
      maxPrice: '',
      inStock: null,
      sortBy: 'name',
    });
  };

  const hasActiveFilters = filters.search || filters.category || filters.subcategory || 
                          filters.minPrice || filters.maxPrice || filters.inStock !== null || 
                          filters.sortBy !== 'name';

  return (
    <>
      {/* Filter Toggle Button */}
      <div className={`mb-4 ${className}`}>
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-[#1E240A] hover:text-[#2A3A1A] hover:bg-[#1E240A]/5 rounded-lg transition-colors duration-200 border border-[#1E240A]/20"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
          </svg>
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 bg-[#1E240A] rounded-full"></span>
          )}
          <svg 
            className={`w-4 h-4 transition-transform duration-200 ${showSidebar ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Sidebar Overlay */}
      {showSidebar && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setShowSidebar(false)}
          onKeyDown={(e) => e.key === 'Escape' && setShowSidebar(false)}
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
        />
      )}

      {/* Right Sidebar */}
      <div className={`fixed right-0 top-0 h-full w-80 bg-[#F6EEDF]/95 backdrop-blur-sm border-l border-[#1E240A]/10 z-50 transform transition-transform duration-300 ease-in-out ${
        showSidebar ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Top accent line */}
        <div className='h-0.5 bg-[#1E240A]' />
        
        {/* Sidebar content */}
        <div className='p-6 relative h-full overflow-y-auto'>
          {/* Close button */}
          <button
            type="button"
            onClick={() => setShowSidebar(false)}
            className='absolute top-4 right-4 p-2 rounded-md text-[#1E240A] hover:bg-[#1E240A]/10 transition-colors duration-200'
            aria-label='Close sidebar'
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>

          {/* Header */}
          <div className="mb-6 mt-12">
            <h2 className="text-xl font-semibold text-[#1E240A] mb-2">Search & Filter</h2>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm text-[#1E240A]/60 hover:text-[#1E240A] transition-colors duration-200"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#1E240A] mb-2">
              Search Products
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-[#1E240A]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-[#1E240A]/20 rounded-lg shadow-sm placeholder-[#1E240A]/50 bg-white focus:ring-2 focus:ring-[#1E240A] focus:border-[#1E240A] transition-colors duration-200 text-[#1E240A]"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="space-y-6">
            {/* Category and Subcategory */}
            <div>
              <label className="block text-sm font-medium text-[#1E240A] mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-4 py-2 border border-[#1E240A]/20 rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-[#1E240A] focus:border-[#1E240A] transition-colors duration-200 text-[#1E240A]"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {filters.category && availableSubcategories.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-[#1E240A] mb-2">
                  Subcategory
                </label>
                <select
                  value={filters.subcategory}
                  onChange={(e) => handleFilterChange('subcategory', e.target.value)}
                  className="w-full px-4 py-2 border border-[#1E240A]/20 rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-[#1E240A] focus:border-[#1E240A] transition-colors duration-200 text-[#1E240A]"
                >
                  <option value="">All Subcategories</option>
                  {availableSubcategories.map((subcategory) => (
                    <option key={subcategory.value} value={subcategory.value}>
                      {subcategory.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-[#1E240A] mb-2">
                Price Range (₹)
              </label>
              <div className="space-y-3">
                <input
                  type="number"
                  placeholder="Min price"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="w-full px-4 py-2 border border-[#1E240A]/20 rounded-lg shadow-sm placeholder-[#1E240A]/50 bg-white focus:ring-2 focus:ring-[#1E240A] focus:border-[#1E240A] transition-colors duration-200 text-[#1E240A]"
                />
                <input
                  type="number"
                  placeholder="Max price"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="w-full px-4 py-2 border border-[#1E240A]/20 rounded-lg shadow-sm placeholder-[#1E240A]/50 bg-white focus:ring-2 focus:ring-[#1E240A] focus:border-[#1E240A] transition-colors duration-200 text-[#1E240A]"
                />
              </div>
            </div>

            {/* Stock Status */}
            <div>
              <label className="block text-sm font-medium text-[#1E240A] mb-2">
                Availability
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="inStock"
                    checked={filters.inStock === null}
                    onChange={() => handleFilterChange('inStock', null)}
                    className="w-4 h-4 text-[#1E240A] border-[#1E240A]/20 focus:ring-[#1E240A]"
                  />
                  <span className="ml-2 text-sm text-[#1E240A]">All</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="inStock"
                    checked={filters.inStock === true}
                    onChange={() => handleFilterChange('inStock', true)}
                    className="w-4 h-4 text-[#1E240A] border-[#1E240A]/20 focus:ring-[#1E240A]"
                  />
                  <span className="ml-2 text-sm text-[#1E240A]">In Stock</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="inStock"
                    checked={filters.inStock === false}
                    onChange={() => handleFilterChange('inStock', false)}
                    className="w-4 h-4 text-[#1E240A] border-[#1E240A]/20 focus:ring-[#1E240A]"
                  />
                  <span className="ml-2 text-sm text-[#1E240A]">Out of Stock</span>
                </label>
              </div>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-[#1E240A] mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-4 py-2 border border-[#1E240A]/20 rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-[#1E240A] focus:border-[#1E240A] transition-colors duration-200 text-[#1E240A]"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
