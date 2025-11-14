import { useGetAuditTemplates } from "@/app/dashboard/templates/actions/query";
import { useTemplatesStore } from "@/store/templates";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

export function useAuditTemplates() {
  const { templates, reset, setTemplates } = useTemplatesStore(
    useShallow((state) => ({
      setTemplates: state.setTemplates,
      templates: state.templates,
      reset: state.reset,
    }))
  );

  console.log("store templates", templates);

  const {
    data: fetchedAuditTemplates,
    isLoading,
    isError,
  } = useGetAuditTemplates(templates.length === 0);
  console.log("fetchedAuditTemplates", fetchedAuditTemplates);

  console.log("error", isError);
  useEffect(() => {
    if (fetchedAuditTemplates?.data) {
      // @ts-expect-error - fetchedAuditTemplates.data is not typed
      setTemplates(fetchedAuditTemplates.data);
    }
  }, [fetchedAuditTemplates, setTemplates]);

  return {
    templates,
    isLoading,
    reset,
  };
}
