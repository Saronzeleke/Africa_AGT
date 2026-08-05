"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function DebugPage() {
  const [results, setResults] = useState<string[]>([]);
  
  const addResult = (message: string) => {
    setResults(prev => [`${new Date().toLocaleTimeString()}: ${message}`, ...prev]);
  };

  const testBackendConnection = async () => {
    addResult("🔍 Testing backend connection...");
    
    try {
      // Test 1: Backend health check
      const healthResponse = await fetch("http://127.0.0.1:8000/");
      addResult(`Health check: ${healthResponse.status} ${healthResponse.statusText}`);
      
      // Test 2: CORS preflight
      try {
        const corsTest = await fetch("http://127.0.0.1:8000/api/auth/login", {
          method: "OPTIONS"
        });
        addResult(`CORS preflight: ${corsTest.status} ${corsTest.statusText}`);
      } catch (error) {
        addResult(`❌ CORS Error: ${error}`);
      }
      
      // Test 3: Actual login attempt
      try {
        const loginResponse = await fetch("http://127.0.0.1:8000/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "test@test.com",
            password: "test123"
          })
        });
        
        const loginData = await loginResponse.text();
        addResult(`Login test: ${loginResponse.status} - ${loginData.substring(0, 100)}`);
      } catch (error) {
        addResult(`❌ Login Error: ${error}`);
      }
      
    } catch (error) {
      addResult(`❌ Connection Error: ${error}`);
    }
  };

  const testTokenStorage = () => {
    addResult("🔍 Testing token storage...");
    
    // Test localStorage
    const localToken = localStorage.getItem('afyametrix_token');
    addResult(`localStorage token: ${localToken ? 'EXISTS' : 'NOT FOUND'}`);
    
    // Test cookies
    const cookies = document.cookie;
    const hasTokenCookie = cookies.includes('afyametrix_token');
    addResult(`Cookie token: ${hasTokenCookie ? 'EXISTS' : 'NOT FOUND'}`);
    addResult(`All cookies: ${cookies || 'NONE'}`);
  };

  const clearAllAuth = () => {
    localStorage.removeItem('afyametrix_token');
    localStorage.removeItem('afyametrix_user');
    document.cookie = 'afyametrix_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    addResult("🗑️ Cleared all authentication data");
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">🔧 Production Debug Tool</h1>
      
      <div className="space-x-4 mb-6">
        <Button onClick={testBackendConnection}>
          Test Backend Connection
        </Button>
        <Button onClick={testTokenStorage}>
          Test Token Storage
        </Button>
        <Button onClick={clearAllAuth} variant="destructive">
          Clear Auth Data
        </Button>
        <Button onClick={() => setResults([])} variant="outline">
          Clear Log
        </Button>
      </div>

      <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
        {results.length === 0 ? (
          <div className="text-gray-500">Click a button to run tests...</div>
        ) : (
          results.map((result, index) => (
            <div key={index} className="mb-1">
              {result}
            </div>
          ))
        )}
      </div>
      
      <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
        <h3 className="font-bold text-yellow-800">Production Issues Found:</h3>
        <ul className="text-sm text-yellow-700 mt-2 space-y-1">
          <li>• CORS policy is blocking login API calls</li>
          <li>• Token is being lost during Next.js hot reloads</li>
          <li>• Authentication middleware dependency issues</li>
        </ul>
      </div>
    </div>
  );
}