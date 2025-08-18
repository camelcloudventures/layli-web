import { useGetAuditTemplates } from "@/app/dashboard/templates/actions/query";
import { useTemplatesStore } from "@/store/templates";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

export function useAuditTemplates() {
  const {
    auditTemplates,
    auditTemplatePagination,
    setAuditTemplates,
    setAuditTemplatePagination,
  } = useTemplatesStore(
    useShallow((state) => ({
      auditTemplates: state.auditTemplates,
      auditTemplatePagination: state.auditTemplatePagination,
      setAuditTemplates: state.setAuditTemplates,
      setAuditTemplatePagination: state.setAuditTemplatePagination,
    }))
  );

  const { data: fetchedAuditTemplates, isLoading } = useGetAuditTemplates(
    1,
    !auditTemplates || auditTemplates.length === 0
  );

  useEffect(() => {
    if (fetchedAuditTemplates?.data && auditTemplates.length === 0) {
      setAuditTemplates(fetchedAuditTemplates.data);
    }
    if (fetchedAuditTemplates?.pagination) {
      setAuditTemplatePagination(fetchedAuditTemplates.pagination);
    }
  }, [
    fetchedAuditTemplates,
    auditTemplates,
    setAuditTemplates,
    setAuditTemplatePagination,
  ]);

  return { auditTemplates, auditTemplatePagination, isLoading };
}
