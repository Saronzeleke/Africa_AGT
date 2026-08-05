"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { BackButton } from "@/components/ui/back-button";
import { Button } from "@/components/ui/button";
import { DiseaseFilter } from "@/components/filters/disease-filter";
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowRight, 
  Filter, 
  RefreshCw,
  AlertTriangle,
  Activity,
  BarChart3,
  MapPin
} from "lucide-react";
import { useForecasts } from "@/lib/hooks/useDashboard";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";

export default function TrendsForecastPage() {
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [selectedDisease, setSelectedDisease] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<number>(30);

  const { forecasts, total, isLoading, error, refetch } = useForecasts();

  // Filter forecasts based on selected filters
  const filteredForecasts = forecasts.filter(forecast => {
    return (
      (selectedCountry === "all" || forecast.country === selectedCountry) &&
      (selectedDisease === "all" || forecast.disease === selectedDisease)
    );
  });

  // Get unique countries and diseases for filters
  const countries = Array.from(new Set(forecasts.map(f => f.country)));
  const diseases = Array.from(new Set(forecasts.map(f => f.disease)));

  // Utility functions (defined before usage)
  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "Increasing": return "#dc2626"; // red-600
      case "Decreasing": return "#16a34a"; // green-600
      case "Stable": return "#d97706"; // amber-600
      default: return "#6b7280"; // gray-500
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "Increasing": return <TrendingUp className="w-4 h-4" />;
      case "Decreasing": return <TrendingDown className="w-4 h-4" />;
      case "Stable": return <ArrowRight className="w-4 h-4" />;
      default: return <ArrowRight className="w-4 h-4" />;
    }
  };

  const getConfidenceLevel = (confidence: number) => {
    if (confidence >= 90) return { level: "High", color: "text-green-700 bg-green-100" };
    if (confidence >= 70) return { level: "Medium", color: "text-orange-700 bg-orange-100" };
    return { level: "Low", color: "text-red-700 bg-red-100" };
  };

  // Prepare chart data
  const forecastTrendData = filteredForecasts.map((forecast, index) => ({
    name: `${forecast.region}`,
    disease: forecast.disease,
    cases: forecast.forecast_avg_daily_cases,
    confidence: forecast.model_confidence_pct,
    trend: forecast.trend_direction,
    day: index + 1
  }));

  // Disease breakdown data
  const diseaseData = diseases.map(disease => {
    const diseaseCases = filteredForecasts
      .filter(f => f.disease === disease)
      .reduce((sum, f) => sum + f.forecast_avg_daily_cases, 0);
    
    return {
      name: disease,
      value: diseaseCases,
      cases: Math.round(diseaseCases)
    };
  });

  // Regional comparison data
  const regionalData = filteredForecasts
    .sort((a, b) => b.forecast_avg_daily_cases - a.forecast_avg_daily_cases)
    .slice(0, 10) // Top 10 regions
    .map(forecast => ({
      region: forecast.region,
      cases: forecast.forecast_avg_daily_cases,
      confidence: forecast.model_confidence_pct,
      trend: forecast.trend_direction,
      fill: getTrendColor(forecast.trend_direction)
    }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <BackButton fallbackUrl="/dashboard" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trends & Forecast</h1>
          <p className="text-sm text-gray-600">AI-powered disease forecasting and trend analysis</p>
        </div>
        <Card className="p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading forecast data...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <BackButton fallbackUrl="/dashboard" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trends & Forecast</h1>
          <p className="text-sm text-gray-600">AI-powered disease forecasting and trend analysis</p>
        </div>
        <Card className="p-8">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">Error loading forecast data: {error.message}</p>
            <Button onClick={() => refetch()} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BackButton fallbackUrl="/dashboard" />
      
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Trends & Forecast</h1>
        <p className="text-sm text-gray-600">
          AI-powered disease forecasting and trend analysis • {total} forecasts available
        </p>
      </div>

      {/* Filters Row */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          
          <select 
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Countries</option>
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>

          <DiseaseFilter
            value={selectedDisease}
            onChange={setSelectedDisease}
            context="forecasts"
            placeholder="All Forecast Diseases"
          />

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Forecast Period:</span>
            <div className="flex gap-1">
              {[7, 14, 30].map(days => (
                <Button
                  key={days}
                  variant={timeRange === days ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange(days)}
                >
                  {days}d
                </Button>
              ))}
            </div>
          </div>

          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </Card>

      {filteredForecasts.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Forecast Data Available</h3>
            <p className="text-gray-600 mb-4">
              {selectedDisease !== "all" 
                ? `No forecasts available for ${selectedDisease}. Only Meningitis, Cholera, and Dengue have forecast data.`
                : "No forecasts match the selected filters. Try adjusting your filter criteria."
              }
            </p>
            <p className="text-sm text-gray-500">
              <strong>Available forecast diseases:</strong> Meningitis, Cholera, Dengue
            </p>
          </div>
        </Card>
      ) : (
        <>
          {/* Forecast Trend Chart */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">
              {timeRange}-Day Disease Forecast Trends
            </h2>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecastTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: 'Predicted Daily Cases', angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    formatter={(value: any, name: any) => [
                      `${value} cases/day`, 
                      name === 'cases' ? 'Predicted Cases' : name
                    ]}
                    labelFormatter={(label) => `Region: ${label}`}
                  />
                  <Legend />
                  {diseases.map((disease, index) => (
                    <Line
                      key={disease}
                      type="monotone"
                      dataKey="cases"
                      data={forecastTrendData.filter(d => d.disease === disease)}
                      stroke={COLORS[index % COLORS.length]}
                      strokeWidth={2}
                      name={disease}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Summary Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Confidence Indicators */}
            <Card className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Model Confidence</h3>
                  <p className="text-sm text-gray-600">Average accuracy</p>
                </div>
              </div>
              <div className="space-y-2">
                {["High", "Medium", "Low"].map(level => {
                  const count = filteredForecasts.filter(f => {
                    const conf = getConfidenceLevel(f.model_confidence_pct);
                    return conf.level === level;
                  }).length;
                  
                  return (
                    <div key={level} className="flex justify-between items-center">
                      <span className="text-sm">{level}</span>
                      <span className="font-semibold">{count}</span>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Trend Direction Summary */}
            <Card className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Activity className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Trend Direction</h3>
                  <p className="text-sm text-gray-600">Disease trends</p>
                </div>
              </div>
              <div className="space-y-2">
                {["Increasing", "Decreasing", "Stable"].map(trend => {
                  const count = filteredForecasts.filter(f => f.trend_direction === trend).length;
                  
                  return (
                    <div key={trend} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span style={{ color: getTrendColor(trend) }}>
                          {getTrendIcon(trend)}
                        </span>
                        <span className="text-sm">{trend}</span>
                      </div>
                      <span className="font-semibold">{count}</span>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Total Predicted Cases */}
            <Card className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Total Predicted</h3>
                  <p className="text-sm text-gray-600">Daily cases</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {filteredForecasts.reduce((sum, f) => sum + f.forecast_avg_daily_cases, 0).toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">cases per day</p>
            </Card>

            {/* Regions Covered */}
            <Card className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MapPin className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Regions</h3>
                  <p className="text-sm text-gray-600">Coverage</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {new Set(filteredForecasts.map(f => f.region)).size}
              </div>
              <p className="text-xs text-gray-500 mt-1">regions monitored</p>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Disease Breakdown Chart */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Disease Breakdown</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={diseaseData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {diseaseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} cases/day`, 'Predicted Cases']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Regional Comparison Chart */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Regional Comparison (Top 10)</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regionalData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="region" type="category" width={80} />
                    <Tooltip 
                      formatter={(value: any) => [`${value} cases/day`, 'Predicted Cases']}
                    />
                    <Bar 
                      dataKey="cases" 
                      fill="#8884d8"
                    >
                      {regionalData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Detailed Forecasts Table */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Detailed Forecasts</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Region</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Disease</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Predicted Cases/Day</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Trend</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredForecasts.map((forecast, index) => {
                    const confidenceInfo = getConfidenceLevel(forecast.model_confidence_pct);
                    return (
                      <tr key={index} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-900 font-medium">
                          {forecast.region}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {forecast.disease}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900 font-semibold">
                          {forecast.forecast_avg_daily_cases.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <div className="flex items-center gap-2">
                            <span style={{ color: getTrendColor(forecast.trend_direction) }}>
                              {getTrendIcon(forecast.trend_direction)}
                            </span>
                            <span className="text-gray-900">{forecast.trend_direction}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="h-2 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                                style={{ width: `${forecast.model_confidence_pct}%` }}
                              />
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${confidenceInfo.color}`}>
                              {forecast.model_confidence_pct}% {confidenceInfo.level}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
