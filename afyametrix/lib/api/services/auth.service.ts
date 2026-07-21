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
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    verified: boolean;
  };
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface SignupResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    verified: boolean;
  };
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  new_password: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
}

export interface VerifyEmailResponse {
  message: string;
}

class AuthService {
  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<User> {
    const response = await fetch(`${config.api.baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }

    const data: LoginResponse = await response.json();
    
    // Store auth data
    this.storeAuthData(data);

    // Return user in expected format
    return {
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      role: data.user.role as UserRole,
    };
  }

  /**
   * Signup new user
   */
  async signup(data: SignupRequest): Promise<SignupResponse> {
    const response = await fetch(`${config.api.baseUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Registration failed');
    }

    return response.json();
  }

  /**
   * Request password reset
   */
  async forgotPassword(
    data: ForgotPasswordRequest
  ): Promise<ForgotPasswordResponse> {
    const response = await fetch(`${config.api.baseUrl}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Password reset failed');
    }

    return response.json();
  }

  /**
   * Reset password with token
   */
  async resetPassword(
    data: ResetPasswordRequest
  ): Promise<ResetPasswordResponse> {
    const response = await fetch(`${config.api.baseUrl}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Password reset failed');
    }

    return response.json();
  }

  /**
   * Verify email with token
   */
  async verifyEmail(data: VerifyEmailRequest): Promise<VerifyEmailResponse> {
    const response = await fetch(`${config.api.baseUrl}/auth/verify-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Email verification failed');
    }

    return response.json();
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    this.clearAuthData();
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    const token = this.getStoredToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${config.api.baseUrl}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.clearAuthData();
        throw new Error('Session expired');
      }
      const error = await response.json();
      throw new Error(error.detail || 'Failed to get user profile');
    }

    const userData = await response.json();
    return {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role as UserRole,
    };
  }

  /**
   * Store authentication data
   */
  private storeAuthData(response: LoginResponse): void {
    setToStorage(config.auth.tokenKey, response.access_token);
    setToStorage(config.auth.userKey, {
      id: response.user.id,
      name: response.user.name,
      email: response.user.email,
      role: response.user.role,
    });
    
    // Set cookie for middleware (client-side only)
    if (typeof document !== 'undefined') {
      document.cookie = `afyametrix_token=${response.access_token}; path=/; max-age=${24 * 60 * 60}; SameSite=Lax`;
    }
  }

  /**
   * Get stored token
   */
  private getStoredToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(config.auth.tokenKey);
  }

  /**
   * Clear authentication data
   */
  private clearAuthData(): void {
    removeFromStorage(config.auth.tokenKey);
    removeFromStorage(config.auth.userKey);
    
    // Clear cookie (client-side only)
    if (typeof document !== 'undefined') {
      document.cookie = 'afyametrix_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem(config.auth.tokenKey);
    return !!token;
  }

  /**
   * Get stored user data
   */
  getStoredUser(): User | null {
    if (typeof window === 'undefined') return null;
    try {
      const userStr = localStorage.getItem(config.auth.userKey);
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }
}

export const authService = new AuthService();
