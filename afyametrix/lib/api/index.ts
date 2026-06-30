/**
 * API Services Export
 * Centralized export for all API services
 */

export { apiClient, APIError, NetworkError, AuthenticationError } from "./client";
export { authService } from "./services/auth.service";
export { caseService } from "./services/case.service";
export { dashboardService } from "./services/dashboard.service";

// Re-export types
export type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
} from "./services/auth.service";

export type {
  CreateCaseRequest,
  CreateCaseResponse,
  BulkCreateCaseRequest,
  BulkCreateCaseResponse,
  UpdateCaseRequest,
  UpdateCaseResponse,
  GetCasesParams,
  GetCasesResponse,
  UploadPhotoRequest,
  UploadPhotoResponse,
} from "./services/case.service";

export type {
  DashboardDataResponse,
  Alert,
  TrendsDataParams,
  TrendsDataResponse,
  HeatmapDataParams,
  HeatmapDataResponse,
  RecommendationsResponse,
} from "./services/dashboard.service";
