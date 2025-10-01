'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

export default function AuthTestPage() {
  const { data: session, status } = useSession();
  const [apiCheck, setApiCheck] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth-check');
        const data = await response.json();
        setApiCheck(data);
      } catch (error) {
        setApiCheck({ error: 'Failed to check auth' });
      }
    };

    if (status !== 'loading') {
      checkAuth();
    }
  }, [status]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Authentication Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Client-side session */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Client-side Session</h2>
            <div className="space-y-2">
              <p><strong>Status:</strong> {status}</p>
              <p><strong>Authenticated:</strong> {session ? 'Yes' : 'No'}</p>
              {session && (
                <>
                  <p><strong>User ID:</strong> {(session.user as any)?.id}</p>
                  <p><strong>Email:</strong> {(session.user as any)?.email}</p>
                  <p><strong>Name:</strong> {(session.user as any)?.name}</p>
                  <p><strong>Role:</strong> {(session.user as any)?.role}</p>
                  <p><strong>Is Admin:</strong> {(session.user as any)?.role === 'admin' ? 'Yes' : 'No'}</p>
                </>
              )}
            </div>
          </div>

          {/* Server-side check */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Server-side Check</h2>
            <div className="space-y-2">
              {apiCheck ? (
                <>
                  <p><strong>Success:</strong> {apiCheck.success ? 'Yes' : 'No'}</p>
                  <p><strong>Message:</strong> {apiCheck.message}</p>
                  {apiCheck.user && (
                    <>
                      <p><strong>User ID:</strong> {apiCheck.user.id}</p>
                      <p><strong>Email:</strong> {apiCheck.user.email}</p>
                      <p><strong>Role:</strong> {apiCheck.user.role}</p>
                      <p><strong>Is Admin:</strong> {apiCheck.user.isAdmin ? 'Yes' : 'No'}</p>
                    </>
                  )}
                </>
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>
        </div>

        {/* Test credentials */}
        <div className="mt-8 bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Test Credentials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-900">Admin User</h3>
              <p className="text-sm text-gray-600">Email: admin@oreliya.com</p>
              <p className="text-sm text-gray-600">Password: admin123</p>
              <p className="text-sm text-gray-600">Role: admin</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Regular User</h3>
              <p className="text-sm text-gray-600">Email: user@oreliya.com</p>
              <p className="text-sm text-gray-600">Password: user123</p>
              <p className="text-sm text-gray-600">Role: user</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <a 
            href="/login" 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Go to Login
          </a>
          <a 
            href="/admin" 
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Try Admin Page
          </a>
        </div>
      </div>
    </div>
  );
}
