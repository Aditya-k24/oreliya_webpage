'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';

const navigation = [
  { name: 'Customise', href: '/customization' },
  { name: 'About Us', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

const productCategories = [
  {
    name: 'Special Offer Rings',
    href: '/products?category=special-offer-rings',
    hasSubcategories: false,
  },
  {
    name: 'All Products',
    href: '/products',
    hasSubcategories: false,
  },
  {
    name: 'Rings',
    href: '/products?category=rings',
    hasSubcategories: false,
  },
  {
    name: 'Necklace',
    href: '/products?category=necklaces',
    hasSubcategories: false,
  },
  {
    name: 'Earrings',
    href: '/products?category=earrings',
    hasSubcategories: false,
  },
  {
    name: 'Bracelet',
    href: '/products?category=bracelets',
    hasSubcategories: false,
  },
  {
    name: 'Mangalsutra',
    href: '/products?category=mangalsutra',
    hasSubcategories: false,
  },
  {
    name: 'Other',
    href: '/products?category=other',
    hasSubcategories: false,
  },
];

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 bg-[#F6EEDF]/95 backdrop-blur-sm border-r border-[#1E240A]/10 z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
        showSidebar ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Top accent line */}
        <div className='h-0.5 bg-[#1E240A]' />
        
        {/* Sidebar content */}
        <div className='p-6 relative pb-20'>
          {/* Close button */}
          <button
            onClick={() => setShowSidebar(false)}
            className='absolute top-4 right-4 p-2 rounded-md text-[#1E240A] hover:bg-[#1E240A]/10 transition-colors duration-200'
            aria-label='Close sidebar'
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
          
          {/* Navigation */}
          <nav className='space-y-4 mt-12' role='navigation' aria-label='Main navigation'>
            {navigation.map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setShowSidebar(false)}
                className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'text-[#1E240A] bg-[#1E240A]/10 border-l-4 border-[#1E240A]'
                    : 'text-[#1E240A]/80 hover:text-[#1E240A] hover:bg-[#1E240A]/5'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Admin section - only show if user is admin */}
          {(session?.user as any)?.role === 'admin' && (
            <div className='mt-8 pt-6 border-t border-[#1E240A]/10'>
              <h3 className='text-sm font-medium text-[#1E240A]/60 uppercase tracking-wide mb-4 px-4'>
                Admin Panel
              </h3>
              <nav className='space-y-2' role='navigation' aria-label='Admin navigation'>
                <Link
                  href='/admin'
                  onClick={() => setShowSidebar(false)}
                  className={`block px-4 py-2 text-sm rounded-lg transition-colors duration-200 ${
                    isActive('/admin')
                      ? 'text-[#1E240A] bg-[#1E240A]/10 border-l-4 border-[#1E240A]'
                      : 'text-[#1E240A]/80 hover:text-[#1E240A] hover:bg-[#1E240A]/5'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href='/admin/products/new'
                  onClick={() => setShowSidebar(false)}
                  className='block px-4 py-2 text-sm text-[#1E240A]/80 hover:text-[#1E240A] hover:bg-[#1E240A]/5 rounded-lg transition-colors duration-200'
                >
                  Add Product
                </Link>
                <Link
                  href='/admin/products'
                  onClick={() => setShowSidebar(false)}
                  className='block px-4 py-2 text-sm text-[#1E240A]/80 hover:text-[#1E240A] hover:bg-[#1E240A]/5 rounded-lg transition-colors duration-200'
                >
                  Manage Products
                </Link>
                <Link
                  href='/admin/categories'
                  onClick={() => setShowSidebar(false)}
                  className='block px-4 py-2 text-sm text-[#1E240A]/80 hover:text-[#1E240A] hover:bg-[#1E240A]/5 rounded-lg transition-colors duration-200'
                >
                  Manage Categories
                </Link>
              </nav>
            </div>
          )}

          {/* Products section */}
          <div className='mt-8 pt-6 border-t border-[#1E240A]/10'>
            <h3 className='text-sm font-medium text-[#1E240A]/60 uppercase tracking-wide mb-4 px-4'>
              Product Categories
            </h3>
            <nav className='space-y-1' role='navigation' aria-label='Product categories'>
              {productCategories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  onClick={() => setShowSidebar(false)}
                  className='block px-4 py-2 text-sm text-[#1E240A]/80 hover:text-[#1E240A] hover:bg-[#1E240A]/5 rounded-lg transition-colors duration-200'
                >
                  {category.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Auth section in sidebar - only show if not logged in */}
          {isMounted && !session && (
            <div className='mt-8 pt-6 border-t border-[#1E240A]/10'>
              <div className='flex flex-col space-y-3 px-4'>
                <Link
                  href='/login'
                  onClick={() => setShowSidebar(false)}
                  className='w-full px-4 py-2 text-sm font-medium text-[#1E240A] bg-transparent border border-[#1E240A] rounded-lg hover:bg-[#1E240A]/5 transition-colors duration-200 text-center'
                >
                  Sign In
                </Link>
                <Link
                  href='/register'
                  onClick={() => setShowSidebar(false)}
                  className='w-full px-4 py-2 text-sm font-medium bg-[#1E240A] text-white rounded-lg hover:bg-[#2A3A1A] transition-colors duration-200 text-center'
                >
                  Register
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main header with centered logo */}
      <header className='bg-[#F6EEDF]/90 backdrop-blur-sm border-b border-[#1E240A]/10 sticky top-0 z-40'>
        <div className='max-w-7xl mx-auto px-6 lg:px-8'>
          {/* Top accent line */}
          <div className='h-0.5 bg-[#1E240A]' />
          
          {/* Header content */}
          <div className='flex items-center justify-between h-16'>
            {/* Menu button */}
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className='p-2 rounded-md text-[#1E240A] hover:bg-[#1E240A]/10 transition-colors duration-200'
              aria-label='Toggle sidebar menu'
            >
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
              </svg>
            </button>
            
            {/* Centered logo */}
            <div className='absolute left-1/2 transform -translate-x-1/2 flex items-center'>
              <Link
                href='/'
                className='flex items-center group transition-transform duration-300 hover:scale-105'
                aria-label='Oreliya homepage'
              >
                <div className='flex items-center'>
                  <div className='w-12 h-12 flex items-center justify-center'>
                    <Image
                      src='/assets/logos/logo-mark.svg'
                      alt=''
                      width={48}
                      height={48}
                      className='w-full h-full object-contain'
                      priority
                    />
                  </div>
                  <div className='h-8'>
                    <Image
                      src='/assets/logos/logo.svg'
                      alt='Oreliya'
                      height={32}
                      width={120}
                      className='h-full w-auto object-contain'
                      priority
                    />
                  </div>
                </div>
              </Link>
            </div>
            
            {/* Auth section - only show user menu if logged in */}
            {isMounted && session && (
              <div className='flex items-center space-x-4 ml-auto'>
                <div className='relative'>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className='flex items-center space-x-2 p-2 rounded-md text-[#1E240A] hover:bg-[#1E240A]/10 transition-colors duration-200'
                  >
                    <span className='text-sm font-medium hidden md:inline'>{session.user?.name || session.user?.email}</span>
                    <svg 
                      className={`w-4 h-4 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} 
                      fill='none' 
                      stroke='currentColor' 
                      viewBox='0 0 24 24'
                    >
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                    </svg>
                  </button>
                  
                  {showUserMenu && (
                    <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50'>
                      <div className='py-1'>
                        <div className='md:hidden px-4 py-2 text-sm font-medium text-gray-900 border-b border-gray-100'>
                          {session.user?.name || session.user?.email}
                        </div>
                        {(session.user as any)?.role === 'admin' && (
                          <Link
                            href='/admin'
                            className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200'
                            onClick={() => setShowUserMenu(false)}
                          >
                            Admin Dashboard
                          </Link>
                        )}
                        <Link
                          href='/account'
                          className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200'
                          onClick={() => setShowUserMenu(false)}
                        >
                          My Account
                        </Link>
                        <button
                          onClick={() => {
                            signOut();
                            setShowUserMenu(false);
                          }}
                          className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200'
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile menu button - only visible on mobile */}
      <button
        onClick={() => setShowMobileMenu(!showMobileMenu)}
        className='lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md text-[#1E240A] bg-[#F6EEDF]/90 backdrop-blur-sm border border-[#1E240A]/10 hover:bg-[#1E240A]/10 transition-colors duration-200'
        aria-label='Toggle mobile menu'
      >
        <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          {showMobileMenu ? (
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
          ) : (
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
          )}
        </svg>
      </button>

      {/* Mobile sidebar overlay */}
      {showMobileMenu && (
        <>
          <div 
            className='lg:hidden fixed inset-0 bg-black/50 z-30'
            onClick={() => setShowMobileMenu(false)}
          />
          <div className='lg:hidden fixed left-0 top-0 h-full w-64 bg-[#F6EEDF]/95 backdrop-blur-sm border-r border-[#1E240A]/10 z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto'>
            {/* Top accent line */}
            <div className='h-0.5 bg-[#1E240A]' />
            
            {/* Mobile sidebar content */}
            <div className='p-6 pb-20'>
              {/* Navigation */}
              <nav className='space-y-4 mt-8' role='navigation' aria-label='Main navigation'>
                {navigation.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200 ${
                      isActive(item.href)
                        ? 'text-[#1E240A] bg-[#1E240A]/10 border-l-4 border-[#1E240A]'
                        : 'text-[#1E240A]/80 hover:text-[#1E240A] hover:bg-[#1E240A]/5'
                    }`}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              {/* Admin section - only show if user is admin */}
              {(session?.user as any)?.role === 'admin' && (
                <div className='mt-8 pt-6 border-t border-[#1E240A]/10'>
                  <h3 className='text-sm font-medium text-[#1E240A]/60 uppercase tracking-wide mb-4 px-4'>
                    Admin Panel
                  </h3>
                  <nav className='space-y-2' role='navigation' aria-label='Admin navigation'>
                    <Link
                      href='/admin'
                      onClick={() => setShowMobileMenu(false)}
                      className={`block px-4 py-2 text-sm rounded-lg transition-colors duration-200 ${
                        isActive('/admin')
                          ? 'text-[#1E240A] bg-[#1E240A]/10 border-l-4 border-[#1E240A]'
                          : 'text-[#1E240A]/80 hover:text-[#1E240A] hover:bg-[#1E240A]/5'
                      }`}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href='/admin/products/new'
                      onClick={() => setShowMobileMenu(false)}
                      className='block px-4 py-2 text-sm text-[#1E240A]/80 hover:text-[#1E240A] hover:bg-[#1E240A]/5 rounded-lg transition-colors duration-200'
                    >
                      Add Product
                    </Link>
                    <Link
                      href='/admin/products'
                      onClick={() => setShowMobileMenu(false)}
                      className='block px-4 py-2 text-sm text-[#1E240A]/80 hover:text-[#1E240A] hover:bg-[#1E240A]/5 rounded-lg transition-colors duration-200'
                    >
                      Manage Products
                    </Link>
                    <Link
                      href='/admin/categories'
                      onClick={() => setShowMobileMenu(false)}
                      className='block px-4 py-2 text-sm text-[#1E240A]/80 hover:text-[#1E240A] hover:bg-[#1E240A]/5 rounded-lg transition-colors duration-200'
                    >
                      Manage Categories
                    </Link>
                  </nav>
                </div>
              )}

              {/* Products section */}
              <div className='mt-8 pt-6 border-t border-[#1E240A]/10'>
                <h3 className='text-sm font-medium text-[#1E240A]/60 uppercase tracking-wide mb-4 px-4'>
                  Product Categories
                </h3>
                <nav className='space-y-1' role='navigation' aria-label='Product categories'>
                  {productCategories.map((category) => (
                    <Link
                      key={category.name}
                      href={category.href}
                      onClick={() => setShowMobileMenu(false)}
                      className='block px-4 py-2 text-sm text-[#1E240A]/80 hover:text-[#1E240A] hover:bg-[#1E240A]/5 rounded-lg transition-colors duration-200'
                    >
                      {category.name}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Auth section in mobile sidebar - only show if not logged in */}
              {isMounted && !session && (
                <div className='mt-8 pt-6 border-t border-[#1E240A]/10'>
                  <div className='flex flex-col space-y-3 px-4'>
                    <Link
                      href='/login'
                      onClick={() => setShowMobileMenu(false)}
                      className='w-full px-4 py-2 text-sm font-medium text-[#1E240A] bg-transparent border border-[#1E240A] rounded-lg hover:bg-[#1E240A]/5 transition-colors duration-200 text-center'
                    >
                      Sign In
                    </Link>
                    <Link
                      href='/register'
                      onClick={() => setShowMobileMenu(false)}
                      className='w-full px-4 py-2 text-sm font-medium bg-[#1E240A] text-white rounded-lg hover:bg-[#2A3A1A] transition-colors duration-200 text-center'
                    >
                      Register
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
