import { useGetSchedulesAnalytics } from "@/app/dashboard/analytics/actions/query";
import { useAnalyticsStore } from "@/store/analytics";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

export function useSchedulesAnalytics() {
  const { schedulesAnalytics, setSchedulesAnalytics } = useAnalyticsStore(
    useShallow((state) => ({
      schedulesAnalytics: state.schedulesAnalytics,
      setSchedulesAnalytics: state.setSchedulesAnalytics,
    }))
  );

  const { data: fetchedSchedules, isLoading } = useGetSchedulesAnalytics(
    !schedulesAnalytics
  );

  useEffect(() => {
    if (fetchedSchedules && !schedulesAnalytics) {
      setSchedulesAnalytics(fetchedSchedules);
    }
  }, [fetchedSchedules, schedulesAnalytics, setSchedulesAnalytics]);

  return { schedulesAnalytics, isLoading };
}
