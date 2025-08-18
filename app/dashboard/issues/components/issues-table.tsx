"use client";

import { DataTable } from "@/components/custom/data-table";
import { createColumns } from "./columns";
import { Issue } from "@/lib/types";
import { IssuesTableLoadingSkeleton } from "./issues-table-loading-skeleton";

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
  const columns = createColumns(assignees);

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
  return <DataTable columns={columns} data={issues} border />;
}
