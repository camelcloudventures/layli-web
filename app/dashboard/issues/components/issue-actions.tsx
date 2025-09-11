"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2, Pencil, CheckCircle, Eye } from "lucide-react";
import { Issue } from "@/lib/types";

type DialogType = "update" | "close" | "delete" | "view" | null;

interface IssueActionsProps {
  issue: Issue;

  onOpenDialog: (dialog: DialogType, issue: Issue) => void;
}

export function IssueActions({ issue, onOpenDialog }: IssueActionsProps) {
  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {issue.status === "closed" && (
            <DropdownMenuItem onClick={() => onOpenDialog("view", issue)}>
              <Eye className="mr-2 h-4 w-4" />
              View issue
            </DropdownMenuItem>
          )}
          {issue.status !== "closed" && (
            <DropdownMenuItem onClick={() => onOpenDialog("update", issue)}>
              <Pencil className="mr-2 h-4 w-4" />
              Update issue
            </DropdownMenuItem>
          )}
          {issue.status !== "closed" && (
            <DropdownMenuItem onClick={() => onOpenDialog("close", issue)}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Close issue
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className="text-red-500"
            onClick={() => onOpenDialog("delete", issue)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete issue
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
