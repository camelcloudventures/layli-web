import { useGetActionsAnalytics } from "@/app/dashboard/analytics/actions/query";
import { useAnalyticsStore } from "@/store/analytics";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

export function useActionsAnalytics() {
  const { actionsAnalytics, setActionsAnalytics } = useAnalyticsStore(
    useShallow((state) => ({
      actionsAnalytics: state.actionsAnalytics,
      setActionsAnalytics: state.setActionsAnalytics,
    }))
  );

  const { data: fetchedActions, isLoading } = useGetActionsAnalytics(
    !actionsAnalytics
  );

  useEffect(() => {
    if (fetchedActions && !actionsAnalytics) {
      setActionsAnalytics(fetchedActions);
    }
  }, [fetchedActions, actionsAnalytics, setActionsAnalytics]);

  return { actionsAnalytics, isLoading };
}
