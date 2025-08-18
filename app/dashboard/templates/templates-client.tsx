"use client";

import { useAuditTemplates } from "@/hooks/use-audit-templates";
import { Permission } from "@/lib/auth/auth";
import HasPermission from "../components/has-permission";
import CreateAuditBtn from "./components/create-audit-btn";
import { EmptyTemplatesState } from "./components/empty-templates-state";
import { TemplateSearch } from "./components/template-search";

interface TemplatesClientProps {
  resolvedParams: { search?: string; page?: string };
}

export function TemplatesClient({ resolvedParams }: TemplatesClientProps) {
  const pageNumber = Number(resolvedParams.page) || 1;

  const {
    auditTemplates,
    auditTemplatePagination,
    isLoading: isAuditTemplatesLoading,
  } = useAuditTemplates();

  const hasTemplates = auditTemplates.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center ">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Audit Templates
            </h1>
            <p className="text-muted-foreground">
              Create and manage audit templates
            </p>
          </div>
        </div>
        <HasPermission permission={Permission.EDIT_TEMPLATES}>
          <CreateAuditBtn />
        </HasPermission>
      </div>

      {hasTemplates ? (
        <TemplateSearch
          templates={auditTemplates}
          searchParams={resolvedParams}
          page={pageNumber}
          totalPages={auditTemplatePagination.totalPages}
          isLoading={isAuditTemplatesLoading}
        />
      ) : (
        <HasPermission permission={Permission.EDIT_TEMPLATES}>
          <EmptyTemplatesState />
        </HasPermission>
      )}
    </div>
  );
}
