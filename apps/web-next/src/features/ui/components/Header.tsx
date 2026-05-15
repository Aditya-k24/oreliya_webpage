'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';

const navigation = [
  { name: 'Collections', href: '/products' },
  { name: 'Customise', href: '/customization' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isHome = pathname === '/';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isTransparent = isHome && !scrolled;

  return (
    <>
      {/* Sidebar overlay */}
      {showSidebar && (
        <div
          className='fixed inset-0 bg-black/40 z-40 backdrop-blur-sm'
          role='button'
          tabIndex={0}
          aria-label='Close menu'
          onClick={() => setShowSidebar(false)}
          onKeyDown={e => e.key === 'Escape' && setShowSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-72 bg-[#1E240A] z-50 flex flex-col transform transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          showSidebar ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top */}
        <div className='flex items-center justify-between px-8 h-16 border-b border-[#F6EEDF]/10'>
          <Link href='/' onClick={() => setShowSidebar(false)}>
            <Image
              src='/assets/logos/logo-white.svg'
              alt='Oreliya'
              width={90}
              height={22}
              style={{ width: 'auto', height: 20 }}
            />
          </Link>
          <button
            type='button'
            onClick={() => setShowSidebar(false)}
            className='text-[#F6EEDF]/40 hover:text-[#F6EEDF] transition-colors'
            aria-label='Close menu'
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

        {/* Nav */}
        <nav
          className='flex-1 px-8 pt-8 overflow-y-auto'
          aria-label='Main navigation'
        >
          {navigation.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setShowSidebar(false)}
              className={`block py-4 text-sm tracking-wide border-b border-[#F6EEDF]/10 transition-colors duration-200 ${
                pathname === item.href
                  ? 'text-[#F6EEDF]'
                  : 'text-[#F6EEDF]/50 hover:text-[#F6EEDF]'
              }`}
            >
              {item.name}
            </Link>
          ))}

          {isMounted && (session?.user as any)?.role === 'admin' && (
            <div className='mt-8'>
              <p className='text-[#F6EEDF]/25 text-[9px] uppercase tracking-[0.3em] mb-3'>
                Admin
              </p>
              {[
                { name: 'Dashboard', href: '/admin' },
                { name: 'Add Product', href: '/admin/products/new' },
                { name: 'Manage Products', href: '/admin/products' },
              ].map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setShowSidebar(false)}
                  className='block py-2.5 text-xs text-[#F6EEDF]/40 hover:text-[#F6EEDF] transition-colors duration-200'
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}
        </nav>

        {/* Auth */}
        <div className='px-8 py-6 border-t border-[#F6EEDF]/10'>
          {isMounted && !session && (
            <div className='flex gap-6'>
              <Link
                href='/login'
                onClick={() => setShowSidebar(false)}
                className='text-[#F6EEDF]/50 hover:text-[#F6EEDF] text-xs uppercase tracking-[0.2em] transition-colors duration-200'
              >
                Sign In
              </Link>
              <Link
                href='/register'
                onClick={() => setShowSidebar(false)}
                className='text-[#F6EEDF] text-xs uppercase tracking-[0.2em] border-b border-[#F6EEDF]/40 pb-px hover:border-[#F6EEDF] transition-colors duration-200'
              >
                Register
              </Link>
            </div>
          )}
          {isMounted && session && (
            <div className='flex items-center justify-between'>
              <span className='text-[#F6EEDF]/50 text-xs'>
                {session.user?.name?.split(' ')[0] || 'Account'}
              </span>
              <button
                type='button'
                onClick={() => {
                  signOut();
                  setShowSidebar(false);
                }}
                className='text-[#F6EEDF]/30 hover:text-[#F6EEDF]/70 text-[10px] uppercase tracking-[0.2em] transition-colors'
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main header */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isTransparent
            ? 'bg-transparent border-b border-transparent'
            : 'bg-[#F6EEDF]/95 backdrop-blur-md border-b border-[#1E240A]/10'
        }`}
      >
        {/* Thin accent line — only when opaque */}
        <div
          className={`h-0.5 bg-[#1E240A] transition-opacity duration-300 ${isTransparent ? 'opacity-0' : 'opacity-100'}`}
        />

        <div className='max-w-7xl mx-auto px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            {/* Hamburger */}
            <button
              type='button'
              onClick={() => setShowSidebar(true)}
              aria-label='Open menu'
              className={`p-2 transition-colors duration-200 ${
                isTransparent
                  ? 'text-white hover:text-white/70'
                  : 'text-[#1E240A] hover:text-[#1E240A]/60'
              }`}
            >
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1.5}
                  d='M4 6h16M4 12h16M4 18h16'
                />
              </svg>
            </button>

            {/* Centered logo */}
            <Link
              href='/'
              className='absolute left-1/2 -translate-x-1/2 flex items-center gap-1'
              aria-label='Oreliya homepage'
            >
              <Image
                src={
                  isTransparent
                    ? '/assets/logos/logo-mark-white.svg'
                    : '/assets/logos/logo-mark.svg'
                }
                alt=''
                width={36}
                height={36}
                className='transition-opacity duration-300'
                priority
              />
              <Image
                src={
                  isTransparent
                    ? '/assets/logos/logo-white.svg'
                    : '/assets/logos/logo.svg'
                }
                alt='Oreliya'
                width={100}
                height={28}
                className='transition-opacity duration-300'
                style={{ width: 'auto', height: 28 }}
                priority
              />
            </Link>

            {/* Right: auth */}
            <div ref={menuRef} className='flex items-center gap-4'>
              {isMounted && session ? (
                <div className='relative'>
                  <button
                    type='button'
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className={`flex items-center gap-1.5 text-sm transition-colors ${
                      isTransparent
                        ? 'text-white/80 hover:text-white'
                        : 'text-[#1E240A]/70 hover:text-[#1E240A]'
                    }`}
                  >
                    <span className='hidden md:inline font-light'>
                      {session.user?.name?.split(' ')[0] || 'Account'}
                    </span>
                    <svg
                      className='w-3.5 h-3.5'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M19 9l-7 7-7-7'
                      />
                    </svg>
                  </button>
                  {showUserMenu && (
                    <div className='absolute right-0 mt-3 w-44 bg-white shadow-lg border border-gray-100 py-1 z-50'>
                      {(session.user as any)?.role === 'admin' && (
                        <Link
                          href='/admin'
                          className='block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50'
                          onClick={() => setShowUserMenu(false)}
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <Link
                        href='/account'
                        className='block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50'
                        onClick={() => setShowUserMenu(false)}
                      >
                        My Account
                      </Link>
                      <button
                        type='button'
                        onClick={() => {
                          signOut();
                          setShowUserMenu(false);
                        }}
                        className='block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 border-t border-gray-50'
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                isMounted && (
                  <Link
                    href='/login'
                    className={`text-xs uppercase tracking-[0.15em] transition-colors ${
                      isTransparent
                        ? 'text-white/70 hover:text-white'
                        : 'text-[#1E240A]/60 hover:text-[#1E240A]'
                    }`}
                  >
                    Sign In
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
