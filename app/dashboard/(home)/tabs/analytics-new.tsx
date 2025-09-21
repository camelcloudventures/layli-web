"use client";

import { useAnalyticsComprehensive } from "@/hooks/use-analytics-comprehensive";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer as PieResponsiveContainer,
} from "recharts";
import Link from "next/link";
import EmptyState from "../../analytics/components/empty-state";

const COLORS = ["#3B82F6", "#60A5FA", "#93C5FD", "#DBEAFE"];

export default function AnalyticsNew() {
  const { summaryMetrics, trendIndicators, issuesData, isLoading, error } =
    useAnalyticsComprehensive();

  if (error) {
    return (
      <div className="rounded-lg border text-card-foreground">
        <div className="p-6">
          <h3 className="text-lg font-semibold leading-none tracking-tight">
            Analytics
          </h3>
          <p className="text-sm text-muted-foreground">
            Error loading analytics data. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-lg border text-card-foreground">
        <div className="p-6">
          <h3 className="text-lg font-semibold leading-none tracking-tight">
            Analytics
          </h3>
          <p className="text-sm text-muted-foreground">
            Loading analytics data...
          </p>
        </div>
      </div>
    );
  }

  if (!summaryMetrics) {
    return (
      <div className="rounded-lg border text-card-foreground">
        <div className="p-6">
          <h3 className="text-lg font-semibold leading-none tracking-tight">
            Analytics
          </h3>
          <p className="text-sm text-muted-foreground">
            No analytics data available yet. Start conducting inspections to see
            insights here.
          </p>
        </div>
      </div>
    );
  }

  // Prepare data for charts
  const issuesByCategory = issuesData?.issuesByCategory
    ? Object.entries(issuesData.issuesByCategory).map(([category, count]) => ({
        name: category.charAt(0).toUpperCase() + category.slice(1),
        value: count,
      }))
    : [];

  // Mock inspection trends data (since we don't have historical data in the API)
  const inspectionTrends = [
    {
      month: "Jan",
      completed: Math.floor(summaryMetrics.totalInspections * 0.1),
      passed: Math.floor(summaryMetrics.totalInspections * 0.08),
      failed: Math.floor(summaryMetrics.totalInspections * 0.02),
    },
    {
      month: "Feb",
      completed: Math.floor(summaryMetrics.totalInspections * 0.15),
      passed: Math.floor(summaryMetrics.totalInspections * 0.12),
      failed: Math.floor(summaryMetrics.totalInspections * 0.03),
    },
    {
      month: "Mar",
      completed: Math.floor(summaryMetrics.totalInspections * 0.2),
      passed: Math.floor(summaryMetrics.totalInspections * 0.16),
      failed: Math.floor(summaryMetrics.totalInspections * 0.04),
    },
    {
      month: "Apr",
      completed: Math.floor(summaryMetrics.totalInspections * 0.25),
      passed: Math.floor(summaryMetrics.totalInspections * 0.2),
      failed: Math.floor(summaryMetrics.totalInspections * 0.05),
    },
    {
      month: "May",
      completed: Math.floor(summaryMetrics.totalInspections * 0.2),
      passed: Math.floor(summaryMetrics.totalInspections * 0.16),
      failed: Math.floor(summaryMetrics.totalInspections * 0.04),
    },
    {
      month: "Jun",
      completed: Math.floor(summaryMetrics.totalInspections * 0.1),
      passed: Math.floor(summaryMetrics.totalInspections * 0.08),
      failed: Math.floor(summaryMetrics.totalInspections * 0.02),
    },
  ];

  return (
    <div className="rounded-lg border text-card-foreground">
      <div className="p-6">
        <h3 className="text-lg font-semibold leading-none tracking-tight">
          Analytics
        </h3>
        <p className="text-sm text-muted-foreground">
          View detailed analytics about your audit activities
        </p>
      </div>
      <div className="space-y-8 p-6 pt-0">
        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="flex flex-col items-center justify-center rounded-lg border p-4 text-card-foreground">
            <span className="text-sm font-medium text-tertiary">
              Total Inspections
            </span>
            <span className="text-3xl font-bold text-text-primary">
              {summaryMetrics.totalInspections}
            </span>
            <span className="text-xs text-muted-foreground">
              All time inspections
            </span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border p-4 text-card-foreground">
            <span className="text-sm font-medium text-tertiary">
              Average Score
            </span>
            <span className="text-3xl font-bold text-text-primary">
              {summaryMetrics.averageScore}%
            </span>
            <span className="text-xs text-muted-foreground">
              Across all inspections
            </span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border p-4 text-card-foreground">
            <span className="text-sm font-medium text-tertiary">
              Open Issues
            </span>
            <span className="text-3xl font-bold text-text-primary">
              {summaryMetrics.openIssues}
            </span>
            <span className="text-xs text-muted-foreground">
              Requiring attention
            </span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border p-4 text-card-foreground">
            <span className="text-sm font-medium text-tertiary">
              Action Completion
            </span>
            <span className="text-3xl font-bold text-text-primary">
              {summaryMetrics.actionCompletionRate}%
            </span>
            <span className="text-xs text-muted-foreground">
              On-time completion rate
            </span>
          </div>
        </div>

        {/* Trend Indicators */}
        {trendIndicators && trendIndicators.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trendIndicators.map((trend, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {trend.value > 0 ? "+" : ""}
                  {trend.value}%
                </div>
                <div className="text-sm text-gray-600">{trend.label}</div>
                <div className="text-xs text-gray-500">
                  from previous period
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Inspection Trends Chart */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-tertiary">
              Inspection Trends
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={inspectionTrends}>
                  <XAxis dataKey="month" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="completed"
                    fill="#5266EB"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar dataKey="passed" fill="#10B981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="failed" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Issues by Category Chart */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-tertiary">
              Issues by Category
            </h3>
            <div className="h-[300px]">
              {issuesByCategory.length > 0 ? (
                <PieResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={issuesByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#3B82F6"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent! * 100).toFixed(0)}%`
                      }
                    >
                      {issuesByCategory.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #E5E7EB",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                  </PieChart>
                </PieResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <EmptyState type="issues" />
                </div>
              )}
            </div>
          </div>
        </div>

        <Link
          className="text-[#5266EB] w-full text-center block"
          href="/dashboard/analytics"
        >
          View Full Analytics
        </Link>
      </div>
    </div>
  );
}
