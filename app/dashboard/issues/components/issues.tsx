"use client";

import PageHeader from "@/components/custom/page-header";
import { User } from "@/lib/types";
import { ReportIssueForm } from "./report-issue-form";
import { Download, Plus } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogContent,
} from "@/components/ui/dialog";
import { Issue } from "@/lib/types/issue-types";

function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function convertToCSV(issues: Issue[]) {
  console.log("issues", issues);
  const headers = [
    "Code",
    "Title",
    "Status",
    "Priority",
    "Category",
    "Site",
    "Location",
    "Cause",
    "Solution",
    "Due Date",
    "Date Occurred",
    "Assignees",
    "Reporter",
  ];
  const rows = issues.map((issue) => {
    const assignees =
      issue.assignees?.map((a) => a.full_name).join(", ") ?? "N/A";
    const reporter = issue.reporter?.full_name ?? "N/A";
    const siteName = issue.site?.name ?? "N/A";

    return [
      issue.code ?? "N/A",
      `"${issue.title.replace(/"/g, '""')}"`,
      issue.status,
      issue.priority,
      issue.category,
      `"${siteName.replace(/"/g, '""')}"`,
      `"${(issue.location ?? "N/A").replace(/"/g, '""')}"`,
      `"${(issue.cause ?? "N/A").replace(/"/g, '""')}"`,
      `"${(issue.solution ?? "N/A").replace(/"/g, '""')}"`,
      issue.due_at ?? "N/A",
      issue.date_occurred ?? "N/A",
      `"${assignees.replace(/"/g, '""')}"`,
      `"${reporter.replace(/"/g, '""')}"`,
    ];
  });

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
}

export default function Issues({
  users,
  issues,
}: {
  users: User[];
  issues: Issue[];
}) {
  const [isReportIssueDialogOpen, setIsReportIssueDialogOpen] = useState(false);

  function handleExportCSV() {
    const csv = convertToCSV(issues);
    downloadCSV(csv, "issues.csv");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Issues"
          description="Track and manage audit issues"
          actions={[
            {
              label: "Export CSV",
              onClick: handleExportCSV,
              icon: <Download className="mr-2 h-4 w-4" />,
              variant: "outline",
            },
            {
              label: "Report Issue",
              onClick: () => setIsReportIssueDialogOpen(true),
              icon: <Plus className="mr-2 h-4 w-4" />,
              variant: "default",
            },
          ]}
        />
      </div>

      <Dialog
        open={isReportIssueDialogOpen}
        onOpenChange={setIsReportIssueDialogOpen}
      >
        <DialogContent className="w-[95vw] sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader className="">
            <DialogTitle>Report Issue</DialogTitle>
            <DialogDescription>
              Report a new issue that requires attention or action.
            </DialogDescription>
          </DialogHeader>
          <ReportIssueForm
            users={users}
            onCancel={() => setIsReportIssueDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
