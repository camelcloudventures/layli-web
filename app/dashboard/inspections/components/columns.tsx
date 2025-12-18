"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { Inspection, InspectionStatus } from "@/lib/types/inspection-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileText,
  Edit,
  Download,
  Play,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  AlertTriangle,
  PauseCircle,
  XCircle,
  ArrowUpDown,
  Loader2,
  Users,
  Calendar,
} from "lucide-react";
import { downloadInspectionPDF } from "../[id]/report/utils/pdf-generator";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UserOption } from "@/app/dashboard/schedules/types/schedule-form-types";
import { ManageAssigneesDialog } from "./manage-assignees-dialog";
import { UpdateDueDateDialog } from "./update-due-date-dialog";

// Loading overlay component with blurred background
function LoadingOverlay({
  isOpen,
  message,
}: {
  isOpen: boolean;
  message?: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Loading"
    >
      <div className="flex flex-col items-center gap-4 rounded-lg bg-white p-8 shadow-xl">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm font-medium text-gray-700">
          {message || "Loading..."}
        </p>
      </div>
    </div>,
    document.body
  );
}

// Separate component for actions
function InspectionActions({
  inspection,
  users,
}: {
  inspection: Inspection;
  users: UserOption[];
}) {
  const router = useRouter();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [isManageAssigneesOpen, setIsManageAssigneesOpen] = useState(false);
  const [isUpdateDueDateOpen, setIsUpdateDueDateOpen] = useState(false);

  const isLoading = isDownloading || isNavigating;

  function handleNavigate(path: string, message: string) {
    setLoadingMessage(message);
    setIsNavigating(true);
    router.push(path);
  }

  function handleDownloadReport() {
    setLoadingMessage("Generating PDF report...");
    setIsDownloading(true);
    // Use setTimeout to allow the overlay to render before the synchronous PDF generation
    setTimeout(() => {
      try {
        const safeTitle = inspection.title
          .replace(/[^a-zA-Z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .toLowerCase();
        //@ts-expect-error - needs type
        downloadInspectionPDF(inspection, {
          filename: `${safeTitle}-report.pdf`,
        });
        toast.success("Report downloaded successfully");
      } catch (error) {
        console.error("Failed to generate PDF:", error);
        toast.error("Could not generate PDF report.");
      } finally {
        setIsDownloading(false);
        setLoadingMessage("");
      }
    }, 100);
  }

  function handleManageAssignees() {
    setIsManageAssigneesOpen(true);
  }

  function handleUpdateDueDate() {
    setIsUpdateDueDateOpen(true);
  }

  function handleSuccess() {
    // Refresh inspections list - the store will be updated by the action
    // The component will re-render when the store updates
  }

  if (inspection.status === InspectionStatus.COMPLETED) {
    return (
      <>
        <LoadingOverlay isOpen={isLoading} message={loadingMessage} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() =>
                handleNavigate(
                  `/dashboard/inspections/${inspection.id}/report`,
                  "Loading report..."
                )
              }
              disabled={isLoading}
            >
              <FileText className="mr-2 h-4 w-4" />
              View Report
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDownloadReport}
              disabled={isLoading}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleUpdateDueDate}
              disabled={isLoading}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Update Due Date
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <UpdateDueDateDialog
          isOpen={isUpdateDueDateOpen}
          onOpenChange={setIsUpdateDueDateOpen}
          inspection={inspection}
          onSuccess={handleSuccess}
        />
      </>
    );
  }

  if (
    inspection.status === InspectionStatus.IN_PROGRESS ||
    inspection.status === InspectionStatus.PAUSED
  ) {
    return (
      <>
        <LoadingOverlay isOpen={isLoading} message={loadingMessage} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() =>
                handleNavigate(
                  `/dashboard/inspections/${inspection.id}/edit`,
                  "Loading inspection..."
                )
              }
              disabled={isLoading}
            >
              <Play className="mr-2 h-4 w-4" />
              Continue Inspection
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleUpdateDueDate}
              disabled={isLoading}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Update Due Date
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <UpdateDueDateDialog
          isOpen={isUpdateDueDateOpen}
          onOpenChange={setIsUpdateDueDateOpen}
          inspection={inspection}
          onSuccess={handleSuccess}
        />
      </>
    );
  }

  if (inspection.status === InspectionStatus.PENDING) {
    return (
      <>
        <LoadingOverlay isOpen={isLoading} message={loadingMessage} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() =>
                handleNavigate(
                  `/dashboard/inspections/${inspection.id}/edit`,
                  "Loading inspection..."
                )
              }
              disabled={isLoading}
            >
              <Edit className="mr-2 h-4 w-4" />
              Start Inspection
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleManageAssignees}
              disabled={isLoading}
            >
              <Users className="mr-2 h-4 w-4" />
              Manage Assignees
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleUpdateDueDate}
              disabled={isLoading}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Update Due Date
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ManageAssigneesDialog
          isOpen={isManageAssigneesOpen}
          onOpenChange={setIsManageAssigneesOpen}
          inspection={inspection}
          users={users}
          onSuccess={handleSuccess}
        />
        <UpdateDueDateDialog
          isOpen={isUpdateDueDateOpen}
          onOpenChange={setIsUpdateDueDateOpen}
          inspection={inspection}
          onSuccess={handleSuccess}
        />
      </>
    );
  }

  return null;
}

export function columns(users: UserOption[]): ColumnDef<Inspection>[] {
  return [
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 hover:bg-transparent"
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "site",
      header: "Location",
      cell: ({ row }) => {
        const site = row.original.site;
        return site?.name || "N/A";
      },
    },
    {
      accessorKey: "due_date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 hover:bg-transparent"
          >
            Due Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return row.original.due_date
          ? format(parseISO(row.original.due_date), "MMM d, yyyy")
          : "N/A";
      },
    },
    {
      accessorKey: "final_score",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 hover:bg-transparent"
          >
            Score
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return row.original.final_score !== null
          ? `${row.original.final_score}%`
          : "Not Completed";
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 hover:bg-transparent"
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const status = row.original.status;
        switch (status) {
          case InspectionStatus.COMPLETED:
            return (
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Completed
              </Badge>
            );
          case InspectionStatus.IN_PROGRESS:
            return (
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                <Clock className="mr-1 h-3 w-3" />
                In Progress
              </Badge>
            );
          case InspectionStatus.PAUSED:
            return (
              <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">
                <PauseCircle className="mr-1 h-3 w-3" />
                Paused
              </Badge>
            );
          case InspectionStatus.CANCELLED:
            return (
              <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
                <XCircle className="mr-1 h-3 w-3" />
                Cancelled
              </Badge>
            );
          default:
            return (
              <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                <AlertTriangle className="mr-1 h-3 w-3" />
                Pending
              </Badge>
            );
        }
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <InspectionActions inspection={row.original} users={users} />
      ),
    },
  ];
}
