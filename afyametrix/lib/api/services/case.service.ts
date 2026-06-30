/**
 * Case Service
 * Handles all case entry-related API calls
 */

import { apiClient } from "../client";
import { CaseEntry, DraftEntry } from "@/types";
import { config } from "@/lib/config";

export interface CreateCaseRequest {
  diseaseType: string;
  cases: number;
  date: string;
  caseDetails?: string;
  comments?: string;
  photoIds?: string[]; // IDs of uploaded photos
}

export interface CreateCaseResponse {
  case: CaseEntry;
  message: string;
}

export interface BulkCreateCaseRequest {
  entries: CreateCaseRequest[];
}

export interface BulkCreateCaseResponse {
  cases: CaseEntry[];
  successCount: number;
  failureCount: number;
  errors?: Array<{ index: number; error: string }>;
}

export interface UpdateCaseRequest extends Partial<CreateCaseRequest> {
  id: string;
}

export interface UpdateCaseResponse {
  case: CaseEntry;
  message: string;
}

export interface GetCasesParams {
  page?: number;
  limit?: number;
  status?: "pending" | "synced";
  diseaseType?: string;
  startDate?: string;
  endDate?: string;
  workerId?: string;
}

export interface GetCasesResponse {
  cases: CaseEntry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UploadPhotoRequest {
  file: File;
  caseId?: string;
}

export interface UploadPhotoResponse {
  id: string;
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

export interface SyncQueueItem {
  id: string;
  type: "create" | "update" | "delete";
  data: any;
  timestamp: number;
  retryCount: number;
}

class CaseService {
  /**
   * Create a single case entry
   */
  async createCase(data: CreateCaseRequest): Promise<CreateCaseResponse> {
    return apiClient.post<CreateCaseResponse>("/cases", data, {
      requiresAuth: true,
    });
  }

  /**
   * Create multiple case entries (bulk)
   */
  async createCasesBulk(
    data: BulkCreateCaseRequest
  ): Promise<BulkCreateCaseResponse> {
    return apiClient.post<BulkCreateCaseResponse>("/cases/bulk", data, {
      requiresAuth: true,
    });
  }

  /**
   * Update a case entry
   */
  async updateCase(data: UpdateCaseRequest): Promise<UpdateCaseResponse> {
    const { id, ...updateData } = data;
    return apiClient.patch<UpdateCaseResponse>(`/cases/${id}`, updateData, {
      requiresAuth: true,
    });
  }

  /**
   * Delete a case entry
   */
  async deleteCase(id: string): Promise<{ message: string }> {
    return apiClient.delete(`/cases/${id}`, { requiresAuth: true });
  }

  /**
   * Get a single case entry
   */
  async getCase(id: string): Promise<CaseEntry> {
    return apiClient.get<CaseEntry>(`/cases/${id}`, { requiresAuth: true });
  }

  /**
   * Get all case entries with filters
   */
  async getCases(params?: GetCasesParams): Promise<GetCasesResponse> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }

    const endpoint = `/cases${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    return apiClient.get<GetCasesResponse>(endpoint, { requiresAuth: true });
  }

  /**
   * Get pending cases (not synced)
   */
  async getPendingCases(): Promise<CaseEntry[]> {
    const response = await this.getCases({ status: "pending" });
    return response.cases;
  }

  /**
   * Upload photo for case entry
   */
  async uploadPhoto(data: UploadPhotoRequest): Promise<UploadPhotoResponse> {
    const formData = new FormData();
    formData.append("file", data.file);

    if (data.caseId) {
      formData.append("caseId", data.caseId);
    }

    return apiClient.upload<UploadPhotoResponse>("/cases/photos", formData, {
      requiresAuth: true,
    });
  }

  /**
   * Upload multiple photos
   */
  async uploadPhotos(
    files: File[],
    caseId?: string
  ): Promise<UploadPhotoResponse[]> {
    const uploadPromises = files.map((file) =>
      this.uploadPhoto({ file, caseId })
    );
    return Promise.all(uploadPromises);
  }

  /**
   * Delete a photo
   */
  async deletePhoto(photoId: string): Promise<{ message: string }> {
    return apiClient.delete(`/cases/photos/${photoId}`, {
      requiresAuth: true,
    });
  }

  /**
   * Sync pending cases to server
   */
  async syncPendingCases(): Promise<{
    synced: number;
    failed: number;
    errors?: string[];
  }> {
    const syncQueue = this.getSyncQueue();

    if (syncQueue.length === 0) {
      return { synced: 0, failed: 0 };
    }

    const results = {
      synced: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const item of syncQueue) {
      try {
        switch (item.type) {
          case "create":
            await this.createCase(item.data);
            break;
          case "update":
            await this.updateCase(item.data);
            break;
          case "delete":
            await this.deleteCase(item.data.id);
            break;
        }

        results.synced++;
        this.removeFromSyncQueue(item.id);
      } catch (error) {
        results.failed++;
        results.errors.push(
          `Failed to sync ${item.type} operation: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );

        // Increment retry count
        item.retryCount++;
        if (item.retryCount < 3) {
          this.updateSyncQueue(syncQueue);
        } else {
          // Remove after 3 failed attempts
          this.removeFromSyncQueue(item.id);
        }
      }
    }

    // Update last sync time
    if (results.synced > 0) {
      localStorage.setItem(
        config.storage.lastSyncKey,
        new Date().toISOString()
      );
    }

    return results;
  }

  /**
   * Add item to sync queue
   */
  addToSyncQueue(
    type: "create" | "update" | "delete",
    data: any
  ): void {
    const queue = this.getSyncQueue();
    queue.push({
      id: `${Date.now()}-${Math.random()}`,
      type,
      data,
      timestamp: Date.now(),
      retryCount: 0,
    });
    this.updateSyncQueue(queue);
  }

  /**
   * Get sync queue
   */
  private getSyncQueue(): SyncQueueItem[] {
    try {
      const queueStr = localStorage.getItem(config.storage.syncQueueKey);
      return queueStr ? JSON.parse(queueStr) : [];
    } catch {
      return [];
    }
  }

  /**
   * Update sync queue
   */
  private updateSyncQueue(queue: SyncQueueItem[]): void {
    localStorage.setItem(config.storage.syncQueueKey, JSON.stringify(queue));
  }

  /**
   * Remove item from sync queue
   */
  private removeFromSyncQueue(id: string): void {
    const queue = this.getSyncQueue().filter((item) => item.id !== id);
    this.updateSyncQueue(queue);
  }

  /**
   * Get sync queue count
   */
  getSyncQueueCount(): number {
    return this.getSyncQueue().length;
  }

  /**
   * Get last sync time
   */
  getLastSyncTime(): string | null {
    return localStorage.getItem(config.storage.lastSyncKey);
  }

  /**
   * Clear sync queue (use with caution)
   */
  clearSyncQueue(): void {
    localStorage.removeItem(config.storage.syncQueueKey);
  }
}

export const caseService = new CaseService();
