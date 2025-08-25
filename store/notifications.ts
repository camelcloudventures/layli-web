import { Notification } from "@/lib/types/notifications";
import { create } from "zustand";

interface NotificationsStore {
  notifications: Notification[];
  success: boolean;
  setNotifications: (notifications: Notification[]) => void;
  setSuccess: (success: boolean) => void;
}

export const useNotificationsStore = create<NotificationsStore>()((set) => ({
  notifications: [],
  success: false,
  setNotifications: (notifications) => set({ notifications }),
  setSuccess: (success) => set({ success }),
}));
