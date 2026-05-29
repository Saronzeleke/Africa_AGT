import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CaseEntry } from "@/types";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface RecentEntriesProps {
  entries: CaseEntry[];
  onViewAll?: () => void;
}

export function RecentEntries({ entries, onViewAll }: RecentEntriesProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold">Recent Entries</CardTitle>
        {onViewAll && (
          <Button onClick={onViewAll} variant="link" size="sm" className="gap-1">
            View All Entries
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
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
              {entries.map((entry) => (
                <tr key={entry.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">{entry.diseaseType}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{entry.cases}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{entry.date}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{entry.worker}</td>
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
  );
}
