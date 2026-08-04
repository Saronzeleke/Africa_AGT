"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import the map component with no SSR
const DynamicMap = dynamic(() => import("./map-component"), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-gray-600">Loading interactive map...</p>
      </div>
    </div>
  ),
});

interface RegionData {
  id?: number;
  name?: string;
  region_name?: string;
  latitude?: number;
  longitude?: number;
  risk_score?: number;
  population?: number;
  cases?: number;
  risk_level?: string;
  [key: string]: any; // Allow additional properties from API
}

interface InteractiveMapProps {
  regions: RegionData[];
  className?: string;
}

export function InteractiveMap({ regions, className = "" }: InteractiveMapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className={`h-96 bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-600">Initializing map...</p>
        </div>
      </div>
    );
  }

  if (regions.length === 0) {
    return (
      <div className={`h-96 bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center">
          <p className="text-gray-600">No region data available</p>
        </div>
      </div>
    );
  }

  return <DynamicMap regions={regions} className={className} />;
}