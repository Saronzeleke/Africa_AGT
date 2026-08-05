"use client";

import { useEffect, useState } from "react";
import { config } from "@/lib/config";
import { authService } from "@/lib/api/services/auth.service";

export function AuthDebug() {
  const [debugInfo, setDebugInfo] = useState({
    hasToken: false,
    tokenPreview: "",
    isAuthenticated: false,
    localStorageToken: "",
    cookieToken: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(config.auth.tokenKey);
      const cookieMatch = document.cookie.match(`afyametrix_token=([^;]+)`);
      
      setDebugInfo({
        hasToken: !!token,
        tokenPreview: token ? `${token.substring(0, 20)}...` : "None",
        isAuthenticated: authService.isAuthenticated(),
        localStorageToken: token || "Not found",
        cookieToken: cookieMatch ? `${cookieMatch[1].substring(0, 20)}...` : "Not found",
      });
    }
  }, []);

  const testApiCall = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/health-intelligence/dashboard", {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem(config.auth.tokenKey)}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // API call successful
      } else {
        // API call failed
      }
    } catch (error) {
      // Network error
    }
  };

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">🔍 Auth Debug</h3>
      <div className="space-y-1">
        <p><strong>Has Token:</strong> {debugInfo.hasToken ? "✅" : "❌"}</p>
        <p><strong>Preview:</strong> {debugInfo.tokenPreview}</p>
        <p><strong>Authenticated:</strong> {debugInfo.isAuthenticated ? "✅" : "❌"}</p>
        <p><strong>localStorage:</strong> {debugInfo.localStorageToken}</p>
        <p><strong>Cookie:</strong> {debugInfo.cookieToken}</p>
      </div>
      <button 
        onClick={testApiCall}
        className="mt-2 px-2 py-1 bg-blue-500 text-white rounded text-xs"
      >
        Test API Call
      </button>
    </div>
  );
}