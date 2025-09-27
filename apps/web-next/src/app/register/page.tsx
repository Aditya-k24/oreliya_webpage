'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Mock registration for development - replace with actual API call when backend is ready
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful registration
      setSuccess(true);
      
      // Auto sign in after successful registration
      setTimeout(async () => {
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });
        
        if (result?.error) {
          setError('Registration successful but login failed. Please sign in manually.');
          setSuccess(false);
        } else {
          router.push('/');
        }
      }, 2000);
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className='min-h-screen bg-[#F6EEDF] flex items-center justify-center px-6 lg:px-8 pt-8'>
        <div className='max-w-md w-full'>
          <div className='bg-white rounded-2xl shadow-xl p-8 border border-[#1E240A]/10 text-center'>
            <div className='bg-green-50 border border-green-200 rounded-lg p-6'>
              <div className='flex items-center justify-center mb-4'>
                <svg className='w-8 h-8 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                </svg>
              </div>
              <h3 className='text-lg font-medium text-green-800 mb-2'>Registration Successful!</h3>
              <p className='text-green-700'>Redirecting you to sign in...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-[#F6EEDF] flex items-center justify-center px-6 lg:px-8 pt-4'>
      <div className='max-w-md w-full'>
        {/* Welcome Message */}
        <div className='text-center mb-6'>
          <h1 className='text-3xl font-light text-[#1E240A]'>Create Account</h1>
        </div>

        {/* Registration Form */}
        <div className='bg-white rounded-2xl shadow-xl p-8 border border-[#1E240A]/10'>
          <div className='mb-8'>
            <h2 className='text-2xl font-medium text-[#1E240A]'>Sign Up</h2>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
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

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-[#1E240A] mb-2' htmlFor='firstName'>
                  First Name
                </label>
                <input
                  id='firstName'
                  name='firstName'
                  className='w-full px-4 py-3 border border-[#1E240A]/20 rounded-lg shadow-sm placeholder-[#1E240A]/50 bg-[#F6EEDF]/30 focus:ring-2 focus:ring-[#1E240A] focus:border-[#1E240A] transition-colors duration-200 text-[#1E240A]'
                  value={formData.firstName}
                  onChange={handleChange}
                  type='text'
                  placeholder='First name'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-[#1E240A] mb-2' htmlFor='lastName'>
                  Last Name
                </label>
                <input
                  id='lastName'
                  name='lastName'
                  className='w-full px-4 py-3 border border-[#1E240A]/20 rounded-lg shadow-sm placeholder-[#1E240A]/50 bg-[#F6EEDF]/30 focus:ring-2 focus:ring-[#1E240A] focus:border-[#1E240A] transition-colors duration-200 text-[#1E240A]'
                  value={formData.lastName}
                  onChange={handleChange}
                  type='text'
                  placeholder='Last name'
                  required
                />
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-[#1E240A] mb-2' htmlFor='email'>
                Email Address
              </label>
              <input
                id='email'
                name='email'
                className='w-full px-4 py-3 border border-[#1E240A]/20 rounded-lg shadow-sm placeholder-[#1E240A]/50 bg-[#F6EEDF]/30 focus:ring-2 focus:ring-[#1E240A] focus:border-[#1E240A] transition-colors duration-200 text-[#1E240A]'
                value={formData.email}
                onChange={handleChange}
                type='email'
                placeholder='Enter your email'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-[#1E240A] mb-2' htmlFor='phone'>
                Phone Number
              </label>
              <input
                id='phone'
                name='phone'
                className='w-full px-4 py-3 border border-[#1E240A]/20 rounded-lg shadow-sm placeholder-[#1E240A]/50 bg-[#F6EEDF]/30 focus:ring-2 focus:ring-[#1E240A] focus:border-[#1E240A] transition-colors duration-200 text-[#1E240A]'
                value={formData.phone}
                onChange={handleChange}
                type='tel'
                placeholder='Enter your phone number'
              />
            </div>
            
            <div>
              <label className='block text-sm font-medium text-[#1E240A] mb-2' htmlFor='password'>
                Password
              </label>
              <input
                id='password'
                name='password'
                className='w-full px-4 py-3 border border-[#1E240A]/20 rounded-lg shadow-sm placeholder-[#1E240A]/50 bg-[#F6EEDF]/30 focus:ring-2 focus:ring-[#1E240A] focus:border-[#1E240A] transition-colors duration-200 text-[#1E240A]'
                value={formData.password}
                onChange={handleChange}
                type='password'
                placeholder='Enter your password'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-[#1E240A] mb-2' htmlFor='confirmPassword'>
                Confirm Password
              </label>
              <input
                id='confirmPassword'
                name='confirmPassword'
                className='w-full px-4 py-3 border border-[#1E240A]/20 rounded-lg shadow-sm placeholder-[#1E240A]/50 bg-[#F6EEDF]/30 focus:ring-2 focus:ring-[#1E240A] focus:border-[#1E240A] transition-colors duration-200 text-[#1E240A]'
                value={formData.confirmPassword}
                onChange={handleChange}
                type='password'
                placeholder='Confirm your password'
                required
              />
            </div>

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
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
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
