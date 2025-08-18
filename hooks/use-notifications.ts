import { useGetNotifications } from "@/app/dashboard/(home)/actions/query";
import { useNotificationsStore } from "@/store/notifications";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

export function useNotifications() {
  const { notifications, success, setNotifications, setSuccess } =
    useNotificationsStore(
      useShallow((state) => ({
        notifications: state.notifications,
        success: state.success,
        setNotifications: state.setNotifications,
        setSuccess: state.setSuccess,
      }))
    );

  const enabled = !notifications || notifications.length === 0;

  const { data: fetchedNotifications, isLoading } =
    useGetNotifications(enabled);

  useEffect(() => {
    if (fetchedNotifications?.data && notifications.length === 0) {
      setNotifications(fetchedNotifications.data);
      setSuccess(fetchedNotifications.success);
    }
  }, [fetchedNotifications, notifications, setNotifications]);

  return { notifications, success, isLoading };
}
