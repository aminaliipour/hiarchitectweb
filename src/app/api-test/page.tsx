'use client';

import { useState } from 'react';

export default function ApiTestPage() {
  const [results, setResults] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testApi = async (apiPath: string, method: string = 'GET', body?: any) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const headers: any = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const options: RequestInit = {
        method,
        headers,
      };

      if (body && method !== 'GET') {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(apiPath, options);
      const data = await response.json();
      
      setResults(prev => prev + `\n=== ${method} ${apiPath} ===\n` + 
        `Status: ${response.status}\n` +
        `Response: ${JSON.stringify(data, null, 2)}\n\n`);
    } catch (error) {
      setResults(prev => prev + `\n=== ERROR ${method} ${apiPath} ===\n` + 
        `Error: ${error}\n\n`);
    } finally {
      setLoading(false);
    }
  };

  const runTests = async () => {
    setResults('شروع تست API...\n\n');
    
    // Test health
    await testApi('/api/health');
    
    // Test categories
    await testApi('/api/projects/categories');
    
    // Test projects folders
    await testApi('/api/projects/folders');
    
    // Test auth (if token exists)
    const token = localStorage.getItem('adminToken');
    if (token) {
      setResults(prev => prev + `Token found: ${token.substring(0, 20)}...\n\n`);
      
      // Test create project
      await testApi('/api/projects', 'POST', {
        title: 'پروژه تست',
        slug: 'test-project-' + Date.now(),
        description: 'این یک پروژه تست است',
        category_id: 'maskooni',
        status: 'draft'
      });
    } else {
      setResults(prev => prev + 'No auth token found. Please login first.\n\n');
    }
  };

  const clearResults = () => {
    setResults('');
  };

  const loginTest = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@hiarchi.com',
          password: 'admin123456'
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.token) {
        localStorage.setItem('adminToken', data.token);
        setResults(prev => prev + `Login successful! Token stored.\n\n`);
      } else {
        setResults(prev => prev + `Login failed: ${JSON.stringify(data)}\n\n`);
      }
    } catch (error) {
      setResults(prev => prev + `Login error: ${error}\n\n`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">API تست</h1>
      
      <div className="space-y-4 mb-8">
        <button 
          onClick={loginTest}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'در حال تست...' : 'تست لاگین'}
        </button>
        
        <button 
          onClick={runTests}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50 ml-2"
        >
          {loading ? 'در حال تست...' : 'تست API ها'}
        </button>
        
        <button 
          onClick={clearResults}
          className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
        >
          پاک کردن نتایج
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <h2 className="font-semibold mb-2">نتایج:</h2>
        <pre className="whitespace-pre-wrap text-sm max-h-96 overflow-y-auto">
          {results}
        </pre>
      </div>
    </div>
  );
}
