import { useGetTemplates } from "@/app/dashboard/schedules/actions/query";
import { useTemplatesStore } from "@/store/templates";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

export function useTemplates() {
  const { templates, setTemplates } = useTemplatesStore(
    useShallow((state) => ({
      templates: state.templates,
      setTemplates: state.setTemplates,
    }))
  );

  const enabled = !templates || templates.length === 0;
  const { data: fetchedTemplates, isLoading } = useGetTemplates(enabled);

  useEffect(() => {
    if (fetchedTemplates?.data && templates.length === 0) {
      setTemplates(fetchedTemplates.data);
    }
  }, [fetchedTemplates, templates, setTemplates]);

  return { templates, isLoading };
}
