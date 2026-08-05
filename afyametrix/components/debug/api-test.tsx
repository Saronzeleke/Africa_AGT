"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { config } from "@/lib/config";

export function APITest() {
  const [results, setResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const addResult = (message: string) => {
    setResults(prev => [`${new Date().toLocaleTimeString()}: ${message}`, ...prev.slice(0, 19)]);
  };

  const testNarrativeAPI = async () => {
    setIsLoading(true);
    addResult("🧪 Testing Narrative API with correct token...");
    
    try {
      const token = localStorage.getItem(config.auth.tokenKey);
      
      if (!token) {
        addResult("❌ No token found. Please log in first.");
        return;
      }

      addResult(`🔑 Token found: ${token.substring(0, 20)}...`);
      
      // Test 1: Country overview
      addResult("📍 Testing country overview...");
      const countryResponse = await fetch("http://127.0.0.1:8000/api/health-intelligence/narrative?country=Ethiopia", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      addResult(`📊 Country API: ${countryResponse.status} ${countryResponse.statusText}`);
      
      if (countryResponse.ok) {
        const countryData = await countryResponse.json();
        addResult(`✅ Country data keys: ${Object.keys(countryData).join(', ')}`);
        
        if (countryData.available_regions?.length > 0) {
          addResult(`🗺️ Available regions: ${countryData.available_regions.length}`);
          
          // Test 2: Region detail (if regions available)
          const testRegion = countryData.available_regions[0];
          addResult(`🎯 Testing region detail: ${testRegion}...`);
          
          const regionResponse = await fetch(
            `http://127.0.0.1:8000/api/health-intelligence/narrative?country=Ethiopia&region=${encodeURIComponent(testRegion)}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          addResult(`📊 Region API: ${regionResponse.status} ${regionResponse.statusText}`);
          
          if (regionResponse.ok) {
            const regionData = await regionResponse.json();
            addResult(`✅ Region data keys: ${Object.keys(regionData).join(', ')}`);
            addResult(`📈 Risk score: ${regionData.risk_score || 'N/A'}`);
          } else {
            const errorData = await regionResponse.text();
            addResult(`❌ Region error: ${errorData.substring(0, 100)}`);
          }
        }
      } else {
        const errorData = await countryResponse.text();
        addResult(`❌ Country error: ${errorData.substring(0, 100)}`);
      }
      
    } catch (error) {
      addResult(`💥 Network Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <Card className="p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">🔧 Production API Test</h3>
        <Button 
          onClick={testNarrativeAPI} 
          disabled={isLoading}
          size="sm"
        >
          {isLoading ? "Testing..." : "Test Narrative API"}
        </Button>
      </div>
      
      <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-xs max-h-48 overflow-y-auto">
        {results.length === 0 ? (
          <div className="text-gray-500">Click "Test Narrative API" to verify backend integration...</div>
        ) : (
          results.map((result, index) => (
            <div key={index} className="mb-1">
              {result}
            </div>
          ))
        )}
      </div>
    </Card>
  );
}