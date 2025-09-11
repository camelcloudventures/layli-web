"use client";

import Comments from "@/components/custom/comments";
import { Badge } from "@/components/ui/badge";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Issue } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Paperclip } from "lucide-react";
import Link from "next/link";
import React from "react";
import Chip from "@/components/custom/chip";
import { Category, Priority, Status } from "@/lib/types";
type ViewIssueProps = {
  issue: Issue;
};

export default function ViewIssue({ issue }: ViewIssueProps) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>{issue.title}</DialogTitle>
        <DialogDescription>
          Opened on {formatDate(issue.created_at)} by {issue.reporter.full_name}
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="grid gap-2">
          <Label className="font-semibold">Status</Label>
          <div className="flex flex-wrap gap-2">
            <Chip type="status" value={issue.status as Status} />
          </div>
        </div>

        <div className="grid gap-2">
          <Label className="font-semibold">Priority</Label>
          <div className="flex flex-wrap gap-2">
            <Chip type="priority" value={issue.priority as Priority} />
          </div>
        </div>
        <div className="grid gap-2">
          <Label className="font-semibold">Category</Label>
          <div className="flex flex-wrap gap-2">
            <Chip type="category" value={issue.category as Category} />
          </div>
        </div>

        {issue.cause && (
          <div className="grid gap-2">
            <h3 className="text-sm font-medium">Cause</h3>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md border">
              {issue.cause}
            </p>
          </div>
        )}
        {issue.solution && (
          <div className="grid gap-2">
            <h3 className="text-sm font-medium">Solution</h3>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md border">
              {issue.solution}
            </p>
          </div>
        )}

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Assignees</h3>
          <div className="flex flex-wrap gap-2 min-h-[40px] items-center">
            {issue.assignees && issue.assignees.length > 0 ? (
              issue.assignees
                .filter(
                  (assignee) =>
                    assignee &&
                    assignee.full_name &&
                    assignee.full_name.trim() !== ""
                )
                .map((assignee) => (
                  <Badge
                    key={assignee.id}
                    variant="secondary"
                    className="bg-blue-100 text-blue-800 hover:bg-blue-100"
                  >
                    {assignee.full_name}
                  </Badge>
                ))
            ) : (
              <span className="text-sm text-muted-foreground">
                No assignees selected
              </span>
            )}
          </div>
        </div>

        {issue.due_at && (
          <div className="grid gap-2">
            <Label htmlFor="due-date">Due Date</Label>
            <p className="text-sm">{formatDate(issue.due_at)}</p>
          </div>
        )}
        <Separator />
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Attachments</h3>
          {issue.attachments && issue.attachments.length > 0 ? (
            <ul className="divide-y divide-gray-200 rounded-md border border-gray-200">
              {issue.attachments.map((file) => (
                <li
                  key={file.id}
                  className="flex items-center justify-between py-3 pl-3 pr-4 text-sm"
                >
                  <div className="flex w-0 flex-1 items-center">
                    <Paperclip
                      className="h-5 w-5 flex-shrink-0 text-gray-400"
                      aria-hidden="true"
                    />
                    <span className="ml-2 w-0 flex-1 truncate">
                      {file?.file_name}
                    </span>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <Link
                      href={file.file_url}
                      target="_blank"
                      className="font-medium text-blue-600 hover:text-blue-500"
                    >
                      Download
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No attachments</p>
          )}
        </div>
        <Separator />
        <Comments comments={issue.comments} />
      </div>
    </>
  );
}
