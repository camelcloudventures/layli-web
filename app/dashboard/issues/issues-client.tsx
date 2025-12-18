"use client";

import { useIssues } from "@/hooks/use-issues";
import { useUsers } from "@/hooks/use-users";
import { useSites } from "@/hooks/use-sites";
import { useState, useMemo } from "react";
import IssueSearch from "./components/issue-search";
import Issues from "./components/issues";
import IssuesTable from "./components/issues-table";

type FilterMode = "active" | "closed";

export default function IssuesClient() {
  const { users } = useUsers();
  const { sites } = useSites();

  const { issues, isLoading: isLoadingIssues } = useIssues();
  const [filterMode, setFilterMode] = useState<FilterMode>("active");

  const filteredIssues = useMemo(() => {
    if (!issues || issues.length === 0) return [];

    if (filterMode === "active") {
      return issues.filter(
        (issue) => issue.status === "open" || issue.status === "in_progress"
      );
    } else {
      return issues.filter(
        (issue) => issue.status === "closed" || issue.status === "resolved"
      );
    }
  }, [issues, filterMode]);

  const assignees =
    users?.map((user) => ({
      id: user?.user?.id,
      full_name: user?.user?.full_name,
      email: user?.user?.email,
      role: user?.user?.role,
    })) || [];

  return (
    <div className="space-y-4">
      <Issues
        users={users || []}
        //@ts-expect-error - sites.data structure needs to be fixed
        sites={sites || []}
        issues={filteredIssues}
        filterMode={filterMode}
        onFilterChange={setFilterMode}
      />
      <IssueSearch />

      <IssuesTable
        issues={filteredIssues}
        assignees={assignees}
        isLoading={isLoadingIssues}
      />
    </div>
  );
}
