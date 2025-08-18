import { useGetAnalyticsSummary } from "@/app/dashboard/analytics/actions/query";
import { useAnalyticsStore } from "@/store/analytics";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

export function useAnalyticsSummary() {
  const { analyticsSummary, setAnalyticsSummary } = useAnalyticsStore(
    useShallow((state) => ({
      analyticsSummary: state.analyticsSummary,
      setAnalyticsSummary: state.setAnalyticsSummary,
    }))
  );

  const { data: fetchedSummary, isLoading } = useGetAnalyticsSummary(
    !analyticsSummary
  );

  useEffect(() => {
    if (fetchedSummary && !analyticsSummary) {
      setAnalyticsSummary(fetchedSummary);
    }
  }, [fetchedSummary, analyticsSummary, setAnalyticsSummary]);

  return { analyticsSummary, isLoading };
}
