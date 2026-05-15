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
  const [showRefine, setShowRefine] = useState(false);
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
    setShowRefine(false);
  };

  const hasRefineFilters = !!(
    filters.minPrice ||
    filters.maxPrice ||
    filters.inStock !== null
  );

  const hasAnyFilter = !!(
    filters.search ||
    filters.category ||
    hasRefineFilters ||
    filters.subcategory ||
    filters.sortBy !== 'newest'
  );

  return (
    <div className={className}>
      {/* Row 1: category pills + sort */}
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

        <select
          value={filters.sortBy}
          onChange={e => handleFilterChange('sortBy', e.target.value)}
          className='bg-transparent border-b border-[#1E240A]/20 focus:border-[#1E240A] outline-none text-[10px] uppercase tracking-[0.2em] text-[#1E240A]/50 py-1.5 pr-3 cursor-pointer transition-colors duration-200'
        >
          {sortOptions.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Row 2: search + refine + clear */}
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

        <div className='flex items-center gap-5 ml-auto'>
          <button
            type='button'
            onClick={() => setShowRefine(!showRefine)}
            className={`text-[10px] uppercase tracking-[0.25em] transition-colors duration-200 ${
              hasRefineFilters
                ? 'text-[#1E240A]'
                : 'text-[#1E240A]/35 hover:text-[#1E240A]'
            }`}
          >
            {hasRefineFilters ? 'Refine ·' : 'Refine'}
          </button>

          {hasAnyFilter && (
            <button
              type='button'
              onClick={clearFilters}
              className='text-[10px] uppercase tracking-[0.25em] text-[#1E240A]/25 hover:text-[#1E240A]/60 transition-colors duration-200'
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Refine panel */}
      {showRefine && (
        <div className='mt-6 pt-6 border-t border-[#1E240A]/10'>
          <div className='flex flex-wrap gap-10'>
            {/* Price */}
            <div>
              <p className='text-[9px] uppercase tracking-[0.3em] text-[#1E240A]/40 mb-3'>
                Price (₹)
              </p>
              <div className='flex items-center gap-3'>
                <input
                  type='number'
                  placeholder='Min'
                  value={filters.minPrice}
                  onChange={e => handleFilterChange('minPrice', e.target.value)}
                  className='w-24 bg-transparent border-b border-[#1E240A]/20 focus:border-[#1E240A] outline-none py-1.5 text-[#1E240A] text-xs tracking-wide transition-colors duration-200 placeholder:text-[#1E240A]/25'
                />
                <span className='text-[#1E240A]/20 text-xs'>—</span>
                <input
                  type='number'
                  placeholder='Max'
                  value={filters.maxPrice}
                  onChange={e => handleFilterChange('maxPrice', e.target.value)}
                  className='w-24 bg-transparent border-b border-[#1E240A]/20 focus:border-[#1E240A] outline-none py-1.5 text-[#1E240A] text-xs tracking-wide transition-colors duration-200 placeholder:text-[#1E240A]/25'
                />
              </div>
            </div>

            {/* Availability */}
            <div>
              <p className='text-[9px] uppercase tracking-[0.3em] text-[#1E240A]/40 mb-3'>
                Availability
              </p>
              <div className='flex gap-5'>
                {availabilityOptions.map(opt => (
                  <button
                    key={String(opt.value)}
                    type='button'
                    onClick={() => handleFilterChange('inStock', opt.value)}
                    className={`text-[10px] uppercase tracking-[0.2em] pb-0.5 transition-colors duration-200 ${
                      filters.inStock === opt.value
                        ? 'text-[#1E240A] border-b border-[#1E240A]'
                        : 'text-[#1E240A]/35 hover:text-[#1E240A]/70'
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
                <p className='text-[9px] uppercase tracking-[0.3em] text-[#1E240A]/40 mb-3'>
                  Style
                </p>
                <div className='flex flex-wrap gap-4'>
                  <button
                    type='button'
                    onClick={() => handleFilterChange('subcategory', '')}
                    className={`text-[10px] uppercase tracking-[0.2em] pb-0.5 transition-colors duration-200 ${
                      !filters.subcategory
                        ? 'text-[#1E240A] border-b border-[#1E240A]'
                        : 'text-[#1E240A]/35 hover:text-[#1E240A]/70'
                    }`}
                  >
                    All
                  </button>
                  {availableSubcategories.map(sub => (
                    <button
                      key={sub.value}
                      type='button'
                      onClick={() =>
                        handleFilterChange('subcategory', sub.value)
                      }
                      className={`text-[10px] uppercase tracking-[0.2em] pb-0.5 transition-colors duration-200 ${
                        filters.subcategory === sub.value
                          ? 'text-[#1E240A] border-b border-[#1E240A]'
                          : 'text-[#1E240A]/35 hover:text-[#1E240A]/70'
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
