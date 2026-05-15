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
  { value: '', label: 'All' },
  { value: 'rings', label: 'Rings' },
  { value: 'special-offer-rings', label: 'Special Offers' },
  { value: 'necklaces', label: 'Necklaces' },
  { value: 'earrings', label: 'Earrings' },
  { value: 'bracelets', label: 'Bracelets' },
  { value: 'mangalsutra', label: 'Mangalsutra' },
  { value: 'other', label: 'Other' },
];

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'name', label: 'A–Z' },
  { value: 'price-asc', label: 'Price ↑' },
  { value: 'price-desc', label: 'Price ↓' },
];

const availabilityOptions: { label: string; value: boolean | null }[] = [
  { label: 'All', value: null },
  { label: 'In Stock', value: true },
  { label: 'Made to Order', value: false },
];

export function SearchAndFilter({
  products,
  onFilteredProducts,
  className = '',
  initialCategory = '',
}: SearchAndFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showSidebar, setShowSidebar] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: initialCategory,
    subcategory: '',
    minPrice: '',
    maxPrice: '',
    inStock: null,
    sortBy: 'newest',
  });

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const finalCategory =
      initialCategory ||
      (categoryParam && window.location.pathname === '/products'
        ? categoryParam
        : '');

    const inStockParam = searchParams.get('inStock');
    let inStock: boolean | null = null;
    if (inStockParam === 'true') inStock = true;
    else if (inStockParam === 'false') inStock = false;

    setFilters({
      search: searchParams.get('search') || '',
      category: finalCategory,
      subcategory: searchParams.get('subcategory') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      inStock,
      sortBy: (searchParams.get('sortBy') as FilterState['sortBy']) || 'newest',
    });
  }, [searchParams, initialCategory]);

  const availableSubcategories = filters.category
    ? products
        .filter(p => p.category === filters.category)
        .map(p => p.subcategory)
        .filter((sub, i, arr) => sub && arr.indexOf(sub) === i)
        .map(sub => ({ value: sub!, label: sub! }))
    : [];

  useEffect(() => {
    let filtered = [...products];

    if (filters.search) {
      const term = filters.search.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term)
      );
    }

    if (filters.category) {
      if (filters.category === 'special-offer-rings') {
        filtered = filtered.filter(
          p =>
            p.category.toLowerCase() === 'rings' &&
            parseFloat(p.price.toString()) === 5999
        );
      } else {
        filtered = filtered.filter(
          p => p.category.toLowerCase() === filters.category.toLowerCase()
        );
      }
    }

    if (filters.subcategory) {
      filtered = filtered.filter(p => p.subcategory === filters.subcategory);
    }

    if (filters.minPrice) {
      filtered = filtered.filter(p => p.price >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(p => p.price <= parseFloat(filters.maxPrice));
    }

    if (filters.inStock !== null) {
      filtered = filtered.filter(p => p.inStock === filters.inStock);
    }

    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'newest':
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        default:
          return 0;
      }
    });

    onFilteredProducts(filtered);
  }, [products, filters, onFilteredProducts]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.category) params.set('category', filters.category);
    if (filters.subcategory) params.set('subcategory', filters.subcategory);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    if (filters.inStock !== null)
      params.set('inStock', filters.inStock.toString());
    if (filters.sortBy !== 'newest') params.set('sortBy', filters.sortBy);

    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : '';

    if (
      window.location.search !== newUrl &&
      !initialCategory &&
      window.location.pathname === '/products'
    ) {
      const urlCategory = searchParams.get('category');
      if (filters.category !== urlCategory) {
        router.replace(`${window.location.pathname}${newUrl}`, {
          scroll: false,
        });
      }
    }
  }, [filters, router, initialCategory, searchParams]);

  const handleFilterChange = (
    key: keyof FilterState,
    value: string | boolean | null
  ) => {
    setFilters(prev => {
      const next = { ...prev, [key]: value };
      if (key === 'category' && value !== prev.category) {
        next.subcategory = '';
      }
      return next;
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
      sortBy: 'newest',
    });
  };

  const hasRefineFilters = !!(
    filters.minPrice ||
    filters.maxPrice ||
    filters.inStock !== null ||
    filters.subcategory
  );

  const hasAnyFilter = !!(
    filters.search ||
    filters.category ||
    hasRefineFilters ||
    filters.sortBy !== 'newest'
  );

  const sidebarInputCls =
    'w-full bg-transparent border-b border-[#F6EEDF]/20 focus:border-[#F6EEDF]/60 outline-none py-2 text-[#F6EEDF] text-xs tracking-wide transition-colors duration-200 placeholder:text-[#F6EEDF]/20';

  return (
    <>
      {/* Sidebar overlay */}
      {showSidebar && (
        <div
          className='fixed inset-0 bg-black/40 z-40 backdrop-blur-[2px]'
          role='button'
          tabIndex={0}
          aria-label='Close filters'
          onClick={() => setShowSidebar(false)}
          onKeyDown={e => e.key === 'Escape' && setShowSidebar(false)}
        />
      )}

      {/* Refine sidebar */}
      <aside
        className={`fixed right-0 top-0 h-full w-72 bg-[#1E240A] z-50 flex flex-col transform transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          showSidebar ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Top bar */}
        <div className='flex items-center justify-between px-8 h-16 border-b border-[#F6EEDF]/10'>
          <div>
            <p className='text-[#F6EEDF]/30 text-[9px] uppercase tracking-[0.4em]'>
              Refine
            </p>
          </div>
          <button
            type='button'
            onClick={() => setShowSidebar(false)}
            className='text-[#F6EEDF]/30 hover:text-[#F6EEDF] transition-colors'
            aria-label='Close filters'
          >
            <svg
              className='w-4 h-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1.5}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>

        {/* Sidebar body */}
        <div className='flex-1 overflow-y-auto px-8 py-8 space-y-10'>
          {/* Sort */}
          <div>
            <p className='text-[#F6EEDF]/30 text-[9px] uppercase tracking-[0.4em] mb-4'>
              Sort
            </p>
            <div className='space-y-1'>
              {sortOptions.map(opt => (
                <button
                  key={opt.value}
                  type='button'
                  onClick={() => handleFilterChange('sortBy', opt.value)}
                  className={`block w-full text-left py-2 text-xs tracking-wide border-b border-[#F6EEDF]/10 transition-colors duration-200 ${
                    filters.sortBy === opt.value
                      ? 'text-[#F6EEDF]'
                      : 'text-[#F6EEDF]/40 hover:text-[#F6EEDF]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div>
            <p className='text-[#F6EEDF]/30 text-[9px] uppercase tracking-[0.4em] mb-4'>
              Price (₹)
            </p>
            <div className='flex items-center gap-3'>
              <input
                type='number'
                placeholder='Min'
                value={filters.minPrice}
                onChange={e => handleFilterChange('minPrice', e.target.value)}
                className={sidebarInputCls}
              />
              <span className='text-[#F6EEDF]/20 text-xs flex-shrink-0'>—</span>
              <input
                type='number'
                placeholder='Max'
                value={filters.maxPrice}
                onChange={e => handleFilterChange('maxPrice', e.target.value)}
                className={sidebarInputCls}
              />
            </div>
          </div>

          {/* Availability */}
          <div>
            <p className='text-[#F6EEDF]/30 text-[9px] uppercase tracking-[0.4em] mb-4'>
              Availability
            </p>
            <div className='space-y-1'>
              {availabilityOptions.map(opt => (
                <button
                  key={String(opt.value)}
                  type='button'
                  onClick={() => handleFilterChange('inStock', opt.value)}
                  className={`block w-full text-left py-2 text-xs tracking-wide border-b border-[#F6EEDF]/10 transition-colors duration-200 ${
                    filters.inStock === opt.value
                      ? 'text-[#F6EEDF]'
                      : 'text-[#F6EEDF]/40 hover:text-[#F6EEDF]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Subcategory */}
          {filters.category && availableSubcategories.length > 0 && (
            <div>
              <p className='text-[#F6EEDF]/30 text-[9px] uppercase tracking-[0.4em] mb-4'>
                Style
              </p>
              <div className='space-y-1'>
                <button
                  type='button'
                  onClick={() => handleFilterChange('subcategory', '')}
                  className={`block w-full text-left py-2 text-xs tracking-wide border-b border-[#F6EEDF]/10 transition-colors duration-200 ${
                    !filters.subcategory
                      ? 'text-[#F6EEDF]'
                      : 'text-[#F6EEDF]/40 hover:text-[#F6EEDF]'
                  }`}
                >
                  All
                </button>
                {availableSubcategories.map(sub => (
                  <button
                    key={sub.value}
                    type='button'
                    onClick={() => handleFilterChange('subcategory', sub.value)}
                    className={`block w-full text-left py-2 text-xs tracking-wide border-b border-[#F6EEDF]/10 transition-colors duration-200 ${
                      filters.subcategory === sub.value
                        ? 'text-[#F6EEDF]'
                        : 'text-[#F6EEDF]/40 hover:text-[#F6EEDF]'
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {hasRefineFilters && (
          <div className='px-8 py-6 border-t border-[#F6EEDF]/10'>
            <button
              type='button'
              onClick={clearFilters}
              className='text-[#F6EEDF]/30 hover:text-[#F6EEDF]/70 text-[10px] uppercase tracking-[0.25em] transition-colors duration-200'
            >
              Clear Filters
            </button>
          </div>
        )}
      </aside>

      {/* Inline bar */}
      <div className={className}>
        {/* Row 1: category pills + refine button */}
        <div className='flex flex-wrap items-center justify-between gap-y-3 gap-x-4'>
          <div className='flex flex-wrap gap-1.5'>
            {categories.map(cat => (
              <button
                key={cat.value}
                type='button'
                onClick={() => handleFilterChange('category', cat.value)}
                className={`px-4 py-1.5 text-[10px] uppercase tracking-[0.25em] border transition-colors duration-200 ${
                  filters.category === cat.value
                    ? 'bg-[#1E240A] text-[#F6EEDF] border-[#1E240A]'
                    : 'text-[#1E240A]/45 border-[#1E240A]/20 hover:text-[#1E240A] hover:border-[#1E240A]/50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <button
            type='button'
            onClick={() => setShowSidebar(true)}
            className={`flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] transition-colors duration-200 ${
              hasRefineFilters
                ? 'text-[#1E240A]'
                : 'text-[#1E240A]/35 hover:text-[#1E240A]'
            }`}
          >
            <svg
              className='w-3 h-3'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1.5}
                d='M3 4h18M6 12h12M10 20h4'
              />
            </svg>
            {hasRefineFilters ? 'Refine ·' : 'Refine'}
          </button>
        </div>

        {/* Row 2: search + clear */}
        <div className='flex items-center gap-6 mt-5'>
          <div className='relative flex-1 max-w-xs'>
            <input
              type='text'
              placeholder='Search pieces…'
              value={filters.search}
              onChange={e => handleFilterChange('search', e.target.value)}
              className='w-full bg-transparent border-b border-[#1E240A]/20 focus:border-[#1E240A] outline-none py-2 text-[#1E240A] text-xs tracking-wide transition-colors duration-200 placeholder:text-[#1E240A]/25 pr-5'
            />
            <svg
              className='absolute right-0 top-2.5 w-3.5 h-3.5 text-[#1E240A]/25 pointer-events-none'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1.5}
                d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
              />
            </svg>
          </div>

          {hasAnyFilter && (
            <button
              type='button'
              onClick={clearFilters}
              className='ml-auto text-[10px] uppercase tracking-[0.25em] text-[#1E240A]/25 hover:text-[#1E240A]/60 transition-colors duration-200'
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </>
  );
}
