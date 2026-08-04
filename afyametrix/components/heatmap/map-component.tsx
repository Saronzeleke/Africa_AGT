"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

// Import Leaflet CSS
import "leaflet/dist/leaflet.css";

// Fix for default markers in react-leaflet
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

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
  [key: string]: any;
}

interface MapComponentProps {
  regions: RegionData[];
  className?: string;
}

// Component to fit map bounds to show all regions
function MapBounds({ regions }: { regions: RegionData[] }) {
  const map = useMap();

  useEffect(() => {
    if (regions.length > 0) {
      const validRegions = regions.filter(r => r.latitude && r.longitude);
      if (validRegions.length > 0) {
        const bounds = validRegions.map(region => [region.latitude!, region.longitude!] as [number, number]);
        if (bounds.length === 1) {
          map.setView(bounds[0], 6);
        } else {
          map.fitBounds(bounds, { padding: [20, 20] });
        }
      }
    }
  }, [map, regions]);

  return null;
}

export default function MapComponent({ regions, className = "" }: MapComponentProps) {
  // Risk-based styling
  const getRiskColor = (region: RegionData): string => {
    const riskLevel = region.risk_level?.toLowerCase() || 
      (region.risk_score && region.risk_score >= 7 ? 'high' : 
       region.risk_score && region.risk_score >= 4 ? 'medium' : 'low');
    
    switch (riskLevel) {
      case 'high': return '#dc2626'; // red-600
      case 'medium': return '#d97706'; // amber-600
      case 'low': return '#16a34a'; // green-600
      default: return '#6b7280'; // gray-500
    }
  };

  const getRiskRadius = (region: RegionData): number => {
    const baseRadius = 8;
    const population = region.population || 1000;
    const riskScore = region.risk_score || 1;
    const populationFactor = Math.log(population) / Math.log(10000);
    const riskFactor = riskScore / 10;
    return Math.max(5, baseRadius + populationFactor * 5 + riskFactor * 10);
  };

  // Default center (Ethiopia approximate center)
  const defaultCenter: [number, number] = [9.1450, 40.4897];

  return (
    <div className={`relative ${className}`}>
      <MapContainer
        center={defaultCenter}
        zoom={6}
        scrollWheelZoom={true}
        className="h-96 w-full rounded-lg"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapBounds regions={regions} />
        
        {regions.map((region, index) => {
          // Validate coordinates
          const lat = region.latitude || 0;
          const lng = region.longitude || 0;
          
          // Skip invalid coordinates
          if (lat === 0 && lng === 0) return null;
          
          return (
            <CircleMarker
              key={region.id || index}
              center={[lat, lng]}
              radius={getRiskRadius(region)}
              fillColor={getRiskColor(region)}
              color="#ffffff"
              weight={2}
              opacity={0.8}
              fillOpacity={0.7}
            >
              <Popup>
                <div className="min-w-48">
                  <h3 className="font-semibold text-lg mb-2">
                    {region.name || region.region_name || `Region ${index + 1}`}
                  </h3>
                  
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Risk Score:</span>
                      <span className="font-medium">{(region.risk_score || 0).toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Risk Level:</span>
                      <span className={`font-medium px-2 py-1 rounded text-xs ${
                        getRiskColor(region) === '#dc2626' ? 'bg-red-100 text-red-800' :
                        getRiskColor(region) === '#d97706' ? 'bg-amber-100 text-amber-800' :
                        getRiskColor(region) === '#16a34a' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {region.risk_level?.toUpperCase() || 
                          (region.risk_score && region.risk_score >= 7 ? 'HIGH' : 
                           region.risk_score && region.risk_score >= 4 ? 'MEDIUM' : 'LOW')}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cases:</span>
                      <span className="font-medium">{(region.cases || 0).toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Population:</span>
                      <span className="font-medium">{(region.population || 0).toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Coordinates:</span>
                      <span className="text-xs text-gray-500">{lat.toFixed(4)}, {lng.toFixed(4)}</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
      
      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-lg border z-[1000]">
        <h4 className="text-sm font-semibold mb-2">Risk Levels</h4>
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-red-600"></div>
            <span>High Risk (7.0+)</span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-amber-600"></div>
            <span>Medium Risk (4.0-6.9)</span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-green-600"></div>
            <span>Low Risk (0.0-3.9)</span>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Circle size = Population × Risk
          </p>
        </div>
      </div>
    </div>
  );
}