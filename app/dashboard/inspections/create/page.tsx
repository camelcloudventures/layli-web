"use client";
import { useAuditTemplates } from "@/hooks/use-audit-templates";
import { useSites } from "@/hooks/use-sites";
import { useUsers } from "@/hooks/use-users";
import { CreateInspectionForm } from "./components/create-inspection-form";

export default function CreateInspectionPage() {
  const { sites } = useSites();
  const { users } = useUsers();
  const { templates } = useAuditTemplates();

  console.log("templates", templates);

  return (
    <div className="container mx-auto py-6">
      <CreateInspectionForm
        sites={sites || []}
        users={users || []}
        templates={templates || []}
      />
    </div>
  );
}
