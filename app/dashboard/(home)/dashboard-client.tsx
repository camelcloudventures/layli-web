"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

import { AuditItem } from "./components/audit-item";

import { useAnalyticsComprehensive } from "@/hooks/use-analytics-comprehensive";
import { useInspections } from "@/hooks/use-inspections";
import { useIssues } from "@/hooks/use-issues";
import { useNotifications } from "@/hooks/use-notifications";
import { useSites } from "@/hooks/use-sites";
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
  const { summaryMetrics, issuesData, actionsData } =
    useAnalyticsComprehensive();
  const { inspections: inspectionsData, isLoading: inspectionsDataLoading } =
    useInspections();
  const { issues: issuesDataList } = useIssues();
  const { sites } = useSites();

  console.log("notifications are", notifications);

  // Use analytics data where available, calculate specific metrics from inspection data
  const totalSites = sites?.length || 0;

  // Debug sites data
  console.log("sites data:", sites);
  console.log("totalSites:", totalSites);

  // Calculate pending and completed inspections from actual data since analytics doesn't provide these
  const pendingInspections = inspectionsData.filter(
    (inspection) => inspection.status === "pending"
  ).length;
  const completedInspections = inspectionsData.filter(
    (inspection) => inspection.status === "completed"
  ).length;

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
      value: totalSites,
      description: "Active sites",
      icon: "Users",
    },
    {
      id: 3,
      title: "Pending Inspections",
      value: pendingInspections,
      description: "Awaiting completion",
      icon: "Clock",
    },
    {
      id: 4,
      title: "Completed Inspections",
      value: completedInspections,
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
      value:
        actionsData?.completionRate ||
        summaryMetrics?.actionCompletionRate ||
        0,
      description: "Completion rate",
      icon: "CheckCircle2",
    },
  ];

  // Generate realistic inspection trends data based on real metrics
  const generateInspectionTrends = () => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const totalInspections = summaryMetrics?.totalInspections || 0;
    const passRate = (summaryMetrics?.averageScore || 0) / 100;

    return months.map((month, index) => {
      // Create realistic distribution across months
      const monthlyFactor = [
        0.05, 0.08, 0.1, 0.12, 0.15, 0.18, 0.12, 0.1, 0.08, 0.06, 0.04, 0.02,
      ][index];
      const completed = Math.max(
        0,
        Math.floor(totalInspections * monthlyFactor)
      );
      const passed = Math.max(0, Math.floor(completed * passRate));
      const failed = Math.max(0, completed - passed);

      return {
        month,
        completed,
        passed,
        failed,
      };
    });
  };

  const inspectionTrends = generateInspectionTrends();

  const issuesByCategory = issuesData?.issuesByCategory
    ? Object.entries(issuesData.issuesByCategory).map(([category, count]) => ({
        name: category.charAt(0).toUpperCase() + category.slice(1),
        value: count,
      }))
    : [];

  // Generate action completion rate data based on real metrics
  const generateActionCompletionRate = () => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const baseRate =
      actionsData?.completionRate || summaryMetrics?.actionCompletionRate || 0;

    return months.map((month, index) => {
      // Create realistic progression across the year
      const progressionFactor = [
        0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1.0, 1.05, 1.1, 1.05, 1.0, 0.95,
      ][index];
      const rate = Math.max(
        0,
        Math.min(100, Math.floor(baseRate * progressionFactor))
      );

      return {
        month,
        rate,
      };
    });
  };

  const actionCompletionRate = generateActionCompletionRate();

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

  // Prepare data for reports using REAL DATA
  const reportData = {
    // Audit Summary Report Data - Using calculated values and analytics data
    auditSummary: {
      totalInspections: summaryMetrics?.totalInspections || 0,
      completedInspections: completedInspections,
      pendingInspections: pendingInspections,
      totalIssues: issuesDataList.length,
      resolvedIssues: issuesDataList.filter(
        (issue) => issue.status === "closed"
      ).length,
      recentInspections: recentInspections,
    },
    // Issues Report Data - Using analytics data where available
    issues: {
      totalIssues: issuesDataList.length,
      resolvedIssues: issuesDataList.filter(
        (issue) => issue.status === "closed"
      ).length,
      openIssues:
        summaryMetrics?.openIssues ||
        issuesDataList.filter((issue) => issue.status === "open").length,
      issuesByCategory: issuesData?.issuesByCategory || {},
      criticalIssues: issuesDataList
        .filter((issue) => issue.priority === "high" && issue.status === "open")
        .slice(0, 3)
        .map((issue) => ({
          id: issue.id,
          title: issue.title,
          category: issue.category,
          priority: issue.priority,
          due_at: issue.due_at,
          assignees: issue.assignees,
        })),
      topRecurringIssues: issuesData?.topRecurringIssues || [],
    },
  };

  // Create compatible summary object for HomeTabs
  const compatibleSummary = summaryMetrics
    ? {
        total_inspections: summaryMetrics.totalInspections,
        total_sites: totalSites,
        average_score: summaryMetrics.averageScore,
        failed_inspections: summaryMetrics.openIssues,
        passed_inspections: completedInspections,
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
        summaryMetrics={summaryMetrics || undefined}
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
