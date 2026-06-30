/**
 * API Client
 * Centralized HTTP client with authentication, error handling, and retry logic
 */

import { config, getApiUrl } from "../config";
import { getFromStorage, removeFromStorage } from "../utils";

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public data?: any
  ) {
    super(message);
    this.name = "APIError";
  }
}

export class NetworkError extends Error {
  constructor(message: string = "Network connection failed") {
    super(message);
    this.name = "NetworkError";
  }
}

export class AuthenticationError extends Error {
  constructor(message: string = "Authentication failed") {
    super(message);
    this.name = "AuthenticationError";
  }
}

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
  retryCount?: number;
}

class APIClient {
  private baseURL: string;

  constructor() {
    this.baseURL = config.api.baseUrl;
  }

  /**
   * Get authentication token
   */
  private getAuthToken(): string | null {
    return getFromStorage<string | null>(config.auth.tokenKey, null);
  }

  /**
   * Get default headers
   */
  private getHeaders(customHeaders?: HeadersInit): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Merge custom headers
    if (customHeaders) {
      if (customHeaders instanceof Headers) {
        customHeaders.forEach((value, key) => {
          headers[key] = value;
        });
      } else if (Array.isArray(customHeaders)) {
        customHeaders.forEach(([key, value]) => {
          headers[key] = value;
        });
      } else {
        Object.assign(headers, customHeaders);
      }
    }

    const token = this.getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Handle authentication errors
      if (response.status === 401) {
        removeFromStorage(config.auth.tokenKey);
        removeFromStorage(config.auth.userKey);
        throw new AuthenticationError(
          errorData.message || "Your session has expired. Please log in again."
        );
      }

      throw new APIError(
        errorData.message || `HTTP Error ${response.status}`,
        response.status,
        errorData
      );
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  /**
   * Retry logic for failed requests
   */
  private async retryRequest<T>(
    fn: () => Promise<T>,
    retryCount: number = 0
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (
        retryCount < config.api.retryAttempts &&
        error instanceof NetworkError
      ) {
        await new Promise((resolve) =>
          setTimeout(resolve, config.api.retryDelay * (retryCount + 1))
        );
        return this.retryRequest(fn, retryCount + 1);
      }
      throw error;
    }
  }

  /**
   * Make HTTP request
   */
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { requiresAuth = false, retryCount = 0, ...fetchOptions } = options;

    // Check if authentication is required but token is missing
    if (requiresAuth && !this.getAuthToken()) {
      throw new AuthenticationError("Authentication required");
    }

    const url = getApiUrl(endpoint);
    const headers = this.getHeaders(fetchOptions.headers);

    const requestFn = async () => {
      try {
        const response = await fetch(url, {
          ...fetchOptions,
          headers,
          signal: AbortSignal.timeout(config.api.timeout),
        });

        return this.handleResponse<T>(response);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          throw new NetworkError("Request timeout");
        }
        if (error instanceof TypeError) {
          throw new NetworkError("Network connection failed");
        }
        throw error;
      }
    };

    return this.retryRequest(requestFn, retryCount);
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "GET",
    });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "DELETE",
    });
  }

  /**
   * Upload file with multipart/form-data
   */
  async upload<T>(
    endpoint: string,
    formData: FormData,
    options?: RequestOptions
  ): Promise<T> {
    const { headers, ...restOptions } = options || {};
    
    // Remove Content-Type header to let browser set it with boundary
    const uploadHeaders = this.getHeaders(headers);
    delete uploadHeaders["Content-Type"];

    const url = getApiUrl(endpoint);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: uploadHeaders,
        body: formData,
        signal: AbortSignal.timeout(config.api.timeout * 2), // Double timeout for uploads
        ...restOptions,
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new NetworkError("Upload timeout");
      }
      if (error instanceof TypeError) {
        throw new NetworkError("Network connection failed");
      }
      throw error;
    }
  }
}

// Export singleton instance
export const apiClient = new APIClient();
