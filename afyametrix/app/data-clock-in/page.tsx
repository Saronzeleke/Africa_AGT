"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SyncBanner } from "@/components/dashboard/sync-banner";
import { Plus, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

const mockEntries = [
  {
    id: "1",
    diseaseType: "Cholera",
    cases: 14,
    date: "4/12/2026",
    worker: "Blessing G.",
    status: "pending" as const,
  },
  {
    id: "2",
    diseaseType: "Mpox",
    cases: 8,
    date: "4/12/2026",
    worker: "Blessing G.",
    status: "pending" as const,
  },
  {
    id: "3",
    diseaseType: "Yellow Fever",
    cases: 3,
    date: "4/12/2026",
    worker: "Blessing G.",
    status: "pending" as const,
  },
  {
    id: "4",
    diseaseType: "Meningitis",
    cases: 11,
    date: "4/12/2026",
    worker: "Daniel U.",
    status: "synced" as const,
  },
  {
    id: "5",
    diseaseType: "Cholera",
    cases: 10,
    date: "4/11/2026",
    worker: "Daniel U.",
    status: "synced" as const,
  },
];

const mockDrafts = [
  {
    id: "draft-1",
    cases: 3,
    date: "4/12/2026",
  },
];

export default function DataClockInPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "pending" | "synced">("all");
  const [isOnline, setIsOnline] = useState(false);

  const filteredEntries =
    filter === "all"
      ? mockEntries
      : mockEntries.filter((entry) => entry.status === filter);

  const handleNewEntry = () => {
    router.push("/data-clock-in/new");
  };

  const handleContinueDraft = (draftId: string) => {
    router.push(`/data-clock-in/new?draft=${draftId}`);
  };

  return (
    <div className="space-y-6">
      {/* Sync Status Banner */}
      <SyncBanner
        isOnline={isOnline}
        lastSync="24hrs ago"
        pendingCount={2}
        onSync={() => setIsOnline(true)}
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
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
          <Button onClick={handleNewEntry} variant="link" className="gap-1">
            View All Entries →
          </Button>
        </CardHeader>
        <CardContent>
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
                    Worker
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
                      {entry.date}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {entry.worker}
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
      {mockDrafts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Draft</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full">
              <thead>
                <tr className="border-b">
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
                {mockDrafts.map((draft) => (
                  <tr key={draft.id} className="border-b last:border-0">
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
