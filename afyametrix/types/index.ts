export type UserRole = "CHW" | "CHL";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  location?: string;
}

export interface CaseEntry {
  id: string;
  diseaseType: string;
  cases: number;
  date: string;
  worker: string;
  status: "pending" | "synced";
  caseDetails?: string;
  comments?: string;
  photos?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DraftEntry {
  id: string;
  cases: number;
  date: string;
  diseaseType?: string;
  caseDetails?: string;
  comments?: string;
  photos?: string[];
}

export interface DiseaseStats {
  name: string;
  count: number;
  color: string;
}

export interface DashboardStats {
  todayCases: number;
  pendingSync: number;
  thisWeek: number;
  trend?: {
    value: number;
    direction: "up" | "down";
    label: string;
  };
}

export interface SyncStatus {
  isOnline: boolean;
  lastSync: string | null;
  pendingCount: number;
}
