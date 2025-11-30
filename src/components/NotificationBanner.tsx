import { useState, useEffect } from "react";
import { X, Bell, AlertTriangle, Info, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  type: "alert" | "info" | "deadline" | "closure";
  title: string;
  message: string;
  date: string;
  isNew: boolean;
}

const notifications: Notification[] = [
  {
    id: "1",
    type: "alert",
    title: "New Immigration Policy",
    message: "Updated visa requirements for ECOWAS nationals effective January 2025. All applications must include biometric data.",
    date: "2024-12-15",
    isNew: true,
  },
  {
    id: "2",
    type: "deadline",
    title: "Permit Renewal Deadline",
    message: "All work permits expiring in Q1 2025 must be renewed by December 31, 2024 to avoid penalties.",
    date: "2024-12-10",
    isNew: true,
  },
  {
    id: "3",
    type: "closure",
    title: "Office Closure Notice",
    message: "All GIS offices will be closed from December 25-26, 2024 for Christmas holidays. Emergency services remain available.",
    date: "2024-12-08",
    isNew: false,
  },
  {
    id: "4",
    type: "info",
    title: "Online Portal Maintenance",
    message: "The online application portal will undergo maintenance on December 20, 2024 from 10 PM to 6 AM GMT.",
    date: "2024-12-05",
    isNew: false,
  },
];

const typeIcons = {
  alert: AlertTriangle,
  info: Info,
  deadline: Calendar,
  closure: X,
};

const typeColors = {
  alert: "bg-destructive/10 text-destructive border-destructive/20",
  info: "bg-primary/10 text-primary border-primary/20",
  deadline: "bg-secondary/10 text-secondary-foreground border-secondary/20",
  closure: "bg-muted text-muted-foreground border-muted-foreground/20",
};

export function NotificationBanner() {
  const [isOpen, setIsOpen] = useState(false);
  const [dismissedIds, setDismissedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("gis-dismissed-notifications");
    return saved ? JSON.parse(saved) : [];
  });

  const activeNotifications = notifications.filter(n => !dismissedIds.includes(n.id));
  const newCount = activeNotifications.filter(n => n.isNew).length;

  const dismissNotification = (id: string) => {
    const newDismissed = [...dismissedIds, id];
    setDismissedIds(newDismissed);
    localStorage.setItem("gis-dismissed-notifications", JSON.stringify(newDismissed));
  };

  useEffect(() => {
    // Show banner automatically if there are new notifications
    if (newCount > 0 && !localStorage.getItem("gis-notification-seen")) {
      setIsOpen(true);
      localStorage.setItem("gis-notification-seen", "true");
    }
  }, [newCount]);

  return (
    <>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-24 right-4 z-40 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        aria-label="View notifications"
      >
        <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
        {newCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {newCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="fixed top-24 right-4 z-50 w-96 max-w-[calc(100vw-2rem)] max-h-[70vh] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-right-5 duration-300">
          <div className="p-4 border-b border-border bg-muted/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Notifications</h3>
              {newCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                  {newCount} new
                </span>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-muted transition-colors"
              aria-label="Close notifications"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-y-auto max-h-[calc(70vh-60px)]">
            {activeNotifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No new notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {activeNotifications.map((notification) => {
                  const Icon = typeIcons[notification.type];
                  return (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-muted/50 transition-colors ${notification.isNew ? "bg-primary/5" : ""}`}
                    >
                      <div className="flex gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${typeColors[notification.type]}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-medium text-foreground text-sm">
                              {notification.title}
                              {notification.isNew && (
                                <span className="ml-2 px-1.5 py-0.5 text-[10px] font-bold bg-primary text-primary-foreground rounded">
                                  NEW
                                </span>
                              )}
                            </h4>
                            <button
                              onClick={() => dismissNotification(notification.id)}
                              className="p-1 rounded hover:bg-muted transition-colors shrink-0"
                              aria-label="Dismiss notification"
                            >
                              <X className="w-3 h-3 text-muted-foreground" />
                            </button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-2">
                            {new Date(notification.date).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="p-3 border-t border-border bg-muted/50">
            <Button variant="outline" size="sm" className="w-full text-xs" asChild>
              <a href="/news">View All Announcements</a>
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
