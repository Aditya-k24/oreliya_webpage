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
  { value: 'newest', label: 'Newest First' },
  { value: 'name', label: 'Name A–Z' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
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
      const minPrice = parseFloat(filters.minPrice);
      filtered = filtered.filter(p => p.price >= minPrice);
    }
    if (filters.maxPrice) {
      const maxPrice = parseFloat(filters.maxPrice);
      filtered = filtered.filter(p => p.price <= maxPrice);
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

  const hasActiveFilters =
    !!filters.search ||
    !!filters.category ||
    !!filters.subcategory ||
    !!filters.minPrice ||
    !!filters.maxPrice ||
    filters.inStock !== null ||
    filters.sortBy !== 'newest';

  const inputCls =
    'w-full bg-transparent border-b border-[#F6EEDF]/15 focus:border-[#F6EEDF]/50 outline-none py-2 text-[#F6EEDF]/80 text-xs tracking-wide transition-colors duration-200 placeholder:text-[#F6EEDF]/20';

  const sectionLabelCls =
    'text-[#F6EEDF]/25 text-[9px] uppercase tracking-[0.4em] mb-4 block';

  const optionCls = (active: boolean) =>
    `block w-full text-left py-3.5 text-sm tracking-wide border-b border-[#F6EEDF]/10 transition-colors duration-200 ${
      active ? 'text-[#F6EEDF]' : 'text-[#F6EEDF]/50 hover:text-[#F6EEDF]'
    }`;

  return (
    <div className={className}>
      {/* Overlay */}
      {showSidebar && (
        <div
          className='fixed inset-0 bg-black/40 z-40 backdrop-blur-sm'
          role='button'
          tabIndex={0}
          aria-label='Close filters'
          onClick={() => setShowSidebar(false)}
          onKeyDown={e => e.key === 'Escape' && setShowSidebar(false)}
        />
      )}

      {/* Sidebar — mirrors nav sidebar, slides from right */}
      <aside
        className={`fixed right-0 top-0 h-full w-72 bg-[#1E240A] z-50 flex flex-col transform transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          showSidebar ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Top bar */}
        <div className='flex items-center justify-between px-8 h-16 border-b border-[#F6EEDF]/10 flex-shrink-0'>
          <p className='text-[#F6EEDF]/40 text-[9px] uppercase tracking-[0.4em]'>
            Filter &amp; Sort
          </p>
          <button
            type='button'
            onClick={() => setShowSidebar(false)}
            className='text-[#F6EEDF]/40 hover:text-[#F6EEDF] transition-colors'
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

        {/* Scrollable content */}
        <nav className='flex-1 px-8 pt-8 pb-6 overflow-y-auto space-y-10'>
          {/* Search */}
          <div>
            <span className={sectionLabelCls}>Search</span>
            <div className='relative'>
              <input
                type='text'
                placeholder='Search pieces…'
                value={filters.search}
                onChange={e => handleFilterChange('search', e.target.value)}
                className={`${inputCls} pr-5`}
              />
              <svg
                className='absolute right-0 top-2.5 w-3.5 h-3.5 text-[#F6EEDF]/20 pointer-events-none'
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
          </div>

          {/* Category */}
          <div>
            <span className={sectionLabelCls}>Category</span>
            {categories.map(cat => (
              <button
                key={cat.value}
                type='button'
                onClick={() => handleFilterChange('category', cat.value)}
                className={optionCls(filters.category === cat.value)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Subcategory */}
          {filters.category && availableSubcategories.length > 0 && (
            <div>
              <span className={sectionLabelCls}>Style</span>
              <button
                type='button'
                onClick={() => handleFilterChange('subcategory', '')}
                className={optionCls(!filters.subcategory)}
              >
                All
              </button>
              {availableSubcategories.map(sub => (
                <button
                  key={sub.value}
                  type='button'
                  onClick={() => handleFilterChange('subcategory', sub.value)}
                  className={optionCls(filters.subcategory === sub.value)}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          )}

          {/* Price */}
          <div>
            <span className={sectionLabelCls}>Price (₹)</span>
            <div className='flex items-center gap-3'>
              <input
                type='number'
                placeholder='Min'
                value={filters.minPrice}
                onChange={e => handleFilterChange('minPrice', e.target.value)}
                className={inputCls}
              />
              <span className='text-[#F6EEDF]/20 text-xs flex-shrink-0'>—</span>
              <input
                type='number'
                placeholder='Max'
                value={filters.maxPrice}
                onChange={e => handleFilterChange('maxPrice', e.target.value)}
                className={inputCls}
              />
            </div>
          </div>

          {/* Availability */}
          <div>
            <span className={sectionLabelCls}>Availability</span>
            {availabilityOptions.map(opt => (
              <button
                key={String(opt.value)}
                type='button'
                onClick={() => handleFilterChange('inStock', opt.value)}
                className={optionCls(filters.inStock === opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div>
            <span className={sectionLabelCls}>Sort By</span>
            {sortOptions.map(opt => (
              <button
                key={opt.value}
                type='button'
                onClick={() => handleFilterChange('sortBy', opt.value)}
                className={optionCls(filters.sortBy === opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className='px-8 py-6 border-t border-[#F6EEDF]/10 flex-shrink-0'>
          {hasActiveFilters ? (
            <button
              type='button'
              onClick={clearFilters}
              className='text-[#F6EEDF]/30 hover:text-[#F6EEDF]/70 text-[10px] uppercase tracking-[0.25em] transition-colors duration-200'
            >
              Clear All Filters
            </button>
          ) : (
            <p className='text-[#F6EEDF]/15 text-[10px] uppercase tracking-[0.25em]'>
              No filters applied
            </p>
          )}
        </div>
      </aside>

      {/* Trigger button */}
      <button
        type='button'
        onClick={() => setShowSidebar(true)}
        className='flex items-center gap-2.5 text-[10px] uppercase tracking-[0.25em] text-[#1E240A]/50 hover:text-[#1E240A] transition-colors duration-200'
      >
        <svg
          className='w-3.5 h-3.5'
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
        Filter &amp; Sort
        {hasActiveFilters && (
          <span className='w-1.5 h-1.5 bg-[#1E240A] rounded-full' />
        )}
      </button>
    </div>
  );
}
