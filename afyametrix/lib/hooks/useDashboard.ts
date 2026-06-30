/**
 * useDashboard Hook
 * Custom hook for dashboard data operations
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { dashboardService } from "@/lib/api";
import type {
  TrendsDataParams,
  HeatmapDataParams,
} from "@/lib/api";

export function useDashboard() {
  const queryClient = useQueryClient();

  // Get complete dashboard data
  const {
    data: dashboardData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => dashboardService.getDashboardData(),
    staleTime: 60 * 1000, // 1 minute
  });

  return {
    stats: dashboardData?.stats,
    diseaseBreakdown: dashboardData?.diseaseBreakdown || [],
    recentEntries: dashboardData?.recentEntries || [],
    alerts: dashboardData?.alerts || [],
    isLoading,
    error,
    refetch,
  };
}

// Hook for dashboard stats only
export function useDashboardStats() {
  const {
    data: stats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: () => dashboardService.getStats(),
    staleTime: 30 * 1000, // 30 seconds
  });

  return {
    stats,
    isLoading,
    error,
  };
}

// Hook for disease breakdown
export function useDiseaseBreakdown() {
  const {
    data: diseases,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dashboard", "diseases"],
    queryFn: () => dashboardService.getDiseaseBreakdown(),
    staleTime: 60 * 1000, // 1 minute
  });

  return {
    diseases: diseases || [],
    isLoading,
    error,
  };
}

// Hook for recent entries
export function useRecentEntries(limit: number = 10) {
  const {
    data: entries,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dashboard", "recent", limit],
    queryFn: () => dashboardService.getRecentEntries(limit),
    staleTime: 30 * 1000, // 30 seconds
  });

  return {
    entries: entries || [],
    isLoading,
    error,
  };
}

// Hook for alerts
export function useAlerts(unreadOnly: boolean = false) {
  const queryClient = useQueryClient();

  const {
    data: alerts,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["dashboard", "alerts", unreadOnly],
    queryFn: () => dashboardService.getAlerts(unreadOnly),
    staleTime: 60 * 1000, // 1 minute
  });

  // Mark alert as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (alertId: string) => dashboardService.markAlertAsRead(alertId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard", "alerts"] });
    },
  });

  // Mark all alerts as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: () => dashboardService.markAllAlertsAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard", "alerts"] });
    },
  });

  return {
    alerts: alerts || [],
    unreadCount: alerts?.filter((a) => !a.isRead).length || 0,
    isLoading,
    error,
    refetch,

    markAsRead: markAsReadMutation.mutate,
    markAsReadAsync: markAsReadMutation.mutateAsync,
    isMarkingAsRead: markAsReadMutation.isPending,

    markAllAsRead: markAllAsReadMutation.mutate,
    markAllAsReadAsync: markAllAsReadMutation.mutateAsync,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
  };
}

// Hook for trends data
export function useTrends(params: TrendsDataParams) {
  const {
    data: trendsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dashboard", "trends", params],
    queryFn: () => dashboardService.getTrends(params),
    enabled: !!(params.startDate && params.endDate),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    trends: trendsData?.trends || [],
    forecast: trendsData?.forecast || [],
    isLoading,
    error,
  };
}

// Hook for heatmap data
export function useHeatmap(params?: HeatmapDataParams) {
  const {
    data: heatmapData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dashboard", "heatmap", params],
    queryFn: () => dashboardService.getHeatmapData(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    locations: heatmapData?.locations || [],
    isLoading,
    error,
  };
}

// Hook for AI recommendations
export function useRecommendations() {
  const {
    data: recommendationsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["dashboard", "recommendations"],
    queryFn: () => dashboardService.getRecommendations(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    recommendations: recommendationsData?.recommendations || [],
    isLoading,
    error,
    refetch,
  };
}

// Hook for data export
export function useExportData() {
  const exportMutation = useMutation({
    mutationFn: ({
      format,
      params,
    }: {
      format: "csv" | "excel" | "pdf";
      params?: {
        startDate?: string;
        endDate?: string;
        diseaseType?: string;
      };
    }) => dashboardService.exportData(format, params),
    onSuccess: (blob, variables) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `afyametrix-export-${Date.now()}.${variables.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
  });

  return {
    exportData: exportMutation.mutate,
    exportDataAsync: exportMutation.mutateAsync,
    isExporting: exportMutation.isPending,
    exportError: exportMutation.error,
  };
}
