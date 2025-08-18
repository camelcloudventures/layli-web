import { useGetIssues } from "@/app/dashboard/issues/actions/query";
import { useIssuesStore } from "@/store/issues";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

export function useIssues() {
  const { issues, success, setIssues, setSuccess } = useIssuesStore(
    useShallow((state) => ({
      issues: state.issues,
      success: state.success,
      setIssues: state.setIssues,
      setSuccess: state.setSuccess,
    }))
  );

  const { data: fetchedIssues, isLoading } = useGetIssues(
    !issues || issues.length === 0
  );
  useEffect(() => {
    if (fetchedIssues?.data && issues.length === 0) {
      setIssues(fetchedIssues.data);
      setSuccess(fetchedIssues.success);
    }
  }, [fetchedIssues, setIssues, issues, setSuccess]);

  return { issues, isLoading, success };
}
