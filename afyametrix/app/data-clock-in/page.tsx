"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SyncBanner } from "@/components/dashboard/sync-banner";
import { Plus, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { caseService } from "@/lib/api/services/case.service";
import { useAuth } from "@/lib/hooks/useAuth";
import { CaseEntry, DraftEntry } from "@/types";

export default function DataClockInPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [filter, setFilter] = useState<"all" | "pending" | "synced">("all");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isLoading, setIsLoading] = useState(true);
  const [entries, setEntries] = useState<CaseEntry[]>([]);
  const [drafts, setDrafts] = useState<DraftEntry[]>([]);
  const [lastSync, setLastSync] = useState("Never");

  useEffect(() => {
    loadData();

    // Set up online/offline listeners
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Load case entries
      const caseEntries = await caseService.getCases();
      setEntries(caseEntries);

      // Load drafts from localStorage
      const savedDrafts = JSON.parse(localStorage.getItem('afyametrix_drafts') || '[]');
      setDrafts(savedDrafts);

      // Get last sync time
      const lastSyncTime = localStorage.getItem('afyametrix_last_sync');
      if (lastSyncTime) {
        const timeDiff = Date.now() - parseInt(lastSyncTime);
        const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));
        setLastSync(hoursAgo > 0 ? `${hoursAgo}h ago` : "Just now");
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      // Show empty states when API is not ready
      setEntries([]);
      setDrafts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEntries =
    filter === "all"
      ? entries
      : entries.filter((entry) => entry.status === filter);

  const pendingCount = entries.filter(entry => entry.status === 'pending').length;

  const handleNewEntry = () => {
    router.push("/data-clock-in/new");
  };

  const handleContinueDraft = (draftId: string) => {
    router.push(`/data-clock-in/new?draft=${draftId}`);
  };

  const handleSync = async () => {
    if (!isOnline) {
      alert("You are offline. Please check your internet connection.");
      return;
    }

    try {
      await caseService.syncPendingCases();
      localStorage.setItem('afyametrix_last_sync', Date.now().toString());
      await loadData();
    } catch (error) {
      console.error('Sync failed:', error);
      alert("Sync failed. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading entries...</p>
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
        pendingCount={pendingCount}
        onSync={handleSync}
      />

      {/* Case Report Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <CardTitle className="text-xl font-bold">
              Case Report (Data Entries)
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
                className="rounded-full"
              >
                All ({entries.length})
              </Button>
              <Button
                variant={filter === "pending" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("pending")}
                className="rounded-full"
              >
                Pending ({entries.filter(e => e.status === 'pending').length})
              </Button>
              <Button
                variant={filter === "synced" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("synced")}
                className="rounded-full"
              >
                Synced ({entries.filter(e => e.status === 'synced').length})
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredEntries.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {filter === "all" ? "No Entries Found" : `No ${filter} entries`}
              </h3>
              <p className="text-gray-600 mb-4">
                {filter === "all" 
                  ? "Start logging cases to see them here"
                  : `No ${filter} entries to display`
                }
              </p>
              {filter === "all" && (
                <Button onClick={handleNewEntry} className="mt-4">
                  Log Your First Case
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Disease
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Cases
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEntries.map((entry) => (
                    <tr
                      key={entry.id}
                      className="border-b last:border-0 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {entry.diseaseType}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {entry.cases}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={cn(
                            "inline-flex px-3 py-1 rounded-full text-xs font-medium",
                            entry.status === "synced"
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          )}
                        >
                          {entry.status === "synced" ? "Synced" : "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* New Case Entry Button */}
      <div className="flex justify-center py-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            New Case Entry
          </h3>
          <Button onClick={handleNewEntry} size="lg" className="gap-2">
            Insert Data
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Draft Section */}
      {drafts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Draft Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                    Disease Type
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                    No. of Cases
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                    Date
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {drafts.map((draft) => (
                  <tr key={draft.id} className="border-b last:border-0">
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {draft.diseaseType || "Not specified"}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {draft.cases}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {draft.date}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        onClick={() => handleContinueDraft(draft.id)}
                        size="sm"
                        className="bg-cyan-500 hover:bg-cyan-600"
                      >
                        Continue
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
