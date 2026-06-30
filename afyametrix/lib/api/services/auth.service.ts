/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import { apiClient } from "../client";
import { User, UserRole } from "@/types";
import { config } from "@/lib/config";
import { setToStorage, removeFromStorage } from "@/lib/utils";

export interface LoginRequest {
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken?: string;
  expiresIn: number;
}

export interface SignupRequest {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  password: string;
  role: UserRole;
}

export interface SignupResponse {
  user: User;
  message: string;
  requiresVerification: boolean;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
  resetTokenSent: boolean;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
  success: boolean;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface VerifyEmailResponse {
  message: string;
  user: User;
  token?: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken?: string;
  expiresIn: number;
}

class AuthService {
  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      "/auth/login",
      credentials
    );

    // Store auth data
    this.storeAuthData(response);

    return response;
  }

  /**
   * Signup new user
   */
  async signup(data: SignupRequest): Promise<SignupResponse> {
    return apiClient.post<SignupResponse>("/auth/signup", data);
  }

  /**
   * Request password reset
   */
  async forgotPassword(
    data: ForgotPasswordRequest
  ): Promise<ForgotPasswordResponse> {
    return apiClient.post<ForgotPasswordResponse>(
      "/auth/forgot-password",
      data
    );
  }

  /**
   * Reset password with token
   */
  async resetPassword(
    data: ResetPasswordRequest
  ): Promise<ResetPasswordResponse> {
    return apiClient.post<ResetPasswordResponse>("/auth/reset-password", data);
  }

  /**
   * Verify email with token
   */
  async verifyEmail(data: VerifyEmailRequest): Promise<VerifyEmailResponse> {
    const response = await apiClient.post<VerifyEmailResponse>(
      "/auth/verify-email",
      data
    );

    // If token is provided, store it
    if (response.token) {
      setToStorage(config.auth.tokenKey, response.token);
      setToStorage(config.auth.userKey, response.user);
    }

    return response;
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<RefreshTokenResponse> {
    const refreshToken = localStorage.getItem(config.auth.refreshTokenKey);
    
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await apiClient.post<RefreshTokenResponse>(
      "/auth/refresh-token",
      { refreshToken }
    );

    // Update stored tokens
    setToStorage(config.auth.tokenKey, response.token);
    if (response.refreshToken) {
      setToStorage(config.auth.refreshTokenKey, response.refreshToken);
    }

    return response;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      // Call logout endpoint if available
      await apiClient.post("/auth/logout", {}, { requiresAuth: true });
    } catch (error) {
      // Ignore errors during logout
      console.error("Logout error:", error);
    } finally {
      // Always clear local data
      this.clearAuthData();
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>("/auth/me", { requiresAuth: true });
  }

  /**
   * Update user profile
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await apiClient.patch<User>("/auth/profile", data, {
      requiresAuth: true,
    });

    // Update stored user data
    setToStorage(config.auth.userKey, response);

    return response;
  }

  /**
   * Change password
   */
  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<{ message: string }> {
    return apiClient.post(
      "/auth/change-password",
      { currentPassword, newPassword },
      { requiresAuth: true }
    );
  }

  /**
   * Store authentication data
   */
  private storeAuthData(response: LoginResponse): void {
    setToStorage(config.auth.tokenKey, response.token);
    setToStorage(config.auth.userKey, response.user);
    
    if (response.refreshToken) {
      setToStorage(config.auth.refreshTokenKey, response.refreshToken);
    }
  }

  /**
   * Clear authentication data
   */
  private clearAuthData(): void {
    removeFromStorage(config.auth.tokenKey);
    removeFromStorage(config.auth.refreshTokenKey);
    removeFromStorage(config.auth.userKey);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem(config.auth.tokenKey);
    return !!token;
  }

  /**
   * Get stored user data
   */
  getStoredUser(): User | null {
    try {
      const userStr = localStorage.getItem(config.auth.userKey);
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }
}

export const authService = new AuthService();
