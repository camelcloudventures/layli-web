import { Notification } from "@/lib/types/notifications";
import { create } from "zustand";
import { persist } from "zustand/middleware";
interface NotificationsStore {
  notifications: Notification[];
  success: boolean;
  setNotifications: (notifications: Notification[]) => void;
  setSuccess: (success: boolean) => void;
}

export const useNotificationsStore = create<NotificationsStore>()(
  persist(
    (set) => ({
      notifications: [],
      success: false,
      setNotifications: (notifications) => set({ notifications }),
      setSuccess: (success) => set({ success }),
    }),
    { name: "notifications" }
  )
);
