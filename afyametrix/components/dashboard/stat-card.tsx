import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
    direction: "up" | "down";
  };
  className?: string;
}

export function StatCard({ title, value, icon: Icon, trend, className }: StatCardProps) {
  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-gray-100 rounded-lg">
          <Icon className="w-6 h-6 text-gray-600" />
        </div>
      </div>
      
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        
        {trend && (
          <div className="mt-2">
            <span
              className={cn(
                "inline-flex items-center px-2 py-1 rounded text-xs font-medium",
                trend.direction === "up"
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-green-50 text-green-700 border border-green-200"
              )}
            >
              {trend.direction === "up" ? "↑" : "↓"} {trend.value} {trend.label}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
