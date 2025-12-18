"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { deletePage } from "@/app/dashboard/templates/actions/actions";
import { toast } from "sonner";
import { useAuditTemplates } from "@/hooks/use-audit-templates";

interface DeletePageButtonProps {
  pageId: string;
  templateId: string;
  onDeleteSuccess?: () => void;
}

export function DeletePageButton({
  pageId,
  templateId,
  onDeleteSuccess,
}: DeletePageButtonProps) {
  const [loading, setLoading] = useState(false);
  const { reset } = useAuditTemplates();

  async function handleDelete() {
    console.log("delete page btn pinged!!!!!!!!!!!---------");
    setLoading(true);
    const result = await deletePage(pageId, templateId);

    console.log("result after page deletion is here", result);
    if (result && result.success) {
      toast.success(result.success);
      onDeleteSuccess?.();
      reset(); // Reset the store to trigger a refetch
    } else if (result && result.error) {
      toast.error(result.error);
    }

    setLoading(false);
  }

  return (
    <DeleteDialog
      title="Delete Page"
      description="Are you sure you want to delete this page? This action cannot be undone."
      onDelete={handleDelete}
      trigger={
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Delete Page"
          disabled={loading}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      }
    />
  );
}
