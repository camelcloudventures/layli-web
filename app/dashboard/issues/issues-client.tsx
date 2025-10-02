"use client";

import { useIssues } from "@/hooks/use-issues";
import { useUsers } from "@/hooks/use-users";
import { useSites } from "@/hooks/use-sites";
import IssueSearch from "./components/issue-search";
import Issues from "./components/issues";
import IssuesTable from "./components/issues-table";

export default function IssuesClient() {
  const { users } = useUsers();
  const { sites } = useSites();

  const { issues, isLoading: isLoadingIssues } = useIssues();

  const assignees =
    users?.map((user) => ({
      id: user?.user?.id,
      full_name: user?.user?.full_name,
      email: user?.user?.email,
      role: user?.user?.role,
    })) || [];

  return (
    <div className="space-y-4">
      {/* @ts-expect-error - sites.data structure needs to be fixed */}
      <Issues users={users || []} sites={sites || []} issues={issues || []} />
      <IssueSearch />

      <IssuesTable
        issues={issues || []}
        assignees={assignees}
        isLoading={isLoadingIssues}
      />
    </div>
  );
}
