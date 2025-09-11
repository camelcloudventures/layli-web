"use client";
import { Action, ActionPriority, ActionStatus } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Hash, Users2, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { deleteAction } from "../actions/actions";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useActionsStore } from "@/store/actions";
import { MarkAsDoneDialog } from "./mark-as-done-dialog";

const getPriorityBadgeColor = (priority: ActionPriority) => {
  switch (priority) {
    case ActionPriority.HIGH:
      return "bg-red-100 text-red-800 hover:bg-red-100/80";
    case ActionPriority.MEDIUM:
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80";
    case ActionPriority.LOW:
      return "bg-green-100 text-green-800 hover:bg-green-100/80";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100/80";
  }
};

// Separate component for the actions cell to fix useState issue
function ActionCell({
  action,
  onEdit,
}: {
  action: Action;
  onEdit?: (action: Action) => void;
}) {
  const [open, setOpen] = useState(false);
  const { setActions } = useActionsStore();
  const isDone = action.status === ActionStatus.DONE;

  // Reset dialog state when action changes
  useEffect(() => {
    setOpen(false);
  }, [action.id]);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-6">
          <DialogHeader>
            <DialogTitle>Mark as Done</DialogTitle>
          </DialogHeader>
          <MarkAsDoneDialog
            isOpen={open}
            key={action.id}
            action={action}
            onSuccess={(updatedAction) => {
              setActions((prev) =>
                prev.map((a) => (a.id === updatedAction.id ? updatedAction : a))
              );
              setOpen(false);
            }}
            onOpenChange={setOpen}
          />
        </DialogContent>
      </Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {onEdit && (
            <DropdownMenuItem onClick={() => onEdit(action)}>
              Edit
            </DropdownMenuItem>
          )}
          {!isDone && (
            <DropdownMenuItem onClick={() => setOpen(true)}>
              Mark as Done
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className="text-red-500"
            onClick={() => {
              toast.promise(deleteAction(action.id), {
                loading: "Deleting action...",
                success: (data) => {
                  console.log("data", data);
                  setActions((prev) => prev.filter((a) => a.id !== action.id));
                  return "Action deleted successfully";
                },
                error: "Failed to delete action",
              });
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export const columns = (
  onEdit?: (action: Action) => void
): ColumnDef<Action>[] => [
  {
    accessorKey: "code",
    header: "Action Code",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Hash className="h-4 w-4" />
        <span>{row.original.code}</span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      switch (status) {
        case ActionStatus.DONE:
          return (
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
              Done
            </Badge>
          );
        case ActionStatus.IN_PROGRESS:
          return (
            <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80">
              In Progress
            </Badge>
          );
        case ActionStatus.TODO:
          return (
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100/80">
              To Do
            </Badge>
          );
        default:
          return (
            <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100/80">
              {status.replace("_", " ")}
            </Badge>
          );
      }
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => (
      <Badge className={getPriorityBadgeColor(row.original.priority)}>
        {row.original.priority}
      </Badge>
    ),
  },
  {
    accessorKey: "due_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Due Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <span>{formatDate(row.original.due_at)}</span>;
    },
  },
  {
    accessorKey: "assignees",
    header: "Assignee",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Users2 className="h-4 w-4" />
        <span>{row.original.assignees.length}</span>
      </div>
    ),
  },
  {
    accessorKey: "site",
    header: "Site",
    cell: ({ row }) => <span>{row.original.site?.name}</span>,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionCell action={row.original} onEdit={onEdit} />,
  },
];
