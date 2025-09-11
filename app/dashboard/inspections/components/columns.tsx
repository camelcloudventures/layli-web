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
} from "lucide-react";
import { downloadInspectionPDF } from "../[id]/report/utils/pdf-generator";
import { useState } from "react";
import { toast } from "sonner";

// Separate component for actions
function InspectionActions({ inspection }: { inspection: Inspection }) {
  "use client";
  const [isDownloading, setIsDownloading] = useState(false);

  const handleContinue = () => {
    window.location.href = `/dashboard/inspections/${inspection.id}/edit`;
  };

  const handleViewReport = () => {
    window.location.href = `/dashboard/inspections/${inspection.id}/report`;
  };

  const handleStartInspection = () => {
    window.location.href = `/dashboard/inspections/${inspection.id}/edit`;
  };

  const handleDownloadReport = () => {
    setIsDownloading(true);
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
    }
  };

  if (inspection.status === InspectionStatus.COMPLETED) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleViewReport}>
            <FileText className="mr-2 h-4 w-4" />
            View Report
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDownloadReport}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Download Report
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (
    inspection.status === InspectionStatus.IN_PROGRESS ||
    inspection.status === InspectionStatus.PAUSED
  ) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleContinue}
        className="h-8 w-8 p-0"
      >
        <Play className="h-4 w-4" />
      </Button>
    );
  }

  if (inspection.status === InspectionStatus.PENDING) {
    console.log("inspections this side are 11111111111111", inspection);

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleStartInspection}>
            <Edit className="mr-2 h-4 w-4" />
            Start Inspection
          </DropdownMenuItem>
          {/* <DropdownMenuItem onClick={handleDownloadReport}>
            <Download className="mr-2 h-4 w-4" />
            View Inspection
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return null;
}

export const columns: ColumnDef<Inspection>[] = [
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
    cell: ({ row }) => <InspectionActions inspection={row.original} />,
  },
];
