'use client';

import { useState } from 'react';
import axios from 'axios';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

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
      await axios.post(`${API_BASE_URL}/auth/signup`, {
        firstName,
        lastName,
        email,
        password,
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
    <div className='max-w-md mx-auto bg-white p-8 shadow-sm border border-gray-100'>
      <h1 className='text-2xl font-semibold text-[#1E240A] mb-6'>
        Create account
      </h1>
      <form onSubmit={onSubmit} className='space-y-4'>
        <div>
          <label className='block text-sm mb-1' htmlFor='firstName'>
            First name
          </label>
          <input
            id='firstName'
            className='input-field'
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className='block text-sm mb-1' htmlFor='lastName'>
            Last name
          </label>
          <input
            id='lastName'
            className='input-field'
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className='block text-sm mb-1' htmlFor='email'>
            Email
          </label>
          <input
            id='email'
            className='input-field'
            type='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
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
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className='text-red-600 text-sm'>{error}</p>}
        <button type='submit' className='btn-primary w-full' disabled={loading}>
          {loading ? 'Creating…' : 'Create account'}
        </button>
      </form>
    </div>
  );
}
