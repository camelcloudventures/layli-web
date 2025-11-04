"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { NotificationPanelItem } from "./notification-panel-item";
import { useNotifications } from "@/hooks/use-notifications";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { markAllAsRead } from "@/app/dashboard/(home)/actions/actions";
import { useNotificationsStore } from "@/store/notifications";
import { useShallow } from "zustand/react/shallow";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface NotificationPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotificationPanel({
  open,
  onOpenChange,
}: NotificationPanelProps) {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [isMarkingAllAsRead, setIsMarkingAllAsRead] = useState(false);
  const { notifications, isLoading } = useNotifications();
  const { setNotifications } = useNotificationsStore(
    useShallow((state) => ({
      setNotifications: state.setNotifications,
    }))
  );

  const unreadNotifications = notifications.filter((n) => !n.is_read);
  const filteredNotifications =
    filter === "unread" ? unreadNotifications : notifications;

  const handleMarkAllAsRead = async () => {
    if (isMarkingAllAsRead || unreadNotifications.length === 0) return;

    setIsMarkingAllAsRead(true);
    try {
      await markAllAsRead(notifications.map((n) => n.id));
      const updatedNotifications = notifications.map((n) => ({
        ...n,
        is_read: true,
      }));
      setNotifications(updatedNotifications);
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    } finally {
      setIsMarkingAllAsRead(false);
    }
  };

  const handleNavigate = () => {
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:w-[400px] md:w-[500px] p-0 flex flex-col"
      >
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-semibold">
              Notifications
            </SheetTitle>
            {unreadNotifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                disabled={isMarkingAllAsRead}
                className="text-xs"
              >
                {isMarkingAllAsRead ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    Marking...
                  </>
                ) : (
                  "Mark all as read"
                )}
              </Button>
            )}
          </div>

          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={() => setFilter("all")}
              className={cn(
                "text-sm font-medium transition-colors pb-2 border-b-2",
                filter === "all"
                  ? "text-gray-900 border-gray-900"
                  : "text-gray-500 border-transparent hover:text-gray-700"
              )}
            >
              All
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={cn(
                "text-sm font-medium transition-colors pb-2 border-b-2",
                filter === "unread"
                  ? "text-gray-900 border-gray-900"
                  : "text-gray-500 border-transparent hover:text-gray-700"
              )}
            >
              Unread
            </button>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6 py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-sm text-gray-500">
                {filter === "unread"
                  ? "No unread notifications"
                  : "No notifications"}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredNotifications.map((notification) => (
                <NotificationPanelItem
                  key={notification.id}
                  notification={notification}
                  onNavigate={handleNavigate}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
