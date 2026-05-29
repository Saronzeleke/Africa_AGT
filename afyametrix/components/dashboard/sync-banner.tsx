import { AlertCircle, Wifi, WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SyncBannerProps {
  isOnline: boolean;
  lastSync: string | null;
  pendingCount: number;
  onSync?: () => void;
  isSyncing?: boolean;
}

export function SyncBanner({
  isOnline,
  lastSync,
  pendingCount,
  onSync,
  isSyncing = false,
}: SyncBannerProps) {
  if (isOnline && pendingCount === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Wifi className="w-5 h-5 text-green-600" />
          <div>
            <p className="text-sm font-medium text-green-900">
              Online / Last sync {lastSync || "just now"}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onSync}
          disabled={isSyncing}
          className="border-green-300 text-green-700 hover:bg-green-100"
        >
          {isSyncing ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Syncing...
            </>
          ) : (
            "Syncing..."
          )}
        </Button>
      </div>
    );
  }

  if (!isOnline) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <WifiOff className="w-5 h-5 text-red-600" />
          <div>
            <p className="text-sm font-medium text-red-900">
              Offline / Last sync {lastSync || "never"} / {pendingCount} records pending
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-red-300 text-red-700 hover:bg-red-100"
          disabled
        >
          Sync Inactive
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600" />
        <div>
          <p className="text-sm font-medium text-blue-900">
            Network detected. You are now online.
          </p>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onSync}
        disabled={isSyncing}
        className="border-blue-300 text-blue-700 hover:bg-blue-100"
      >
        {isSyncing ? (
          <>
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            Syncing...
          </>
        ) : (
          "Sync Now"
        )}
      </Button>
    </div>
  );
}
