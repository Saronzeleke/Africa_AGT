/**
 * Application Configuration
 * Centralized configuration for environment variables and app settings
 */

export const config = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || "AfyaMetrix",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    environment: process.env.NODE_ENV || "development",
  },
  
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
  },
  
  auth: {
    tokenKey: "afyametrix_token",
    refreshTokenKey: "afyametrix_refresh_token",
    userKey: "afyametrix_user",
    tokenExpiry: 24 * 60 * 60 * 1000, // 24 hours
  },
  
  storage: {
    caseEntriesKey: "afyametrix_case_entries",
    draftsKey: "afyametrix_drafts",
    syncQueueKey: "afyametrix_sync_queue",
    lastSyncKey: "afyametrix_last_sync",
  },
  
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedImageTypes: ["image/jpeg", "image/png", "image/jpg", "image/webp"],
    allowedDocTypes: ["application/pdf"],
    maxFiles: 5,
  },
  
  features: {
    offlineMode: process.env.NEXT_PUBLIC_ENABLE_OFFLINE_MODE !== "false",
    photosEnabled: process.env.NEXT_PUBLIC_ENABLE_PHOTOS !== "false",
    aiRecommendations: process.env.NEXT_PUBLIC_ENABLE_AI_RECOMMENDATIONS === "true",
    heatmapEnabled: process.env.NEXT_PUBLIC_ENABLE_HEATMAP !== "false",
    exportEnabled: process.env.NEXT_PUBLIC_ENABLE_EXPORT === "true",
  },
} as const;

/**
 * Check if app is in production
 */
export const isProduction = config.app.environment === "production";

/**
 * Check if app is in development
 */
export const isDevelopment = config.app.environment === "development";

/**
 * Get full API URL
 */
export function getApiUrl(endpoint: string): string {
  const baseUrl = config.api.baseUrl.endsWith("/")
    ? config.api.baseUrl.slice(0, -1)
    : config.api.baseUrl;
  
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  
  const fullUrl = `${baseUrl}${path}`;
  
  // Debug logging in development
  if (isDevelopment) {
    console.log(`🌐 API URL: ${fullUrl}`);
  }
  
  return fullUrl;
}
