"use client";

import { Issue } from "@/lib/types";
import { IssueDetails } from "./issue-details";

interface UpdateIssueProps {
  issue: Issue;
  onClose: () => void;
  assignees: Array<{
    id: string;
    full_name: string;
    email: string;
    role: string;
  }>;
}

export default function UpdateIssue({
  issue,
  onClose,
  assignees,
}: UpdateIssueProps) {
  return <IssueDetails issue={issue} onClose={onClose} assignees={assignees} />;
}
