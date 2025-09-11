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
    router.push('/');
  };

  return (
    <div className='max-w-md mx-auto bg-white p-8 shadow-sm border border-gray-100'>
      <h1 className='text-2xl font-semibold text-[#1E240A] mb-6'>Login</h1>
      <form onSubmit={onSubmit} className='space-y-4'>
        <div>
          <label className='block text-sm mb-1' htmlFor='email'>
            Email
          </label>
          <input
            id='email'
            className='input-field'
            value={email}
            onChange={e => setEmail(e.target.value)}
            type='email'
            required
          />
        </div>
        <div>
          <label className='block text-sm mb-1' htmlFor='password'>
            Password
          </label>
          <input
            id='password'
            className='input-field'
            value={password}
            onChange={e => setPassword(e.target.value)}
            type='password'
            required
          />
        </div>
        {error && <p className='text-red-600 text-sm'>{error}</p>}
        <button type='submit' className='btn-primary w-full' disabled={loading}>
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
