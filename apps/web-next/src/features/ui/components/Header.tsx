'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Custom Design', href: '/customization' },
  { name: 'Heritage', href: '/about' },
];

const contactLink = { name: 'Contact', href: '/contact' };

export function Header() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <header className='bg-[#F6EEDF]/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-6 lg:px-8'>
        <div className='h-1 bg-[#1E240A]' />
        <div className='flex items-center justify-between h-20'>
          <nav
            className='hidden lg:flex items-center gap-12 text-sm'
            role='navigation'
            aria-label='Main navigation'
          >
            {navigation.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`uppercase tracking-widest transition-all duration-500 ease-out hover:scale-105 ${
                  isActive(item.href)
                    ? 'text-[#1E240A] border-b-2 border-[#1E240A] pb-1'
                    : 'text-[#1E240A] hover:text-[#2A3A1A]'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <Link
            href='/'
            className='absolute left-1/2 transform -translate-x-1/2 flex items-center group transition-transform duration-500 ease-out hover:scale-105'
            aria-label='Oreliya homepage'
          >
            <div className='flex items-center'>
              <div className='w-12 h-12 flex items-center justify-center'>
                <Image
                  src='/logo-mark.svg'
                  alt=''
                  width={48}
                  height={48}
                  className='w-full h-full object-contain'
                  priority
                />
              </div>
              <div className='h-8'>
                <Image
                  src='/logo.svg'
                  alt='Oreliya'
                  height={32}
                  width={120}
                  className='h-full w-auto object-contain'
                  priority
                />
              </div>
            </div>
          </Link>

          <div className='flex items-center gap-8'>
            <Link
              href={contactLink.href}
              className={`uppercase tracking-widest transition-all duration-500 ease-out hover:scale-105 ${
                isActive(contactLink.href)
                  ? 'text-[#1E240A] border-b-2 border-[#1E240A] pb-1'
                  : 'text-[#1E240A] hover:text-[#2A3A1A]'
              }`}
            >
              {contactLink.name}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
