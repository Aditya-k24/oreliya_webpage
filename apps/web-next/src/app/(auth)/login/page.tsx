'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError('Invalid email or password');
      return;
    }
    // NextAuth will handle the redirect via the redirect callback
    router.push('/');
  };

  return (
    <div className='min-h-screen bg-[#F6EEDF] flex items-center justify-center px-4'>
      <div className='max-w-md w-full'>
        {/* Logo/Brand */}
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold text-[#1E240A] mb-2'>Oreliya</h1>
          <p className='text-gray-600'>Welcome back to your jewelry collection</p>
        </div>

        {/* Login Form */}
        <div className='bg-white rounded-2xl shadow-xl p-8 border border-gray-100'>
          <div className='mb-6'>
            <h2 className='text-2xl font-semibold text-[#1E240A] mb-2'>Sign In</h2>
            <p className='text-gray-600'>Enter your credentials to access your account</p>
          </div>

          <form onSubmit={onSubmit} className='space-y-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2' htmlFor='email'>
                Email Address
              </label>
              <input
                id='email'
                className='w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-[#1E240A] focus:border-[#1E240A] transition-colors duration-200'
                value={email}
                onChange={e => setEmail(e.target.value)}
                type='email'
                placeholder='Enter your email'
                required
              />
            </div>
            
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2' htmlFor='password'>
                Password
              </label>
              <input
                id='password'
                className='w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-[#1E240A] focus:border-[#1E240A] transition-colors duration-200'
                value={password}
                onChange={e => setPassword(e.target.value)}
                type='password'
                placeholder='Enter your password'
                required
              />
            </div>

            {error && (
              <div className='bg-red-50 border border-red-200 rounded-lg p-3'>
                <p className='text-red-600 text-sm flex items-center'>
                  <svg className='w-4 h-4 mr-2' fill='currentColor' viewBox='0 0 20 20'>
                    <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
                  </svg>
                  {error}
                </p>
              </div>
            )}

            <button 
              type='submit' 
              className='w-full bg-[#1E240A] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#2A3A1A] focus:ring-2 focus:ring-[#1E240A] focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center' 
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className='animate-spin -ml-1 mr-3 h-5 w-5 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Additional Info */}
          <div className='mt-6 text-center'>
            <p className='text-sm text-gray-500'>
              Don't have an account?{' '}
              <a href='/register' className='text-[#1E240A] hover:text-[#2A3A1A] font-medium'>
                Sign up here
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className='text-center mt-8'>
          <p className='text-xs text-gray-400'>
            © 2024 Oreliya. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
