import { useGetIssues } from "@/app/dashboard/issues/actions/query";
import { useIssuesStore } from "@/store/issues";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

export function useIssues() {
  const { issues, setIssues } = useIssuesStore(
    useShallow((state) => ({
      issues: state.issues,
      setIssues: state.setIssues,
    }))
  );

  console.log("isue", issues);
  const { data: fetchedIssues, isLoading } = useGetIssues(
    !issues || issues.length === 0
  );
  useEffect(() => {
    // This effect syncs the server state from React Query to the Zustand store.
    // It runs whenever new data is fetched, preventing race conditions.
    if (fetchedIssues?.data) {
      // @ts-expect-error - fetchedIssues.data is not typed
      setIssues(fetchedIssues.data);
    }
  }, [fetchedIssues, setIssues]);

  return { issues, isLoading };
}
