import { useGetInspectionsAnalytics } from "@/app/dashboard/analytics/actions/query";
import { useAnalyticsStore } from "@/store/analytics";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

export function useInspectionsAnalytics() {
  const { inspectionsAnalytics, setInspectionsAnalytics } = useAnalyticsStore(
    useShallow((state) => ({
      inspectionsAnalytics: state.inspectionsAnalytics,
      setInspectionsAnalytics: state.setInspectionsAnalytics,
    }))
  );

  const { data: fetchedInspections, isLoading } = useGetInspectionsAnalytics(
    !inspectionsAnalytics
  );

  useEffect(() => {
    if (fetchedInspections && !inspectionsAnalytics) {
      setInspectionsAnalytics(fetchedInspections);
    }
  }, [fetchedInspections, inspectionsAnalytics, setInspectionsAnalytics]);

  return { inspectionsAnalytics, isLoading };
}
