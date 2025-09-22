"use client";

import { Button } from "@/components/ui/button";
import { FileText, Flag } from "lucide-react";
import { ReportDialog } from "../components/report-dialog";

type IProps = {
  setReportDialogState: (state: {
    open: boolean;
    type: "auditSummary" | "compliance" | "issues";
  }) => void;
  reportDialogState: {
    open: boolean;
    type: "auditSummary" | "compliance" | "issues";
  };
  reportData?: {
    auditSummary: {
      totalInspections: number;
      completedInspections: number;
      pendingInspections: number;
      totalIssues: number;
      resolvedIssues: number;
      recentInspections: Array<{
        id: number;
        title: string;
        status: string;
        date: string;
        assignedTo: string;
      }>;
    };
    issues: {
      totalIssues: number;
      resolvedIssues: number;
      openIssues: number;
      issuesByCategory: Record<string, number>;
      criticalIssues: Array<{
        id: string;
        title: string;
        category: string;
        priority: string;
        due_at: string;
        assignees: Array<{
          id: string;
          full_name: string;
          email: string;
          role: string;
        }>;
      }>;
      topRecurringIssues: Array<{
        title: string;
        occurrences: number;
      }>;
    };
  };
};

export default function Reports({
  setReportDialogState,
  reportDialogState,
  reportData,
}: IProps) {
  return (
    <div className="w-full">
      <div className="rounded-lg border text-card-foreground">
        <div className="p-6">
          <h3 className="text-lg font-semibold leading-none tracking-tight">
            Reports
          </h3>
          <p className="text-sm text-muted-foreground">
            Generate and view reports for your audits and issues
          </p>
        </div>
        <div className="p-6 pt-0 ">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border text-card-foreground flex flex-col items-center p-4 text-center">
              <FileText className="h-10 w-10 text-primary mb-2" />
              <h3 className="font-medium">Audit Summary</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Overview of all audit activities
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-auto"
                onClick={() =>
                  setReportDialogState({ open: true, type: "auditSummary" })
                }
              >
                Generate
              </Button>
            </div>

            <div className="rounded-lg border text-card-foreground flex flex-col items-center p-4 text-center">
              <Flag className="h-10 w-10 text-primary mb-2" />
              <h3 className="font-medium">Issues Report</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Summary of identified issues
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-auto"
                onClick={() =>
                  setReportDialogState({ open: true, type: "issues" })
                }
              >
                Generate
              </Button>
            </div>
          </div>
        </div>
      </div>
      <ReportDialog
        open={reportDialogState.open}
        onOpenChange={(open) =>
          setReportDialogState({ ...reportDialogState, open })
        }
        reportType={reportDialogState.type}
        reportData={reportData}
      />
    </div>
  );
}
