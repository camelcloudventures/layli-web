"use client";

import { DataTable } from "@/components/custom/data-table";
import { createColumns } from "./columns";
import { Issue } from "@/lib/types";
import { IssuesTableLoadingSkeleton } from "./issues-table-loading-skeleton";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import UpdateIssue from "./update-issue";
import CloseIssue from "./close-issue";
import DeleteIssue from "./delete-issue";
import ViewIssue from "./view-issue";

type DialogType = "update" | "close" | "delete" | "view" | null;

interface IssuesTableProps {
  issues: Issue[];
  isLoading?: boolean;
  assignees: Array<{
    id: string;
    full_name: string;
    email: string;
    role: string;
  }>;
}

export default function IssuesTable({
  issues,
  assignees,
  isLoading,
}: IssuesTableProps) {
  const [activeDialog, setActiveDialog] = useState<DialogType>(null);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  const handleOpenDialog = (dialog: DialogType, issue: Issue) => {
    setSelectedIssue(issue);
    setActiveDialog(dialog);
  };

  const handleCloseDialog = () => {
    setSelectedIssue(null);
    setActiveDialog(null);
  };

  const columns = createColumns(assignees, handleOpenDialog);

  if (isLoading) {
    return <IssuesTableLoadingSkeleton />;
  }
  if (!issues || issues.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No issues found</p>
      </div>
    );
  }
  return (
    <>
      <DataTable columns={columns} data={issues} border />
      <Dialog open={activeDialog !== null} onOpenChange={handleCloseDialog}>
        <DialogContent className=" sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-4 sm:p-6overflow-hidden hover:overflow-y-auto scrollbar-none ">
          <DialogHeader className="pb-4">
            <DialogTitle>
              {activeDialog === "update" && "Issue Details"}
              {activeDialog === "view" && "Issue Details"}
              {activeDialog === "close" && "Close Issue"}
              {activeDialog === "delete" && "Delete Issue"}
            </DialogTitle>
          </DialogHeader>
          {selectedIssue && (
            <>
              {activeDialog === "update" && (
                <UpdateIssue
                  issue={selectedIssue}
                  onClose={handleCloseDialog}
                  assignees={assignees}
                />
              )}
              {activeDialog === "view" && <ViewIssue issue={selectedIssue} />}
              {activeDialog === "close" && (
                <CloseIssue issue={selectedIssue} onClose={handleCloseDialog} />
              )}
              {activeDialog === "delete" && (
                <DeleteIssue
                  issue={selectedIssue}
                  onClose={handleCloseDialog}
                />
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
