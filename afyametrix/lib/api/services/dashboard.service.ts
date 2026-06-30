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
}

export interface TrendsDataResponse {
  trends: Array<{
    date: string;
    count: number;
    disease: string;
  }>;
  forecast?: Array<{
    date: string;
    predicted: number;
    confidence: number;
  }>;
}

export interface HeatmapDataParams {
  diseaseType?: string;
  startDate?: string;
  endDate?: string;
}

export interface HeatmapDataResponse {
  locations: Array<{
    latitude: number;
    longitude: number;
    count: number;
    location: string;
    disease: string;
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
    return apiClient.get<DashboardDataResponse>("/dashboard", {
      requiresAuth: true,
    });
  }

  /**
   * Get dashboard statistics
   */
  async getStats(): Promise<DashboardStats> {
    return apiClient.get<DashboardStats>("/dashboard/stats", {
      requiresAuth: true,
    });
  }

  /**
   * Get disease breakdown
   */
  async getDiseaseBreakdown(): Promise<DiseaseStats[]> {
    return apiClient.get<DiseaseStats[]>("/dashboard/diseases", {
      requiresAuth: true,
    });
  }

  /**
   * Get recent case entries
   */
  async getRecentEntries(limit: number = 10): Promise<CaseEntry[]> {
    return apiClient.get<CaseEntry[]>(
      `/dashboard/recent?limit=${limit}`,
      {
        requiresAuth: true,
      }
    );
  }

  /**
   * Get alerts
   */
  async getAlerts(unreadOnly: boolean = false): Promise<Alert[]> {
    const endpoint = `/dashboard/alerts${
      unreadOnly ? "?unreadOnly=true" : ""
    }`;
    return apiClient.get<Alert[]>(endpoint, { requiresAuth: true });
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
   * Get trends data
   */
  async getTrends(params: TrendsDataParams): Promise<TrendsDataResponse> {
    const queryParams = new URLSearchParams({
      startDate: params.startDate,
      endDate: params.endDate,
      ...(params.diseaseType && { diseaseType: params.diseaseType }),
      ...(params.location && { location: params.location }),
    });

    return apiClient.get<TrendsDataResponse>(
      `/dashboard/trends?${queryParams.toString()}`,
      { requiresAuth: true }
    );
  }

  /**
   * Get heatmap data
   */
  async getHeatmapData(
    params?: HeatmapDataParams
  ): Promise<HeatmapDataResponse> {
    const queryParams = new URLSearchParams();

    if (params?.diseaseType) {
      queryParams.append("diseaseType", params.diseaseType);
    }
    if (params?.startDate) {
      queryParams.append("startDate", params.startDate);
    }
    if (params?.endDate) {
      queryParams.append("endDate", params.endDate);
    }

    const endpoint = `/dashboard/heatmap${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    return apiClient.get<HeatmapDataResponse>(endpoint, {
      requiresAuth: true,
    });
  }

  /**
   * Get AI recommendations
   */
  async getRecommendations(): Promise<RecommendationsResponse> {
    return apiClient.get<RecommendationsResponse>(
      "/dashboard/recommendations",
      { requiresAuth: true }
    );
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
