"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Issue } from "@/lib/types";
import { deleteIssue } from "../actions/actions";
import { useIssuesStore } from "@/store/issues";

interface DeleteIssueProps {
  issue: Issue;
  onClose: () => void;
}

export default function DeleteIssue({ issue, onClose }: DeleteIssueProps) {
  const { setIssues } = useIssuesStore();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteIssue = async () => {
    setIsDeleting(true);

    const response = await deleteIssue(issue.id);
    console.log("respone from delete", response);

    //@ts-expect-error --need to fix this
    if (response?.success) {
      //@ts-expect-error -e9
      toast.success(response?.success || "Issue deleted successfully");
      // Optimistically remove the issue from the store
      setIssues((prevIssues) => prevIssues.filter((i) => i.id !== issue.id));
      onClose();
    } else {
      //@ts-expect-error --need to fix this
      toast.error(response?.error || "Failed to delete issue");
    }

    setIsDeleting(false);
  };

  return (
    <div className="space-y-4">
      <p className="mt-1 text-sm text-gray-500">
        Are you sure you want to delete &quot;{issue.title}&quot;? This action
        cannot be undone.
      </p>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isDeleting}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={handleDeleteIssue}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete Issue"}
        </Button>
      </div>
    </div>
  );
}
