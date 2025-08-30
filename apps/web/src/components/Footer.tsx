import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className='bg-[#1E240A] text-white relative overflow-hidden'>
      {/* Elegant background pattern */}
      <div className='absolute inset-0 opacity-5'>
        <div className='absolute top-0 left-0 w-96 h-96 bg-gradient-radial from-[#F6EEDF] to-transparent' />
        <div className='absolute bottom-0 right-0 w-96 h-96 bg-gradient-radial from-[#F6EEDF] to-transparent' />
      </div>

      <div className='relative max-w-7xl mx-auto px-6 lg:px-8'>
        {/* Top decorative line */}
        <div className='h-px bg-gradient-to-r from-transparent via-[#F6EEDF] to-transparent opacity-50' />

        {/* Main footer content */}
        <div className='py-20'>
          {/* Logo and brand section */}
          <div className='text-center mb-20'>
            <div className='flex items-center justify-center mb-8'>
              <div className='w-16 h-16 flex items-center justify-center'>
                <img
                  src='/logo-mark-white.svg'
                  alt='Oreliya logo mark'
                  className='w-full h-full object-contain'
                />
              </div>
              <div className='h-12'>
                <img
                  src='/logo-white.svg'
                  alt='Oreliya'
                  className='h-full w-auto object-contain'
                />
              </div>
            </div>

            <div className='w-24 h-px bg-[#F6EEDF] mx-auto mb-8' />

            <p className='text-[#F6EEDF]/90 max-w-3xl mx-auto text-lg leading-relaxed font-light tracking-wide'>
              Crafting timeless elegance through modern technology and curated
              collections.
              <br />
              Your premier destination for luxury jewelry and bespoke designs.
            </p>
          </div>

          {/* Content grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-20 mb-20'>
            {/* About section */}
            <div className='text-center lg:text-left'>
              <h3 className='text-[#F6EEDF] text-sm font-medium uppercase tracking-[0.2em] mb-8 pb-2 border-b border-[#F6EEDF]/20'>
                About Oreliya
              </h3>
              <p className='text-white/70 leading-relaxed font-light text-sm'>
                Founded with a vision to bridge the gap between traditional
                luxury and contemporary innovation. We believe that every piece
                tells a story, and every customer deserves an experience that
                matches the quality of our craftsmanship.
              </p>
            </div>

            {/* Navigation */}
            <div className='text-center lg:text-left'>
              <h3 className='text-[#F6EEDF] text-sm font-medium uppercase tracking-[0.2em] mb-8 pb-2 border-b border-[#F6EEDF]/20'>
                Navigation
              </h3>
              <ul className='space-y-4'>
                <li>
                  <Link
                    to='/'
                    className='text-white/70 hover:text-[#F6EEDF] transition-all duration-300 text-sm font-light tracking-wide block py-1'
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to='/customization'
                    className='text-white/70 hover:text-[#F6EEDF] transition-all duration-300 text-sm font-light tracking-wide block py-1'
                  >
                    Custom Design
                  </Link>
                </li>
                <li>
                  <Link
                    to='/about'
                    className='text-white/70 hover:text-[#F6EEDF] transition-all duration-300 text-sm font-light tracking-wide block py-1'
                  >
                    Heritage
                  </Link>
                </li>
                <li>
                  <Link
                    to='/contact'
                    className='text-white/70 hover:text-[#F6EEDF] transition-all duration-300 text-sm font-light tracking-wide block py-1'
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Service */}
            <div className='text-center lg:text-left'>
              <h3 className='text-[#F6EEDF] text-sm font-medium uppercase tracking-[0.2em] mb-8 pb-2 border-b border-[#F6EEDF]/20'>
                Service
              </h3>
              <ul className='space-y-4'>
                <li>
                  <Link
                    to='/account'
                    className='text-white/70 hover:text-[#F6EEDF] transition-all duration-300 text-sm font-light tracking-wide block py-1'
                  >
                    My Account
                  </Link>
                </li>
                <li>
                  <Link
                    to='/contact'
                    className='text-white/70 hover:text-[#F6EEDF] transition-all duration-300 text-sm font-light tracking-wide block py-1'
                  >
                    Support
                  </Link>
                </li>
                <li>
                  <Link
                    to='/customization'
                    className='text-white/70 hover:text-[#F6EEDF] transition-all duration-300 text-sm font-light tracking-wide block py-1'
                  >
                    Custom Orders
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Social media section */}
          <div className='text-center mb-16'>
            <div className='w-16 h-px bg-[#F6EEDF] mx-auto mb-8' />
            <div className='flex justify-center space-x-8'>
              <a
                href='https://facebook.com'
                className='group flex items-center justify-center w-12 h-12 border border-[#F6EEDF]/30 hover:border-[#F6EEDF] transition-all duration-300'
              >
                <span className='sr-only'>Facebook</span>
                <svg
                  className='h-5 w-5 text-white/60 group-hover:text-[#F6EEDF] transition-colors duration-300'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    fillRule='evenodd'
                    d='M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z'
                    clipRule='evenodd'
                  />
                </svg>
              </a>
              <a
                href='https://instagram.com'
                className='group flex items-center justify-center w-12 h-12 border border-[#F6EEDF]/30 hover:border-[#F6EEDF] transition-all duration-300'
              >
                <span className='sr-only'>Instagram</span>
                <svg
                  className='h-5 w-5 text-white/60 group-hover:text-[#F6EEDF] transition-colors duration-300'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    fillRule='evenodd'
                    d='M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427C2.013 15.056 2 14.716 2 12v-.08c0-2.643.013-2.987.06-4.043.049-1.064.218-1.791.465-2.427A4.902 4.902 0 013.678 3.678a4.902 4.902 0 011.772-1.153c.636-.247 1.363-.416 2.427-.465C8.944 2.013 9.284 2 12 2z'
                    clipRule='evenodd'
                  />
                </svg>
              </a>
              <a
                href='https://twitter.com'
                className='group flex items-center justify-center w-12 h-12 border border-[#F6EEDF]/30 hover:border-[#F6EEDF] transition-all duration-300'
              >
                <span className='sr-only'>Twitter</span>
                <svg
                  className='h-5 w-5 text-white/60 group-hover:text-[#F6EEDF] transition-colors duration-300'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84' />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className='border-t border-[#F6EEDF]/20 py-8'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <div className='flex items-center mb-6 md:mb-0'>
              <div className='w-6 h-6 mr-4'>
                <img
                  src='/logo-mark-white.svg'
                  alt='Oreliya'
                  className='w-full h-full object-contain'
                />
              </div>
              <span className='text-white/50 text-xs uppercase tracking-[0.15em] font-light'>
                © 2024 Oreliya. All rights reserved.
              </span>
            </div>
            <div className='flex items-center gap-8 text-xs text-white/50'>
              <Link
                to='/privacy'
                className='hover:text-[#F6EEDF] transition-colors duration-300 uppercase tracking-[0.15em] font-light'
              >
                Privacy Policy
              </Link>
              <Link
                to='/terms'
                className='hover:text-[#F6EEDF] transition-colors duration-300 uppercase tracking-[0.15em] font-light'
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
