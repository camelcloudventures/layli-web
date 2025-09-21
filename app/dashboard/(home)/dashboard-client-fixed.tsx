"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

import { AuditItem } from "./components/audit-item";

import { useAnalyticsComprehensive } from "@/hooks/use-analytics-comprehensive";
import { useInspections } from "@/hooks/use-inspections";
import { useIssues } from "@/hooks/use-issues";
import { useNotifications } from "@/hooks/use-notifications";
import TopBar from "./components/top-bar";
import HomeTabs from "./tabs/home-tabs";
import { InspectionCardSkeleton } from "./components/inspection-card-skeleton";

export const dynamic = "force-dynamic";

// Mock user data
const mockUser = {
  fullName: "Demo User",
  email: "demo@example.com",
  role: "admin", // Can be "admin", "auditor", or "supervisor"
  image: "",
};

export function DashboardClient() {
  const { notifications } = useNotifications();
  const { summaryMetrics, issuesData } = useAnalyticsComprehensive();
  const { inspections: inspectionsData, isLoading: inspectionsDataLoading } =
    useInspections();
  const { issues: issuesDataList, isLoading: issuesDataLoading } = useIssues();

  console.log("notifications are", notifications);

  // Transform real data for the overview stats
  const stats = [
    {
      id: 1,
      title: "Total Inspections",
      value: summaryMetrics?.totalInspections || 0,
      description: "All time inspections",
      icon: "FileText",
    },
    {
      id: 2,
      title: "Total Sites",
      value: 5, // Default value since we don't have this in comprehensive data
      description: "Active sites",
      icon: "Users",
    },
    {
      id: 3,
      title: "Pending Inspections",
      value: Math.floor((summaryMetrics?.totalInspections || 0) * 0.2), // Estimate
      description: "Awaiting completion",
      icon: "Clock",
    },
    {
      id: 4,
      title: "Completed Inspections",
      value: Math.floor((summaryMetrics?.totalInspections || 0) * 0.8), // Estimate
      description: "Successfully completed",
      icon: "CheckCircle2",
    },
    {
      id: 5,
      title: "Average Score",
      value: summaryMetrics?.averageScore || 0,
      description: "Across all inspections",
      icon: "CheckCircle2",
    },
    {
      id: 6,
      title: "Open Issues",
      value: summaryMetrics?.openIssues || 0,
      description: "Requiring attention",
      icon: "Flag",
    },
    {
      id: 7,
      title: "Pass Rate",
      value: summaryMetrics?.totalInspections
        ? Math.round(
            ((summaryMetrics.totalInspections - summaryMetrics.openIssues) /
              summaryMetrics.totalInspections) *
              100
          )
        : 0,
      description: "Success rate",
      icon: "Layers",
    },
    {
      id: 8,
      title: "Action Completion",
      value: summaryMetrics?.actionCompletionRate || 0,
      description: "Completion rate",
      icon: "CheckCircle2",
    },
  ];

  // Transform real data for analytics charts
  const inspectionTrends = [
    {
      month: "Jan",
      completed: Math.floor((summaryMetrics?.totalInspections || 0) * 0.1),
      passed: Math.floor((summaryMetrics?.totalInspections || 0) * 0.08),
      failed: Math.floor((summaryMetrics?.totalInspections || 0) * 0.02),
    },
    {
      month: "Feb",
      completed: Math.floor((summaryMetrics?.totalInspections || 0) * 0.15),
      passed: Math.floor((summaryMetrics?.totalInspections || 0) * 0.12),
      failed: Math.floor((summaryMetrics?.totalInspections || 0) * 0.03),
    },
    {
      month: "Mar",
      completed: Math.floor((summaryMetrics?.totalInspections || 0) * 0.2),
      passed: Math.floor((summaryMetrics?.totalInspections || 0) * 0.16),
      failed: Math.floor((summaryMetrics?.totalInspections || 0) * 0.04),
    },
    {
      month: "Apr",
      completed: Math.floor((summaryMetrics?.totalInspections || 0) * 0.25),
      passed: Math.floor((summaryMetrics?.totalInspections || 0) * 0.2),
      failed: Math.floor((summaryMetrics?.totalInspections || 0) * 0.05),
    },
    {
      month: "May",
      completed: Math.floor((summaryMetrics?.totalInspections || 0) * 0.2),
      passed: Math.floor((summaryMetrics?.totalInspections || 0) * 0.16),
      failed: Math.floor((summaryMetrics?.totalInspections || 0) * 0.04),
    },
    {
      month: "Jun",
      completed: Math.floor((summaryMetrics?.totalInspections || 0) * 0.1),
      passed: Math.floor((summaryMetrics?.totalInspections || 0) * 0.08),
      failed: Math.floor((summaryMetrics?.totalInspections || 0) * 0.02),
    },
  ];

  const issuesByCategory = issuesData?.issuesByCategory
    ? Object.entries(issuesData.issuesByCategory).map(([category, count]) => ({
        name: category.charAt(0).toUpperCase() + category.slice(1),
        value: count,
      }))
    : [];

  const actionCompletionRate = [
    {
      month: "Jan",
      rate: Math.floor((summaryMetrics?.actionCompletionRate || 0) * 0.8),
    },
    {
      month: "Feb",
      rate: Math.floor((summaryMetrics?.actionCompletionRate || 0) * 0.85),
    },
    {
      month: "Mar",
      rate: Math.floor((summaryMetrics?.actionCompletionRate || 0) * 0.9),
    },
    {
      month: "Apr",
      rate: Math.floor((summaryMetrics?.actionCompletionRate || 0) * 0.95),
    },
    {
      month: "May",
      rate: summaryMetrics?.actionCompletionRate || 0,
    },
    {
      month: "Jun",
      rate: Math.floor((summaryMetrics?.actionCompletionRate || 0) * 1.05),
    },
  ];

  // Get recent inspections (limit to 5 most recent)
  const recentInspections = inspectionsData
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 5)
    .map((inspection, index) => ({
      id: index + 1,
      title: inspection.title,
      status: inspection.status as "completed" | "in-progress" | "pending",
      date: new Date(inspection.created_at).toISOString().split("T")[0],
      assignedTo: inspection.assignees?.[0]?.full_name || "Unassigned",
    }));
  // Prepare data for reports
  const reportData = {
    // Audit Summary Report Data
    auditSummary: {
      totalInspections: summaryMetrics?.totalInspections || 0,
      completedInspections: Math.floor(
        (summaryMetrics?.totalInspections || 0) * 0.8
      ),
      pendingInspections: Math.floor(
        (summaryMetrics?.totalInspections || 0) * 0.2
      ),
      totalIssues: issuesDataLoading ? issuesDataList.length : 0,
      resolvedIssues: issuesDataLoading
        ? issuesDataList.filter((issue) => issue.status === "closed").length
        : 0,
      recentInspections: recentInspections,
    },
    // Issues Report Data
    issues: {
      totalIssues: issuesDataLoading ? issuesDataList.length : 0,
      resolvedIssues: issuesDataLoading
        ? issuesDataList.filter((issue) => issue.status === "closed").length
        : 0,
      openIssues: issuesDataLoading
        ? issuesDataList.filter((issue) => issue.status === "open").length
        : 0,
      issuesByCategory: issuesData?.issuesByCategory || {},
      criticalIssues: issuesDataLoading
        ? issuesDataList
            .filter(
              (issue) => issue.priority === "high" && issue.status === "open"
            )
            .slice(0, 3)
        : [],
      topRecurringIssues: issuesData?.topRecurringIssues || [],
    },
  };

  // Create compatible summary object for HomeTabs
  const compatibleSummary = summaryMetrics
    ? {
        total_inspections: summaryMetrics.totalInspections,
        total_sites: 5, // Default value
        average_score: summaryMetrics.averageScore,
        failed_inspections: summaryMetrics.openIssues,
        passed_inspections:
          summaryMetrics.totalInspections - summaryMetrics.openIssues,
      }
    : null;

  return (
    <div className="flex flex-col gap-6 w-full">
      <TopBar user={mockUser} />

      <HomeTabs
        stats={stats}
        notifications={notifications || []}
        inspectionTrends={inspectionTrends}
        issuesByCategory={issuesByCategory}
        actionCompletionRate={actionCompletionRate}
        summary={compatibleSummary}
        reportData={reportData}
      />
      {/* Recent Inspections Section */}
      <div className="rounded-lg border text-card-foreground">
        <div className="flex flex-row items-center justify-between p-6 pb-2">
          <div>
            <h3 className="text-lg font-semibold leading-none tracking-tight">
              Recent Inspections
            </h3>
            <p className="text-sm text-muted-foreground">
              {recentInspections.length > 0
                ? "A list of your recent inspections and their status"
                : ""}
            </p>
          </div>
          {recentInspections.length > 0 && (
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/inspections">View all</Link>
            </Button>
          )}
        </div>
        <div className="p-6 pt-2">
          {inspectionsDataLoading ? (
            <InspectionCardSkeleton />
          ) : recentInspections.length > 0 ? (
            <div className="space-y-4">
              {recentInspections.map((inspection) => (
                <AuditItem
                  key={inspection.id}
                  id={inspection.id}
                  title={inspection.title}
                  status={inspection.status}
                  date={inspection.date}
                  assignedTo={inspection.assignedTo}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No recent inspections found</p>
            </div>
          )}
        </div>
        <div className="p-6 pt-0">
          {recentInspections.length > 0 && (
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link href="/dashboard/inspections">View all inspections</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
