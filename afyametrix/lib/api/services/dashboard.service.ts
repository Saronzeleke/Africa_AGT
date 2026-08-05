/**
 * Dashboard Service
 * Handles all dashboard-related API calls
 */

import { apiClient } from "../client";
import { DashboardStats, DiseaseStats, CaseEntry } from "@/types";

export interface DashboardDataResponse {
  stats: DashboardStats;
  diseaseBreakdown: DiseaseStats[];
  recentEntries: CaseEntry[];
  alerts?: Alert[];
}

export interface Alert {
  id: string;
  type: "warning" | "info" | "error";
  title: string;
  message: string;
  disease?: string;
  location?: string;
  createdAt: string;
  isRead: boolean;
}

export interface TrendsDataParams {
  startDate: string;
  endDate: string;
  diseaseType?: string;
  location?: string;
  country?: string;
  region?: string;
}

export interface ForecastData {
  country: string;
  region: string;
  disease: string;
  forecast_avg_daily_cases: number;
  trend_direction: "Increasing" | "Decreasing" | "Stable";
  model_confidence_pct: number;
}

export interface TrendsDataResponse {
  total: number;
  forecasts: ForecastData[];
}

export interface HeatmapDataParams {
  diseaseType?: string;
  startDate?: string;
  endDate?: string;
}

export interface HeatmapDataResponse {
  regions: Array<{
    id?: number;
    name?: string;
    region_name?: string;
    latitude?: number;
    longitude?: number;
    risk_score?: number;
    population?: number;
    cases?: number;
    risk_level?: string;
    [key: string]: any; // Allow additional properties from API response
  }>;
}

export interface RecommendationsResponse {
  recommendations: Array<{
    id: string;
    type: "resource" | "alert" | "action";
    priority: "high" | "medium" | "low";
    title: string;
    description: string;
    actionable: boolean;
    createdAt: string;
  }>;
}

class DashboardService {
  /**
   * Get dashboard data
   */
  async getDashboardData(): Promise<DashboardDataResponse> {
    return apiClient.get<DashboardDataResponse>("/api/health-intelligence/dashboard", {
      requiresAuth: true,
    });
  }

  /**
   * Get dashboard statistics
   */
  async getStats(): Promise<DashboardStats> {
    return apiClient.get<DashboardStats>("/api/health-intelligence/dashboard", {
      requiresAuth: true,
    });
  }

  /**
   * Get disease breakdown
   */
  async getDiseaseBreakdown(): Promise<DiseaseStats[]> {
    const response = await apiClient.get<DiseaseStats[]>("/api/health-intelligence/diseases", {
      requiresAuth: true,
    });
    return Array.isArray(response) ? response : [];
  }

  /**
   * Get recent case entries
   */
  async getRecentEntries(limit: number = 10): Promise<CaseEntry[]> {
    const response = await apiClient.get<CaseEntry[]>(
      `/api/health-intelligence/recent?limit=${limit}`,
      {
        requiresAuth: true,
      }
    );
    return Array.isArray(response) ? response : [];
  }

  /**
   * Get alerts from health-intelligence
   */
  async getAlerts(unreadOnly: boolean = false): Promise<Alert[]> {
    const endpoint = `/api/health-intelligence/alerts${
      unreadOnly ? "?unreadOnly=true" : ""
    }`;
    const response = await apiClient.get<Alert[]>(endpoint, { requiresAuth: true });
    return Array.isArray(response) ? response : [];
  }

  /**
   * Sync offline data with server
   */
  async syncData(): Promise<void> {
    try {
      // Get pending items from localStorage
      const syncQueue = JSON.parse(localStorage.getItem('afyametrix_sync_queue') || '[]');
      
      if (syncQueue.length === 0) {
        return;
      }

      // Send to server
      await apiClient.post("/dashboard/sync", {
        items: syncQueue
      }, { requiresAuth: true });

      // Clear sync queue on success
      localStorage.setItem('afyametrix_sync_queue', '[]');
    } catch (error) {
      console.error('Sync failed:', error);
      throw error;
    }
  }

  /**
   * Mark alert as read
   */
  async markAlertAsRead(alertId: string): Promise<{ message: string }> {
    return apiClient.patch(
      `/dashboard/alerts/${alertId}/read`,
      {},
      { requiresAuth: true }
    );
  }

  /**
   * Mark all alerts as read
   */
  async markAllAlertsAsRead(): Promise<{ message: string; count: number }> {
    return apiClient.patch(
      "/dashboard/alerts/read-all",
      {},
      { requiresAuth: true }
    );
  }

