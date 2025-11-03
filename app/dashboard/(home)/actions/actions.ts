"use server";

import { GET, PATCH } from "@/app/backend/apiMethods";
import { revalidateTag } from "next/cache";

export async function getNotifications() {
  return await GET("/notifications", ["notifications"]);
}

export async function markNotificationAsRead(id: string) {
  return await PATCH(`/notifications/${id}/status`, ["notifications"]);
}

export async function markAllAsRead(ids: string[]) {
  try {
    for (const id of ids) {
      await markNotificationAsRead(id);
    }
    revalidateTag("notifications");
  } catch (error) {
    console.error("Failed to mark notifications as read:", error);
  }
}
