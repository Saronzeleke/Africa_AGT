/**
 * useOnlineStatus Hook
 * Custom hook to monitor online/offline status
 */

import { useEffect, useState } from "react";
import { isOnline } from "@/lib/utils";

export function useOnlineStatus() {
  const [online, setOnline] = useState<boolean>(isOnline());

  useEffect(() => {
    function handleOnline() {
      setOnline(true);
    }

    function handleOffline() {
      setOnline(false);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check immediately
    setOnline(navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return online;
}
