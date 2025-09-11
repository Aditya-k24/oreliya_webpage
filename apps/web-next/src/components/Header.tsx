'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Header() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <header className='bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-6 lg:px-8'>
        <div className='h-1 bg-[#1E240A]' />
        <div className='flex items-center justify-between h-20'>
          <nav className='hidden lg:flex items-center gap-12 text-sm'>
            <Link
              href='/customization'
              className={`uppercase tracking-widest transition-colors duration-300 ${
                isActive('/customization')
                  ? 'text-[#1E240A] border-b-2 border-[#1E240A] pb-1'
                  : 'text-[#1E240A] hover:text-[#2A3A1A]'
              }`}
            >
              Custom Design
            </Link>
            <Link
              href='/about'
              className={`uppercase tracking-widest transition-colors duration-300 ${
                isActive('/about')
                  ? 'text-[#1E240A] border-b-2 border-[#1E240A] pb-1'
                  : 'text-[#1E240A] hover:text-[#2A3A1A]'
              }`}
            >
              Heritage
            </Link>
          </nav>

          <Link
            href='/'
            className='absolute left-1/2 transform -translate-x-1/2 flex items-center group'
          >
            <div className='flex items-center'>
              <div className='w-12 h-12 flex items-center justify-center'>
                <img
                  src='/logo-mark.svg'
                  alt='Oreliya logo mark'
                  className='w-full h-full object-contain'
                />
              </div>
              <div className='h-8'>
                <img
                  src='/logo.svg'
                  alt='Oreliya'
                  className='h-full w-auto object-contain'
                />
              </div>
            </div>
          </Link>

          <div className='flex items-center gap-8'>
            <Link
              href='/contact'
              className={`uppercase tracking-widest transition-colors duration-300 ${
                isActive('/contact')
                  ? 'text-[#1E240A] border-b-2 border-[#1E240A] pb-1'
                  : 'text-[#1E240A] hover:text-[#2A3A1A]'
              }`}
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