  /**
   * Get forecasts data from health-intelligence
   */
  async getForecasts(params?: TrendsDataParams): Promise<TrendsDataResponse> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }

    const endpoint = `/api/health-intelligence/forecasts${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const response = await apiClient.get<TrendsDataResponse>(endpoint, { 
      requiresAuth: true 
    });

    return {
      total: response.total || 0,
      forecasts: Array.isArray(response.forecasts) ? response.forecasts : []
    };
  }

  /**
   * Get heatmap data from health-intelligence/risk-scores endpoint
   */
  async getHeatmapData(
    params?: HeatmapDataParams
  ): Promise<HeatmapDataResponse> {
    const response = await apiClient.get<any>("/api/health-intelligence/risk-scores", {
      requiresAuth: true,
    });
    
    // Handle multiple possible response structures from API
    let regions = [];
    
    if (response && Array.isArray(response)) {
      // Direct array response
      regions = response;
    } else if (response && response.regions && Array.isArray(response.regions)) {
      // Wrapped in regions property
      regions = response.regions;
    } else if (response && response.data && Array.isArray(response.data)) {
      // Wrapped in data property
      regions = response.data;
    } else if (response && typeof response === 'object') {
      // Find first array property
      const arrayKey = Object.keys(response).find(key => Array.isArray(response[key]));
      if (arrayKey) {
        regions = response[arrayKey];
      }
    }
    
    // Return in expected format
    return { regions };
  }

  /**
   * Get AI narrative recommendations from health-intelligence
   */
  async getNarrative(params?: { country?: string; region?: string }): Promise<any> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.country) queryParams.append('country', params.country);
      if (params?.region) queryParams.append('region', params.region);
      
      const endpoint = `/api/health-intelligence/narrative${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;
      
      const response: any = await apiClient.get(endpoint, { requiresAuth: true });
      
      // Ensure consistent response structure for production
      return {
        country: response?.country || params?.country || 'Unknown',
        region: response?.region || params?.region || null,
        narrative: response?.narrative || 'No narrative available',
        available_regions: Array.isArray(response?.available_regions) ? response.available_regions : [],
        high_risk_regions: Array.isArray(response?.high_risk_regions) ? response.high_risk_regions : [],
        country_stats: response?.country_stats || {
          average_risk: 0,
          total_regions: 0,
          total_cases: 0,
          high_risk_count: 0
        },
        metrics: response?.metrics || null,
        _meta: {
          endpoint_version: 'v1',
          response_type: response?.region ? 'region_detail' : 'country_overview',
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      // Production-grade error handling
      console.error('Narrative API Error:', error);
      
      // Return fallback data structure to prevent UI crashes
      return {
        country: params?.country || 'Unknown',
        region: params?.region || null,
        narrative: 'Health intelligence data is currently unavailable. Please try again later.',
        available_regions: [],
        high_risk_regions: [],
        country_stats: {
          average_risk: 0,
          total_regions: 0,
          total_cases: 0,
          high_risk_count: 0
        },
        metrics: null,
        _meta: {
          endpoint_version: 'v1',
          response_type: 'error_fallback',
          timestamp: new Date().toISOString(),
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      };
    }
  }

  /**
   * Get resource allocations from health-intelligence
   */
  async getResourceAllocations(): Promise<any> {
    const response = await apiClient.get("/api/health-intelligence/allocations", {
      requiresAuth: true,
    }) as any;
    return {
      total: response?.total || 0,
      allocations: Array.isArray(response?.allocations) ? response.allocations : []
    };
  }

  /**
   * Get cluster data from health-intelligence
   */
  async getClusters(): Promise<any> {
    const response = await apiClient.get("/api/health-intelligence/clusters", {
      requiresAuth: true,
    }) as any;
    return {
      clusters: Array.isArray(response?.clusters) ? response.clusters : []
    };
  }

  /**
   * Get AI recommendations from health-intelligence (legacy method)
   */
  async getRecommendations(): Promise<RecommendationsResponse> {
    return this.getNarrative();
  }

  /**
   * Export dashboard data
   */
  async exportData(
    format: "csv" | "excel" | "pdf",
    params?: {
      startDate?: string;
      endDate?: string;
      diseaseType?: string;
    }
  ): Promise<Blob> {
    const queryParams = new URLSearchParams({ format });

    if (params?.startDate) {
      queryParams.append("startDate", params.startDate);
    }
    if (params?.endDate) {
      queryParams.append("endDate", params.endDate);
    }
    if (params?.diseaseType) {
      queryParams.append("diseaseType", params.diseaseType);
    }

    const response = await fetch(
      `/dashboard/export?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("afyametrix_token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Export failed");
    }

    return response.blob();
  }
}

export const dashboardService = new DashboardService();
