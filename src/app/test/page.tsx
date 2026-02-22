"use client";

import { useState } from 'react';

export default function TestPage() {
  const [result, setResult] = useState<string>('');

  const testAPI = async (endpoint: string) => {
    try {
      setResult('در حال بررسی...');
      const response = await fetch(endpoint);
      const data = await response.json();
      setResult(`${endpoint}:\nStatus: ${response.status}\nResponse: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      setResult(`خطا در ${endpoint}: ${error}`);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Test</h1>
      
      <div className="space-y-4 mb-8">
        <button
          onClick={() => testAPI('/api/health')}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          Test Database Health
        </button>
        
        <button
          onClick={() => testAPI('/api/projects')}
          className="bg-green-500 text-white px-4 py-2 rounded mr-2"
        >
          Test Projects API
        </button>

        <button
          onClick={() => testAPI('/api/projects/categories')}
          className="bg-purple-500 text-white px-4 py-2 rounded mr-2"
        >
          Test Categories API
        </button>
      </div>

      {result && (
        <div className="bg-gray-100 p-4 rounded border">
          <pre className="text-sm overflow-auto">{result}</pre>
        </div>
      )}
    </div>
  );
}
