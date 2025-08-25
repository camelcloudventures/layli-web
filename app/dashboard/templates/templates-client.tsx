"use client";

import { useAuditTemplates } from "@/hooks/use-audit-templates";
import { Permission } from "@/lib/auth/auth";
import HasPermission from "../components/has-permission";
import CreateAuditBtn from "./components/create-audit-btn";
import { TemplateSearch } from "./components/template-search";
import { EmptyTemplatesState } from "./components/empty-templates-state";

interface TemplatesClientProps {
  resolvedParams: { search?: string; page?: string };
}

export function TemplatesClient({ resolvedParams }: TemplatesClientProps) {
  const pageNumber = Number(resolvedParams.page) || 1;

  const { isLoading, templates } = useAuditTemplates();

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

      {templates ? (
        <TemplateSearch
          templates={templates}
          searchParams={resolvedParams}
          page={pageNumber}
          isLoading={isLoading}
        />
      ) : (
        <HasPermission permission={Permission.EDIT_TEMPLATES}>
          <EmptyTemplatesState />
        </HasPermission>
      )}
    </div>
  );
}
