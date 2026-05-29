"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { User } from "@/types";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Check authentication
    const role = localStorage.getItem("userRole");
    const name = localStorage.getItem("userName");
    const email = localStorage.getItem("userEmail");

    if (!role || !name || !email) {
      router.push("/login");
      return;
    }

    setUser({
      id: "1",
      email,
      name,
      role: role as "CHW" | "CHL",
      location: "PHC - 001",
    });

    // Monitor online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [router]);

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar user={user} isOnline={isOnline} />
      
      <main className="flex-1 overflow-y-auto bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-600">
                  {user.role} - Health Worker
                </p>
              </div>
              
              <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-10 bg-gray-50"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
