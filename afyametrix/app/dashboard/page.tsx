"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StatCard } from "@/components/dashboard/stat-card";
import { DiseaseChart } from "@/components/dashboard/disease-chart";
import { RecentEntries } from "@/components/dashboard/recent-entries";
import { SyncBanner } from "@/components/dashboard/sync-banner";
import { FileText, RefreshCw, Calendar, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

// Mock data
const mockDiseaseData = [
  { name: "Yellow Fever", count: 22, color: "#14b8a6" },
  { name: "Mpox", count: 32, color: "#a3a300" },
  { name: "Cholera", count: 48, color: "#7c3aed" },
  { name: "Meningitis", count: 30, color: "#f97316" },
  { name: "Lassa Fever", count: 10, color: "#0000ff" },
];

const mockRecentEntries = [
  {
    id: "1",
    diseaseType: "Cholera",
    cases: 14,
    date: "4/12/2026",
    worker: "Blessing G.",
    status: "pending" as const,
    createdAt: "2026-04-12",
    updatedAt: "2026-04-12",
  },
  {
    id: "2",
    diseaseType: "Mpox",
    cases: 8,
    date: "4/12/2026",
    worker: "Blessing G.",
    status: "pending" as const,
    createdAt: "2026-04-12",
    updatedAt: "2026-04-12",
  },
  {
    id: "3",
    diseaseType: "Yellow Fever",
    cases: 3,
    date: "4/12/2026",
    worker: "Blessing G.",
    status: "pending" as const,
    createdAt: "2026-04-12",
    updatedAt: "2026-04-12",
  },
  {
    id: "4",
    diseaseType: "Meningitis",
    cases: 11,
    date: "4/12/2026",
    worker: "Daniel U.",
    status: "synced" as const,
    createdAt: "2026-04-12",
    updatedAt: "2026-04-12",
  },
  {
    id: "5",
    diseaseType: "Cholera",
    cases: 10,
    date: "4/11/2026",
    worker: "Daniel U.",
    status: "synced" as const,
    createdAt: "2026-04-11",
    updatedAt: "2026-04-11",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setIsOnline(true);
    }, 2000);
  };

  const handleAddCase = () => {
    router.push("/data-clock-in/new");
  };

  const handleViewAll = () => {
    router.push("/data-clock-in");
  };

  return (
    <div className="space-y-6">
      {/* Sync Status Banner */}
      <SyncBanner
        isOnline={isOnline}
        lastSync="24hrs ago"
        pendingCount={3}
        onSync={handleSync}
        isSyncing={isSyncing}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Today's Cases"
          value={47}
          icon={FileText}
          trend={{
            value: 15,
            label: "from yesterday",
            direction: "up",
          }}
        />
        <StatCard
          title="Pending Sync"
          value={3}
          icon={RefreshCw}
          className="bg-blue-50"
        />
        <StatCard
          title="This Week"
          value={218}
          icon={Calendar}
          trend={{
            value: 8,
            label: "Normal Range",
            direction: "down",
          }}
        />
      </div>

      {/* Disease Chart */}
      <DiseaseChart data={mockDiseaseData} onAddCase={handleAddCase} />

      {/* Alert Card */}
      <Card className="bg-orange-50 border-orange-200 p-6">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-orange-900 mb-2">
              Cholera cases up 40% this week
            </h3>
            <p className="text-sm text-orange-800 leading-relaxed">
              Port Harcourt Central sub-county has recorded a 40% increase in cholera cases.
              Ensure clean water supplies, ORS, and treatment resources are adequately stocked.
            </p>
            <p className="text-xs text-orange-700 mt-2">
              Auto-detected • April 28 • PHC-001
            </p>
          </div>
        </div>
      </Card>

      {/* Recent Entries */}
      <RecentEntries entries={mockRecentEntries} onViewAll={handleViewAll} />
    </div>
  );
}
