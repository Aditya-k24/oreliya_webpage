import { Link, useLocation } from 'react-router-dom';

export function Header() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className='bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200/70 dark:border-gray-800/70 sticky top-0 z-50 shadow-sm'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='relative flex items-center justify-between h-16 lg:h-20'>
          {/* Left navigation */}
          <nav className='hidden md:flex items-center gap-8 text-sm tracking-wide'>
            <Link
              to='/customization'
              className={`uppercase font-medium transition-colors duration-200 ${
                isActive('/customization')
                  ? 'text-[#BFA16A]'
                  : 'text-gray-700 dark:text-gray-300 hover:text-[#BFA16A]'
              }`}
            >
              Customize
            </Link>
            <Link
              to='/about'
              className={`uppercase font-medium transition-colors duration-200 ${
                isActive('/about')
                  ? 'text-[#BFA16A]'
                  : 'text-gray-700 dark:text-gray-300 hover:text-[#BFA16A]'
              }`}
            >
              About
            </Link>
          </nav>

          {/* Center Logo - Enhanced with hover effects */}
          <Link
            to='/'
            className='absolute left-1/2 transform -translate-x-1/2 flex items-center group'
          >
            <div className='flex items-center group-hover:scale-105 transition-all duration-300'>
              {/* Logo Mark */}
              <div className='relative w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center group-hover:scale-110 transition-transform duration-300'>
                <img
                  src='/logo-mark.svg'
                  alt='Oreliya logo mark'
                  className='w-full h-full object-contain dark:hidden'
                />
                <img
                  src='/logo-mark-white.svg'
                  alt='Oreliya logo mark'
                  className='w-full h-full object-contain hidden dark:block'
                />
              </div>

              {/* Logo Text */}
              <div className='relative'>
                <img
                  src='/logo.svg'
                  alt='Oreliya'
                  className='h-8 lg:h-10 w-auto object-contain dark:hidden group-hover:opacity-80 transition-opacity duration-300'
                />
                <img
                  src='/logo-white.svg'
                  alt='Oreliya'
                  className='h-8 lg:h-10 w-auto object-contain hidden dark:block group-hover:opacity-80 transition-opacity duration-300'
                />
              </div>
            </div>

            {/* Subtle glow effect on hover */}
            <div className='absolute inset-0 bg-gradient-to-r from-[#BFA16A]/0 via-[#BFA16A]/5 to-[#BFA16A]/0 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10' />
          </Link>

          {/* Right side actions */}
          <div className='flex items-center gap-3'>
            {/* Reach Out Link */}
            <Link
              to='/contact'
              className={`uppercase font-medium transition-colors duration-200 ${
                isActive('/contact')
                  ? 'text-[#BFA16A]'
                  : 'text-gray-700 dark:text-gray-300 hover:text-[#BFA16A]'
              }`}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
