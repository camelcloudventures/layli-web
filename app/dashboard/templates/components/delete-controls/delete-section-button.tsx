"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { deleteSection } from "@/app/dashboard/templates/actions/actions";
import { toast } from "sonner";
import { useAuditTemplates } from "@/hooks/use-audit-templates";

interface DeleteSectionButtonProps {
  sectionId: string;
  pageId: string;
}

export function DeleteSectionButton({
  sectionId,
  pageId,
}: DeleteSectionButtonProps) {
  const [loading, setLoading] = useState(false);
  const { reset } = useAuditTemplates();

  async function handleDelete() {
    setLoading(true);
    const result = await deleteSection(sectionId, pageId);

    console.log("result", result);

    // @ts-expect-error --need to fix this
    if (result && result.success) {
      // @ts-expect-error --need to fix this
      toast.success(result.success);
      const value = reset();
      console.log("store", value);
      // @ts-expect-error --need to fix this
    } else if (result && result.error) {
      // @ts-expect-error --need to fix this
      toast.error(result.error);
    }
    setLoading(false);
  }

  return (
    <DeleteDialog
      title="Delete Section"
      description="Are you sure you want to delete this section? This action cannot be undone."
      onDelete={handleDelete}
      trigger={
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Delete Section"
          disabled={loading}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      }
    />
  );
}
