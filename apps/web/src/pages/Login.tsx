import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const { login, signup, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        await login({ email: formData.email, password: formData.password });
        navigate(from, { replace: true });
      } else {
        await signup(formData);
        // After successful signup, switch to login mode
        setIsLogin(true);
        setFormData({ email: '', password: '', firstName: '', lastName: '' });
      }
    } catch (err) {
      // Error is handled by the auth context
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // TODO: implement route or modal
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ email: '', password: '', firstName: '', lastName: '' });
    clearError();
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white'>
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600 dark:text-gray-400'>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              type='button'
              onClick={toggleMode}
              className='font-medium text-[color:var(--oreliya-gold)] hover:opacity-80 underline'
            >
              {isLogin ? 'Sign up here' : 'Sign in here'}
            </button>
          </p>
        </div>

        <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
          {error && (
            <div className='bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg'>
              {error}
            </div>
          )}

          <div className='space-y-4'>
            {!isLogin && (
              <>
                <div>
                  <label
                    htmlFor='firstName'
                    id='firstName-label'
                    className='block text-sm font-medium text-gray-700 dark:text-gray-300'
                  >
                    First Name
                  </label>
                  <input
                    id='firstName'
                    name='firstName'
                    type='text'
                    autoComplete='given-name'
                    required={!isLogin}
                    value={formData.firstName}
                    onChange={handleChange}
                    className='input-field mt-1'
                    placeholder='Enter your first name'
                    aria-labelledby='firstName-label'
                  />
                </div>
                <div>
                  <label
                    htmlFor='lastName'
                    id='lastName-label'
                    className='block text-sm font-medium text-gray-700 dark:text-gray-300'
                  >
                    Last Name
                  </label>
                  <input
                    id='lastName'
                    name='lastName'
                    type='text'
                    autoComplete='family-name'
                    required={!isLogin}
                    value={formData.lastName}
                    onChange={handleChange}
                    className='input-field mt-1'
                    placeholder='Enter your last name'
                    aria-labelledby='lastName-label'
                  />
                </div>
              </>
            )}

            <div>
              <label
                htmlFor='email'
                id='email-label'
                className='block text-sm font-medium text-gray-700 dark:text-gray-300'
              >
                Email address
              </label>
              <input
                id='email'
                name='email'
                type='email'
                autoComplete='email'
                required
                value={formData.email}
                onChange={handleChange}
                className='input-field mt-1'
                placeholder='Enter your email'
                aria-labelledby='email-label'
              />
            </div>

            <div>
              <label
                htmlFor='password'
                id='password-label'
                className='block text-gray-700 dark:text-gray-300'
              >
                Password
              </label>
              <input
                id='password'
                name='password'
                type='password'
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                required
                value={formData.password}
                onChange={handleChange}
                className='input-field mt-1'
                placeholder='Enter your password'
                aria-labelledby='password-label'
              />
            </div>
          </div>

          {isLogin && (
            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <input
                  id='remember-me'
                  name='remember-me'
                  type='checkbox'
                  className='h-4 w-4 text-[color:var(--oreliya-gold)] focus:ring-[color:var(--oreliya-gold)] border-gray-300 rounded'
                  aria-labelledby='remember-me-label'
                />
                <label
                  htmlFor='remember-me'
                  id='remember-me-label'
                  className='ml-2 block text-sm text-gray-900 dark:text-gray-300'
                >
                  Remember me
                </label>
              </div>

              <div className='text-sm'>
                <button
                  type='button'
                  onClick={handleForgotPassword}
                  className='font-medium text-[color:var(--oreliya-gold)] hover:opacity-80 underline'
                >
                  Forgot your password?
                </button>
              </div>
            </div>
          )}

          <div>
            <button
              type='submit'
              disabled={isLoading}
              className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[color:var(--oreliya-gold)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[color:var(--oreliya-gold)] disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isLoading ? (
                <div className='flex items-center'>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2' />
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </div>
              ) : isLogin ? (
                'Sign in'
              ) : (
                'Create account'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
