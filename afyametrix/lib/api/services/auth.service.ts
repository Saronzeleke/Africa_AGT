/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import { apiClient } from "../client";
import { User, UserRole } from "@/types";
import { config } from "@/lib/config";
import { setToStorage, removeFromStorage, getTokenFromStorage, setTokenToStorage } from "@/lib/utils";

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
    const response = await fetch(`${config.api.baseUrl}/api/auth/login`, {
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
    const response = await fetch(`${config.api.baseUrl}/api/auth/register`, {
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
    const response = await fetch(`${config.api.baseUrl}/api/auth/forgot-password`, {
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
    const response = await fetch(`${config.api.baseUrl}/api/auth/reset-password`, {
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
    const response = await fetch(`${config.api.baseUrl}/api/auth/verify-email`, {
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
    return apiClient.get('/api/auth/me', { requiresAuth: true });
  }

  /**
   * Store authentication data
   */
  private storeAuthData(response: LoginResponse): void {
    // Store token in localStorage (primary storage for API calls)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(config.auth.tokenKey, response.access_token);
      console.log(`✅ Token stored in localStorage: ${config.auth.tokenKey}`);
    }
    
    // Store user data
    setToStorage(config.auth.userKey, {
      id: response.user.id,
      name: response.user.name,
      email: response.user.email,
      role: response.user.role,
    });
    
    // Set cookie for middleware
    if (typeof document !== 'undefined') {
      document.cookie = `afyametrix_token=${response.access_token}; path=/; max-age=${24 * 60 * 60}; SameSite=Lax`;
      console.log(`✅ Token stored in cookie for middleware`);
    }
  }

  /**
   * Get stored token
   */
  private getStoredToken(): string | null {
    if (typeof window === 'undefined') return null;
    
    try {
      return window.localStorage.getItem(config.auth.tokenKey);
    } catch (error) {
      console.error(`Error reading token from localStorage:`, error);
      return null;
    }
  }

  /**
   * Clear authentication data
   */
  private clearAuthData(): void {
    // Remove token
    if (typeof window !== 'undefined') {
      localStorage.removeItem(config.auth.tokenKey);
    }
    
    // Remove user data
    removeFromStorage(config.auth.userKey);
    
    // Clear cookie
    if (typeof document !== 'undefined') {
      document.cookie = 'afyametrix_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      const token = window.localStorage.getItem(config.auth.tokenKey);
      if (!token || token === 'null' || token === 'undefined') {
        return false;
      }
      
      // Basic JWT expiration check
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const isExpired = payload.exp <= Date.now() / 1000;
        if (isExpired) {
          console.log('🚫 Token expired, clearing auth data');
          this.clearAuthData();
          return false;
        }
        return true;
      } catch (error) {
        console.error('Invalid token format:', error);
        this.clearAuthData();
        return false;
      }
    } catch (error) {
      return false;
    }
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
