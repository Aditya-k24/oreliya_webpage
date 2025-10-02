'use client';

import { useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function AuthTestPage() {
  const { data: session, status } = useSession();
  const [testResults, setTestResults] = useState<any[]>([]);

  const testCredentials = [
    { email: 'admin@oreliya.com', password: 'admin123', role: 'admin' },
    { email: 'user@oreliya.com', password: 'user123', role: 'user' },
    { email: 'johndoe@example.com', password: 'password123', role: 'user' },
  ];

  const runAuthTest = async (credentials: any) => {
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
    }
  };

  const runAllTests = async () => {
    setTestResults([]);
    for (const cred of testCredentials) {
      await runAuthTest(cred);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between tests
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Authentication Test Page</h1>
      
      <div className="mb-8 p-4 border rounded-md bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">Current Session Status</h2>
        <p>Status: {status}</p>
        <p>Authenticated: {session ? 'Yes' : 'No'}</p>
        {session && (
          <>
            <p>User ID: {(session.user as any)?.id}</p>
            <p>User Email: {(session.user as any)?.email}</p>
            <p>User Name: {(session.user as any)?.name}</p>
            <p>User Role: {(session.user as any)?.role}</p>
          </>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Test Credentials</h2>
        <div className="space-y-2">
          {testCredentials.map((cred, index) => (
            <div key={index} className="flex items-center space-x-4 p-2 border rounded">
              <span className="font-mono text-sm">{cred.email}</span>
              <span className="text-sm text-gray-600">({cred.role})</span>
              <button
                onClick={() => runAuthTest(cred)}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
              >
                Test Login
              </button>
            </div>
          ))}
        </div>
        
        <button
          onClick={runAllTests}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
        >
          Run All Tests
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Test Results</h2>
        {testResults.length === 0 ? (
          <p className="text-gray-500">No tests run yet</p>
        ) : (
          <div className="space-y-2">
            {testResults.map((result, index) => (
              <div key={index} className="p-3 border rounded">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{result.email}</p>
                    <p className="text-sm text-gray-600">Expected: {result.expectedRole}</p>
                    <p className="text-sm text-gray-500">Time: {result.timestamp}</p>
                  </div>
                  <div className="text-right">
                    {result.result?.error ? (
                      <span className="text-red-600">❌ Failed</span>
                    ) : result.result?.ok ? (
                      <span className="text-green-600">✅ Success</span>
                    ) : (
                      <span className="text-yellow-600">⚠️ Unknown</span>
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