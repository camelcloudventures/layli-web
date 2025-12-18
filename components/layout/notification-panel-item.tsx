"use client";

import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Notification } from "@/lib/types/notifications";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { markNotificationAsRead } from "@/app/dashboard/(home)/actions/actions";
import { useNotificationsStore } from "@/store/notifications";
import { useShallow } from "zustand/react/shallow";

interface NotificationPanelItemProps {
  notification: Notification;
  onNavigate?: () => void;
}

function getInitials(title: string): string {
  const words = title.split(" ");
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return title.substring(0, 2).toUpperCase();
}

export function NotificationPanelItem({
  notification,
  onNavigate,
}: NotificationPanelItemProps) {
  const router = useRouter();
  const { setNotifications, notifications } = useNotificationsStore(
    useShallow((state) => ({
      notifications: state.notifications,
      setNotifications: state.setNotifications,
    }))
  );

  const createdDate = new Date(notification.created_at);
  const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true });

  const handleClick = async () => {
    if (!notification.is_read) {
      try {
        await markNotificationAsRead(notification.id);
        const updatedNotifications = notifications.map((n) =>
          n.id === notification.id ? { ...n, is_read: true } : n
        );
        setNotifications(updatedNotifications);
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
      }
    }

    if (onNavigate) {
      onNavigate();
    }

    if (notification.link) {
      // Check if link matches action, issue, or schedule pattern
      const actionMatch = notification.link.match(
        /\/dashboard\/actions\/([^\/]+)/
      );
      const issueMatch = notification.link.match(
        /\/dashboard\/issues\/([^\/]+)/
      );
      const scheduleMatch = notification.link.match(
        /\/dashboard\/schedules\/([^\/]+)/
      );

      if (actionMatch) {
        // Navigate to actions page with actionId query param
        router.push(`/dashboard/actions?actionId=${actionMatch[1]}`);
      } else if (issueMatch) {
        // Navigate to issues page with issueId query param
        router.push(`/dashboard/issues?issueId=${issueMatch[1]}`);
      } else if (scheduleMatch) {
        // Navigate to schedules page with scheduleId query param
        router.push(`/dashboard/schedules?scheduleId=${scheduleMatch[1]}`);
      } else {
        // For other notification types, use the link as-is
        router.push(notification.link);
      }
    } else {
      // Handle empty links - try to infer from notification type and title
      // For schedule notifications (assigned type), navigate to schedules and search by title
      if (
        notification.type === "assigned" ||
        notification.message?.toLowerCase().includes("schedule")
      ) {
        // Navigate to schedules page with scheduleTitle query param
        router.push(
          `/dashboard/schedules?scheduleTitle=${encodeURIComponent(
            notification.title
          )}`
        );
      }
      // For other types with empty links, just navigate to the base page
      // You can add more logic here for actions/issues if needed
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "flex items-start gap-3 p-4 rounded-lg cursor-pointer transition-colors hover:bg-gray-50",
        !notification.is_read && "bg-blue-50/50"
      )}
      role="button"
      tabIndex={0}
      aria-label={`Notification: ${notification.title}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <Avatar className="h-10 w-10 flex-shrink-0">
        <AvatarFallback className="bg-gray-200 text-gray-700">
          {getInitials(notification.title)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-gray-900 leading-tight">
            {notification.title}
          </p>
          {!notification.is_read && (
            <div className="h-2 w-2 rounded-full bg-green-500 flex-shrink-0 mt-1" />
          )}
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {notification.message}
        </p>

        <p className="text-xs text-gray-500">{timeAgo}</p>
      </div>
    </div>
  );
}
