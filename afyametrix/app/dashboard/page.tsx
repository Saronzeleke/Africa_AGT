"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { StatCard } from "@/components/dashboard/stat-card";
import { DiseaseChart } from "@/components/dashboard/disease-chart";
import { RecentEntries } from "@/components/dashboard/recent-entries";
import { SyncBanner } from "@/components/dashboard/sync-banner";
import { FileText, RefreshCw, Calendar, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { dashboardService, Alert } from "@/lib/api/services/dashboard.service";
import { config } from "@/lib/config";
import { CaseEntry } from "@/types";

interface DashboardStats {
  todayCases: number;
  weekCases: number;
  monthCases: number;
  pendingReports: number;
  trend?: {
    value: number;
    direction: "up" | "down";
  };
}

interface DiseaseData {
  name: string;
  count: number;
  color: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    todayCases: 0,
    weekCases: 0,
    monthCases: 0,
    pendingReports: 0,
  });
  const [diseaseData, setDiseaseData] = useState<DiseaseData[]>([]);
  const [recentEntries, setRecentEntries] = useState<CaseEntry[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [lastSync, setLastSync] = useState<string>("");

  const getColor = (index: number) => {
    const colors = ["#14b8a6", "#a3a300", "#7c3aed", "#f97316", "#0000ff", "#e11d48"];
    return colors[index % colors.length];
  };

  const loadDashboardData = useCallback(async () => {
    console.log('🔄 Loading dashboard data...');
    try {
      setIsLoading(true);
      setError(null);

      const token = typeof document !== 'undefined' ? document.cookie.match(/afyametrix_token=([^;]+)/)?.[1] || '' : '';
      console.log('🍪 Token found:', !!token);

      // Use parallel requests for better performance
      const [dashboardStats, diseases, entries, alertsData] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/health-intelligence/dashboard`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }).then(res => {
          console.log('📊 Dashboard stats response:', res.status);
          if (res.status === 401) {
            router.push('/login');
            throw new Error('Authentication required');
          }
          if (!res.ok) throw new Error(`Dashboard API failed: ${res.status}`);
          return res.json();
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/health-intelligence/diseases`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }).then(res => {
          console.log('🦠 Diseases response:', res.status);
          if (res.status === 401) {
            router.push('/login');
            throw new Error('Authentication required');
          }
          if (!res.ok) throw new Error(`Diseases API failed: ${res.status}`);
          return res.json();
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/health-intelligence/recent?limit=10`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }).then(res => {
          console.log('📋 Recent entries response:', res.status);
          if (res.status === 401) {
            router.push('/login');
            throw new Error('Authentication required');
          }
          if (!res.ok) throw new Error(`Recent API failed: ${res.status}`);
          return res.json();
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/health-intelligence/alerts`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }).then(res => {
          console.log('🚨 Alerts response:', res.status);
          if (res.status === 401) {
            router.push('/login');
            throw new Error('Authentication required');
          }
          if (!res.ok) throw new Error(`Alerts API failed: ${res.status}`);
          return res.json();
        }).catch((err) => {
          console.log('⚠️ Alerts failed (optional):', err.message);
          return []; // Alerts are optional
        })
      ]);

      console.log('✅ Dashboard data loaded successfully');
      console.log('📊 Stats:', dashboardStats);
      console.log('🦠 Diseases:', diseases);
      console.log('📋 Entries:', entries);
      console.log('🚨 Alerts:', alertsData);

      setStats({
        todayCases: dashboardStats.todayCases || 0,
        weekCases: dashboardStats.weekCases || 0,
        monthCases: dashboardStats.monthCases || 0,
        pendingReports: dashboardStats.pendingReports || 0,
        trend: dashboardStats.trend ? {
          value: dashboardStats.trend.value,
          direction: dashboardStats.trend.direction,
        } : undefined,
      });

      setDiseaseData(Array.isArray(diseases) ? diseases.map((d: any, index: number) => ({
        name: d.name,
        count: d.count,
        color: getColor(index),
      })) : []);

      setRecentEntries(Array.isArray(entries) ? entries : []);
      setAlerts(Array.isArray(alertsData) ? alertsData : []);

      // Get last sync time from localStorage
      const lastSyncTime = localStorage.getItem(config.storage.lastSyncKey);
      if (lastSyncTime) {
        const timeDiff = Date.now() - parseInt(lastSyncTime);
        const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));
        setLastSync(hoursAgo > 0 ? `${hoursAgo}h ago` : "Just now");
      } else {
        setLastSync("Never");
      }
    } catch (error: any) {
      console.error('Failed to load dashboard data:', error);
      setError(error.message || 'Failed to load dashboard data. Please try again.');
      // Don't throw - handle gracefully with error state
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();

    // Set up online/offline listeners
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [loadDashboardData]);

  const handleSync = async () => {
    if (!isOnline) {
      alert("You are offline. Please check your internet connection.");
      return;
    }

    setIsSyncing(true);
    
    try {
      await dashboardService.syncData();
      localStorage.setItem(config.storage.lastSyncKey, Date.now().toString());
      setLastSync("Just now");
      await loadDashboardData();
    } catch (error) {
      console.error('Sync failed:', error);
      alert("Sync failed. Please try again.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAddCase = () => {
    router.push("/data-clock-in/new");
  };

  const handleViewAll = () => {
    router.push("/data-clock-in");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sync Status Banner */}
      <SyncBanner
        isOnline={isOnline}
        lastSync={lastSync}
        pendingCount={stats.pendingReports}
        onSync={handleSync}
        isSyncing={isSyncing}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Today's Cases"
          value={stats.todayCases}
          icon={FileText}
          trend={stats.trend ? {
            value: stats.trend.value,
            label: "from yesterday",
            direction: stats.trend.direction,
          } : undefined}
        />
        <StatCard
          title="Pending Sync"
          value={stats.pendingReports}
          icon={RefreshCw}
          className="bg-blue-50"
        />
        <StatCard
          title="This Week"
          value={stats.weekCases}
          icon={Calendar}
        />
      </div>

      {/* Disease Chart */}
      {diseaseData.length > 0 && (
        <DiseaseChart data={diseaseData} onAddCase={handleAddCase} />
      )}

      {/* Empty State for Disease Chart */}
      {diseaseData.length === 0 && (
        <Card className="p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Cases Recorded Today
          </h3>
          <p className="text-gray-600 mb-4">
            Start logging cases to see disease breakdown analytics
          </p>
          <button
            onClick={handleAddCase}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Log Your First Case
          </button>
        </Card>
      )}

      {/* Alerts */}
      {Array.isArray(alerts) && alerts.length > 0 && alerts.map((alert) => (
        <Card key={alert.id} className="bg-orange-50 border-orange-200 p-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-orange-900 mb-2">
                {alert.title}
              </h3>
              <p className="text-sm text-orange-800 leading-relaxed">
                {alert.message}
              </p>
              <p className="text-xs text-orange-700 mt-2">
                {alert.type === "warning" ? "⚠️" : "ℹ️"} {new Date(alert.createdAt).toLocaleDateString()} • {alert.location || 'Unknown location'}
              </p>
            </div>
          </div>
        </Card>
      ))}

      {/* Recent Entries */}
      {recentEntries.length > 0 && (
        <RecentEntries entries={recentEntries} onViewAll={handleViewAll} />
      )}

      {/* Empty State for Recent Entries */}
      {recentEntries.length === 0 && (
        <Card className="p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Recent Entries
          </h3>
          <p className="text-gray-600 mb-4">
            Your case entries will appear here once you start logging
          </p>
        </Card>
      )}
    </div>
  );
}
