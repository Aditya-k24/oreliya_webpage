import { useState, useRef, useEffect, useCallback } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  onSearch,
  placeholder = 'Search...',
  className = '',
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(() => {
    if (query.trim()) {
      onSearch(query.trim());
    }
  }, [query, onSearch]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && document.activeElement === inputRef.current) {
        handleSearch();
      }
    };

    document.addEventListener('keypress', handleKeyPress);
    return () => document.removeEventListener('keypress', handleKeyPress);
  }, [handleSearch]);

  const handleClear = () => {
    setQuery('');
    onSearch('');
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      <div className='relative'>
        <input
          ref={inputRef}
          type='text'
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1E240A] focus:border-transparent dark:text-gray-100 transition-colors'
        />

        {/* Search Icon */}
        <div className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400'>
          <svg
            className='w-5 h-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
            />
          </svg>
        </div>

        {/* Clear Button */}
        {query && (
          <button
            type='button'
            onClick={handleClear}
            aria-label='Clear search'
            className='absolute right-20 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'
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
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        )}

        {/* Search Button */}
        <button
          type='button'
          onClick={handleSearch}
          disabled={!query.trim()}
          className='absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-[#1E240A] text-white rounded-md hover:bg-[#2A3A1A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium'
        >
          Search
        </button>
      </div>

      {/* Search Suggestions (optional) */}
      {isFocused && query && (
        <div className='absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10'>
          <div className='p-2 text-sm text-gray-500 dark:text-gray-400'>
            Press Enter to search for &quot;{query}&quot;
          </div>
        </div>
      )}
    </div>
  );
}
