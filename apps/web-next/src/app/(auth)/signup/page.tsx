'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';

export default function SignUpPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      });
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      if (res?.error) throw new Error(res.error);
      router.push('/');
    } catch (err) {
      setError('Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-[#F6EEDF] flex items-center justify-center px-6 lg:px-8 pt-8'>
      <div className='max-w-md w-full'>
        {/* Welcome Message */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-light text-[#1E240A]'>Create Account</h1>
        </div>

        {/* Signup Form */}
        <div className='bg-white rounded-2xl shadow-xl p-8 border border-[#1E240A]/10'>
          <div className='mb-8'>
            <h2 className='text-2xl font-medium text-[#1E240A]'>Sign Up</h2>
          </div>
          <form onSubmit={onSubmit} className='space-y-6'>
            <div>
              <label className='block text-sm font-medium text-[#1E240A] mb-2' htmlFor='firstName'>
                First Name
              </label>
              <input
                id='firstName'
                className='w-full px-4 py-3 border border-[#1E240A]/20 rounded-lg shadow-sm placeholder-[#1E240A]/50 bg-[#F6EEDF]/30 focus:ring-2 focus:ring-[#1E240A] focus:border-[#1E240A] transition-colors duration-200 text-[#1E240A]'
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                placeholder='Enter your first name'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-[#1E240A] mb-2' htmlFor='lastName'>
                Last Name
              </label>
              <input
                id='lastName'
                className='w-full px-4 py-3 border border-[#1E240A]/20 rounded-lg shadow-sm placeholder-[#1E240A]/50 bg-[#F6EEDF]/30 focus:ring-2 focus:ring-[#1E240A] focus:border-[#1E240A] transition-colors duration-200 text-[#1E240A]'
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder='Enter your last name'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-[#1E240A] mb-2' htmlFor='email'>
                Email Address
              </label>
              <input
                id='email'
                className='w-full px-4 py-3 border border-[#1E240A]/20 rounded-lg shadow-sm placeholder-[#1E240A]/50 bg-[#F6EEDF]/30 focus:ring-2 focus:ring-[#1E240A] focus:border-[#1E240A] transition-colors duration-200 text-[#1E240A]'
                type='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
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
                type='password'
                value={password}
                onChange={e => setPassword(e.target.value)}
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
            <button 
              type='submit' 
              className='w-full bg-[#1E240A] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#2A3A1A] focus:ring-2 focus:ring-[#1E240A] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center uppercase tracking-wider text-sm' 
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Additional Info */}
          <div className='mt-8 text-center'>
            <p className='text-sm text-[#1E240A]/70'>
              Already have an account?{' '}
              <a href='/login' className='text-[#1E240A] hover:text-[#2A3A1A] font-medium transition-colors duration-200'>
                Sign in here
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
