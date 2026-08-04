"use client";

import { Card } from "@/components/ui/card";
import { BackButton } from "@/components/ui/back-button";
import { MapPin, TrendingUp, Users, AlertTriangle } from "lucide-react";
import { useHeatmap } from "@/lib/hooks/useDashboard";
import { InteractiveMap } from "@/components/heatmap/interactive-map";

export default function HeatmapPage() {
  const { regions, isLoading, error } = useHeatmap();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <BackButton fallbackUrl="/dashboard" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Disease Risk Heatmap</h1>
          <p className="text-sm text-gray-600">Real-time risk assessment by region</p>
        </div>
        <Card className="p-8">
          <div className="text-center">Loading heatmap data...</div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <BackButton fallbackUrl="/dashboard" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Disease Risk Heatmap</h1>
          <p className="text-sm text-gray-600">Real-time risk assessment by region</p>
        </div>
        <Card className="p-8">
          <div className="text-center text-red-600">
            Error loading heatmap data: {error.message}
          </div>
        </Card>
      </div>
    );
  }

  const getRiskColor = (riskLevel: string | undefined) => {
    if (!riskLevel) return 'bg-gray-500';
    switch (riskLevel.toLowerCase()) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskTextColor = (riskLevel: string | undefined) => {
    if (!riskLevel) return 'text-gray-700';
    switch (riskLevel.toLowerCase()) {
      case 'high': return 'text-red-700';
      case 'medium': return 'text-yellow-700';
      case 'low': return 'text-green-700';
      default: return 'text-gray-700';
    }
  };

  const getRiskLevel = (region: any): string => {
    // Handle different possible property names for risk level
    if (region.risk_level) return region.risk_level;
    if (region.riskLevel) return region.riskLevel;
    if (region.level) return region.level;
    
    // Calculate risk level from risk_score if available
    if (typeof region.risk_score === 'number') {
      if (region.risk_score >= 7) return 'high';
      if (region.risk_score >= 4) return 'medium';
      return 'low';
    }
    
    return 'unknown';
  };

  return (
    <div className="space-y-6">
      <BackButton fallbackUrl="/dashboard" />
      
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Disease Risk Heatmap</h1>
        <p className="text-sm text-gray-600">
          Real-time risk assessment across {regions.length} regions
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">High Risk</p>
              <p className="text-xl font-bold">
                {Array.isArray(regions) ? regions.filter(r => getRiskLevel(r).toLowerCase() === 'high').length : 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Medium Risk</p>
              <p className="text-xl font-bold">
                {Array.isArray(regions) ? regions.filter(r => getRiskLevel(r).toLowerCase() === 'medium').length : 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <MapPin className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Low Risk</p>
              <p className="text-xl font-bold">
                {Array.isArray(regions) ? regions.filter(r => getRiskLevel(r).toLowerCase() === 'low').length : 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Population</p>
              <p className="text-xl font-bold">
                {Array.isArray(regions) ? regions.reduce((sum, r) => sum + (r.population || 0), 0).toLocaleString() : '0'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Regions List */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Risk Assessment by Region</h2>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {Array.isArray(regions) && regions.length > 0 ? regions
            .sort((a, b) => (b.risk_score || 0) - (a.risk_score || 0))
            .map((region, index) => {
              const riskLevel = getRiskLevel(region);
              return (
                <div key={region.id || index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getRiskColor(riskLevel)}`} />
                    <div>
                      <h3 className="font-medium">{region.name || region.region_name || `Region ${index + 1}`}</h3>
                      <p className="text-sm text-gray-600">
                        {region.cases || 0} cases • Population: {(region.population || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${getRiskTextColor(riskLevel)}`}>
                      {riskLevel.toUpperCase()}
                    </div>
                    <div className="text-xs text-gray-500">
                      Score: {(region.risk_score || 0).toFixed(2)}
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="text-center py-8 text-gray-500">
                No region data available
              </div>
            )}
        </div>
      </Card>

      {/* Interactive Map */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Disease Risk Heatmap</h2>
        {isLoading ? (
          <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-gray-600">Loading map data...</p>
            </div>
          </div>
        ) : error ? (
          <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-600">Error loading map: {(error as Error)?.message || 'Unknown error'}</p>
            </div>
          </div>
        ) : (
          <InteractiveMap regions={regions} />
        )}
      </Card>
    </div>
  );
}
