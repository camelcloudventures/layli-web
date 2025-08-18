import { TemplateOption } from "@/app/dashboard/schedules/types/schedule-form-types";
import { AuditTemplate, Pagination } from "@/lib/types/audit-types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TemplatesStore {
  templates: TemplateOption[];
  auditTemplates: AuditTemplate[];
  auditTemplatePagination: Pagination;
  setAuditTemplates: (auditTemplates: AuditTemplate[]) => void;
  setTemplates: (templates: TemplateOption[]) => void;
  setAuditTemplatePagination: (pagination: Pagination) => void;
}

export const useTemplatesStore = create<TemplatesStore>()(
  persist(
    (set) => ({
      templates: [],
      auditTemplates: [],
      auditTemplatePagination: {
        total: 0,
        page: 1,
        pageSize: 1,
        totalPages: 1,
      },
      setTemplates: (templates) => set({ templates }),
      setAuditTemplates: (auditTemplates) => set({ auditTemplates }),
      setAuditTemplatePagination: (pagination) =>
        set({ auditTemplatePagination: pagination }),
    }),
    {
      name: "templates-storage",
    }
  )
);
