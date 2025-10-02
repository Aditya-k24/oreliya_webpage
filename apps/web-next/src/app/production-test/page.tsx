'use client';

import { useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function ProductionLoginTest() {
  const { data: session, status } = useSession();
  const [testResults, setTestResults] = useState<Array<{
    email: string;
    expectedRole: string;
    result: any;
    timestamp: string;
  }>>([]);
  const [loading, setLoading] = useState(false);

  const testCredentials = [
    { email: 'admin@oreliya.com', password: 'admin123', role: 'admin' },
    { email: 'user@oreliya.com', password: 'user123', role: 'user' },
  ];

  const runLoginTest = async (credentials: { email: string; password: string; role: string }) => {
    setLoading(true);
    try {
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      });

      setTestResults(prev => [...prev, {
        email: credentials.email,
        expectedRole: credentials.role,
        result: result,
        timestamp: new Date().toLocaleTimeString(),
      }]);
    } catch (error) {
      setTestResults(prev => [...prev, {
        email: credentials.email,
        expectedRole: credentials.role,
        result: { error: 'Test failed' },
        timestamp: new Date().toLocaleTimeString(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Production Login Test</h1>
      
      <div className="mb-8 p-4 border rounded-md bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">Current Session Status</h2>
        <p><strong>Status:</strong> {status}</p>
        <p><strong>Authenticated:</strong> {session ? 'Yes' : 'No'}</p>
        {session && (
          <>
            <p><strong>User ID:</strong> {(session.user as any)?.id}</p>
            <p><strong>User Email:</strong> {(session.user as any)?.email}</p>
            <p><strong>User Name:</strong> {(session.user as any)?.name}</p>
            <p><strong>User Role:</strong> {(session.user as any)?.role}</p>
          </>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Test Login Credentials</h2>
        <div className="space-y-2">
        {testCredentials.map((cred) => (
          <div key={cred.email} className="flex items-center space-x-4 p-2 border rounded">
              <span className="font-mono text-sm">{cred.email}</span>
              <span className="text-sm text-gray-600">({cred.role})</span>
              <button
                type="button"
                onClick={() => runLoginTest(cred)}
                disabled={loading}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm disabled:opacity-50"
              >
                {loading ? 'Testing...' : 'Test Login'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Test Results</h2>
        {testResults.length === 0 ? (
          <p className="text-gray-500">No tests run yet</p>
        ) : (
          <div className="space-y-2">
            {testResults.map((result) => (
              <div key={`${result.email}-${result.timestamp}`} className="p-3 border rounded">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{result.email}</p>
                    <p className="text-sm text-gray-600">Expected: {result.expectedRole}</p>
                    <p className="text-sm text-gray-500">Time: {result.timestamp}</p>
                  </div>
                  <div className="text-right">
                    {result.result?.error ? (
                      <span className="text-red-600">❌ Failed</span>
                    ) : (
                      result.result?.ok ? (
                        <span className="text-green-600">✅ Success</span>
                      ) : (
                        <span className="text-yellow-600">⚠️ Unknown</span>
                      )
                    )}
                  </div>
                </div>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {JSON.stringify(result.result, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex space-x-4">
        {session ? (
          <button
            type="button"
            onClick={() => signOut()}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Sign Out
          </button>
        ) : (
          <p className="text-gray-500">Not signed in</p>
        )}
      </div>
    </div>
  );
}
