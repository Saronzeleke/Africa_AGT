"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import {
  LayoutDashboard,
  Clock,
  Map,
  TrendingUp,
  Sparkles,
  Settings,
  Bell,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { User } from "@/types";

interface SidebarProps {
  user: User;
  isOnline: boolean;
}

const menuItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: Clock,
    label: "Data Clock-In",
    href: "/data-clock-in",
  },
  {
    icon: Map,
    label: "Heatmap",
    href: "/heatmap",
  },
  {
    icon: TrendingUp,
    label: "Trends & Forecast",
    href: "/trends-forecast",
  },
  {
    icon: Sparkles,
    label: "AI Recommendation",
    href: "/ai-recommendations",
  },
];

export function Sidebar({ user, isOnline }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-gradient-to-b from-cyan-50 to-blue-50 border-r border-gray-200 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Logo size="sm" />
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-3">
            MENU
          </p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-white text-primary shadow-sm"
                    : "text-gray-700 hover:bg-white/50"
                )}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold">
            {user.name.split(" ").map(n => n[0]).join("")}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user.name}
            </p>
            <p className="text-xs text-gray-500">
              {user.role} • {user.location || "PHC - 001"}
            </p>
          </div>
          <button className="p-2 hover:bg-white/50 rounded-lg transition-colors">
            <RefreshCw className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium",
              isOnline
                ? "bg-green-100 text-green-700"
                : "bg-gray-200 text-gray-700"
            )}
          >
            {isOnline ? "Online" : "Offline"}
          </div>
          <button className="p-2 hover:bg-white/50 rounded-lg transition-colors">
            <Bell className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-white/50 rounded-lg transition-colors">
            <Settings className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </aside>
  );
}
