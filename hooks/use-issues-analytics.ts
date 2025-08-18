import { useGetIssuesAnalytics } from "@/app/dashboard/analytics/actions/query";
import { useAnalyticsStore } from "@/store/analytics";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

export function useIssuesAnalytics() {
  const { issuesAnalytics, setIssuesAnalytics } = useAnalyticsStore(
    useShallow((state) => ({
      issuesAnalytics: state.issuesAnalytics,
      setIssuesAnalytics: state.setIssuesAnalytics,
    }))
  );

  const { data: fetchedIssues, isLoading } = useGetIssuesAnalytics(
    !issuesAnalytics
  );

  useEffect(() => {
    if (fetchedIssues && !issuesAnalytics) {
      setIssuesAnalytics(fetchedIssues);
    }
  }, [fetchedIssues, issuesAnalytics, setIssuesAnalytics]);

  return { issuesAnalytics, isLoading };
}
