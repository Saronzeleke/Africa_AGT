"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  X,
  MarkdownRenderer
} from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";

interface Notification {
  id: string;
  type: "info" | "warning" | "success" | "error";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

// Mock notifications data - in real app this would come from backend
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "warning",
    title: "Cholera cases up 40% this week",
    message: "Port Harcourt Central sub-county has recorded a 40% increase in cholera cases. Ensure clean water supplies, ORS, and treatment resources are adequately stocked.",
    timestamp: "2024-07-19T14:30:00Z",
    read: false,
  },
  {
    id: "2",
    type: "info",
    title: "Weekly Data Sync Completed",
    message: "Your weekly health data has been successfully synchronized with the central database. 47 case entries were uploaded.",
    timestamp: "2024-07-19T09:00:00Z",
    read: true,
  },
  {
    id: "3",
    type: "success",
    title: "Malaria Prevention Campaign Success",
    message: "The malaria prevention campaign in your region has shown a 25% reduction in cases compared to last month.",
    timestamp: "2024-07-18T16:45:00Z",
    read: true,
  },
  {
    id: "4",
    type: "error",
    title: "Data Entry Error Detected",
    message: "Some recent entries may have validation errors. Please review and correct any flagged submissions.",
    timestamp: "2024-07-18T11:20:00Z",
    read: false,
  },
];

export default function NotificationsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [activeTab, setActiveTab] = useState("all");

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case "error":
        return <X className="w-5 h-5 text-red-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getBackgroundColor = (type: Notification["type"], read: boolean) => {
    const opacity = read ? "50" : "100";
    switch (type) {
      case "success":
        return `bg-green-${opacity} border-green-200`;
      case "warning":
        return `bg-yellow-${opacity} border-yellow-200`;
      case "error":
        return `bg-red-${opacity} border-red-200`;
      default:
        return `bg-blue-${opacity} border-blue-200`;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== id)
    );
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === "unread") return !notification.read;
    if (activeTab === "alerts") return notification.type === "warning" || notification.type === "error";
    return true;
  });

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Bell className="w-6 h-6" />
                  Notifications
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                      {unreadCount}
                    </span>
                  )}
                </h1>
                <p className="text-sm text-gray-600">Stay updated with health alerts and system updates</p>
              </div>
            </div>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">
              All ({notifications.length})
            </TabsTrigger>
            <TabsTrigger value="unread">
              Unread ({unreadCount})
            </TabsTrigger>
            <TabsTrigger value="alerts">
              Alerts ({notifications.filter(n => n.type === "warning" || n.type === "error").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <div className="space-y-4">
              {filteredNotifications.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No notifications found
                    </h3>
                    <p className="text-gray-600">
                      {activeTab === "unread" 
                        ? "You're all caught up! No unread notifications."
                        : activeTab === "alerts"
                        ? "No active alerts at the moment."
                        : "You don't have any notifications yet."
                      }
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredNotifications.map((notification) => (
                  <Card 
                    key={notification.id}
                    className={`transition-all duration-200 ${
                      !notification.read 
                        ? "border-l-4 border-l-blue-500 shadow-md" 
                        : "opacity-75"
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h3 className={`font-semibold ${
                                !notification.read ? "text-gray-900" : "text-gray-700"
                              }`}>
                                {notification.title}
                              </h3>
                              <p className={`mt-1 text-sm ${
                                !notification.read ? "text-gray-700" : "text-gray-600"
                              }`}>
                                {notification.message}
                              </p>
                              <p className="mt-2 text-xs text-gray-500">
                                {formatTime(notification.timestamp)}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-blue-600 hover:text-blue-700"
                                >
                                  Mark read
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteNotification(notification.id)}
                                className="text-gray-500 hover:text-red-600"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}