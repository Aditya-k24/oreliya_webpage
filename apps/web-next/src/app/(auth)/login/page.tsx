'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      
      if (res?.error) {
        setError('Invalid email or password');
        return;
      }
      
      if (res?.ok) {
        setSuccess('Login successful! Redirecting...');
        // Redirect based on user role
        setTimeout(() => {
          if (email === 'admin@oreliya.com') {
            router.push('/admin');
          } else {
            router.push('/');
          }
          router.refresh();
        }, 1000);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-[#F6EEDF] flex items-center justify-center px-6 lg:px-8 pt-2'>
      <div className='max-w-md w-full'>
        {/* Welcome Message */}
        <div className='text-center mb-4'>
          <h1 className='text-3xl font-light text-[#1E240A]'>Welcome Back</h1>
        </div>

        {/* Login Form */}
        <div className='bg-white rounded-2xl shadow-xl p-8 border border-[#1E240A]/10'>
          <div className='mb-8'>
            <h2 className='text-2xl font-medium text-[#1E240A]'>Sign In</h2>
          </div>

          <form onSubmit={onSubmit} className='space-y-6'>
            <div>
              <label className='block text-sm font-medium text-[#1E240A] mb-2' htmlFor='email'>
                Email Address
              </label>
              <input
                id='email'
                className='w-full px-4 py-3 border border-[#1E240A]/20 rounded-lg shadow-sm placeholder-[#1E240A]/50 bg-[#F6EEDF]/30 focus:ring-2 focus:ring-[#1E240A] focus:border-[#1E240A] transition-colors duration-200 text-[#1E240A]'
                value={email}
                onChange={e => setEmail(e.target.value)}
                type='email'
                placeholder='Enter your email'
                required
              />
            </div>
            
            <div>
              <label className='block text-sm font-medium text-[#1E240A] mb-2' htmlFor='password'>
                Password
              </label>
              <input
                id='password'
                className='w-full px-4 py-3 border border-[#1E240A]/20 rounded-lg shadow-sm placeholder-[#1E240A]/50 bg-[#F6EEDF]/30 focus:ring-2 focus:ring-[#1E240A] focus:border-[#1E240A] transition-colors duration-200 text-[#1E240A]'
                value={password}
                onChange={e => setPassword(e.target.value)}
                type='password'
                placeholder='Enter your password'
                required
              />
            </div>

            {error && (
              <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                <p className='text-red-600 text-sm flex items-center'>
                  <svg className='w-4 h-4 mr-2' fill='currentColor' viewBox='0 0 20 20'>
                    <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
                  </svg>
                  {error}
                </p>
              </div>
            )}

            {success && (
              <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
                <p className='text-green-600 text-sm flex items-center'>
                  <svg className='w-4 h-4 mr-2' fill='currentColor' viewBox='0 0 20 20'>
                    <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                  </svg>
                  {success}
                </p>
              </div>
            )}

            <button 
              type='submit' 
              className='w-full bg-[#1E240A] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#2A3A1A] focus:ring-2 focus:ring-[#1E240A] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center uppercase tracking-wider text-sm' 
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
          <div className='mt-8 text-center'>
            <p className='text-sm text-[#1E240A]/70'>
              Don&apos;t have an account?{' '}
              <a href='/register' className='text-[#1E240A] hover:text-[#2A3A1A] font-medium transition-colors duration-200'>
                Sign up here
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className='text-center mt-12'>
          <div className='w-16 h-px bg-[#1E240A]/20 mx-auto mb-4'></div>
          <p className='text-xs text-[#1E240A]/50 uppercase tracking-wider'>
            © 2024 Oreliya. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
