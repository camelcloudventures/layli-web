"use client";

import { Cell } from "recharts";
import { PieChart, Pie } from "recharts";
import { Area, AreaChart } from "recharts";
import { ResponsiveContainer } from "recharts";
import Link from "next/link";

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

const COLORS = ["#3B82F6", "#60A5FA", "#93C5FD", "#DBEAFE"];

// Fallback data for when real data is not available
const fallbackInspectionTrends = [
  { month: "Jan", completed: 0, passed: 0, failed: 0 },
  { month: "Feb", completed: 0, passed: 0, failed: 0 },
  { month: "Mar", completed: 0, passed: 0, failed: 0 },
  { month: "Apr", completed: 0, passed: 0, failed: 0 },
  { month: "May", completed: 0, passed: 0, failed: 0 },
  { month: "Jun", completed: 0, passed: 0, failed: 0 },
];

const fallbackIssuesByCategory = [{ name: "No Data", value: 1 }];

const fallbackActionCompletionRate = [
  { month: "Jan", rate: 0 },
  { month: "Feb", rate: 0 },
  { month: "Mar", rate: 0 },
  { month: "Apr", rate: 0 },
  { month: "May", rate: 0 },
  { month: "Jun", rate: 0 },
];

type IProps = {
  inspectionTrends?: {
    month: string;
    completed: number;
    passed: number;
    failed: number;
  }[];
  issuesByCategory?: {
    name: string;
    value: number;
  }[];
  actionCompletionRate?: {
    month: string;
    rate: number;
  }[];
  summary?: {
    total_inspections: number;
    total_sites: number;
    average_score: number;
    failed_inspections: number;
    passed_inspections: number;
  } | null;
};

export default function Analytics({
  inspectionTrends = fallbackInspectionTrends,
  issuesByCategory = fallbackIssuesByCategory,
  actionCompletionRate = fallbackActionCompletionRate,
  summary,
}: IProps) {
  // Use backend data if available, otherwise use fallback data
  const totalInspections = summary?.total_inspections || 0;
  const averageScore = summary?.average_score || 0;
  const openIssues = summary?.failed_inspections || 0;
  const actionCompletion =
    summary?.passed_inspections && summary?.total_inspections
      ? Math.round(
          (summary.passed_inspections / summary.total_inspections) * 100
        )
      : 0;

  // Check if we have real data
  const hasRealData = summary && summary.total_inspections > 0;
  const hasIssuesData =
    issuesByCategory &&
    issuesByCategory.length > 0 &&
    issuesByCategory[0].name !== "No Data";
  const hasTrendsData =
    inspectionTrends && inspectionTrends.some((trend) => trend.completed > 0);

  return (
    <div className="rounded-lg border text-card-foreground">
      <div className="p-6">
        <h3 className="text-lg font-semibold leading-none tracking-tight">
          Analytics
        </h3>
        <p className="text-sm text-muted-foreground">
          {hasRealData
            ? "View detailed analytics about your audit activities"
            : "No analytics data available yet. Start conducting inspections to see insights here."}
        </p>
      </div>
      <div className="space-y-8 p-6 pt-0">
        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="flex flex-col items-center justify-center rounded-lg border p-4 text-card-foreground ">
            <span className="text-sm font-medium text-tertiary">
              Total Inspections
            </span>
            <span className="text-3xl font-bold text-text-primary">
              {totalInspections}
            </span>
            <span className="text-xs text-muted-foreground">
              {hasRealData ? "All time inspections" : "No inspections yet"}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border  p-4 text-card-foreground  ">
            <span className="text-sm font-medium text-tertiary">
              Average Score
            </span>
            <span className="text-3xl font-bold text-text-primary">
              {averageScore}%
            </span>
            <span className="text-xs text-muted-foreground">
              {hasRealData ? "Across all inspections" : "No scores yet"}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border p-4 text-card-foreground">
            <span className="text-sm font-medium text-tertiary">
              Failed Inspections
            </span>
            <span className="text-3xl font-bold text-text-primary">
              {openIssues}
            </span>
            <span className="text-xs text-muted-foreground">
              {hasRealData ? "Requiring attention" : "No issues yet"}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border p-4 text-card-foreground">
            <span className="text-sm font-medium text-tertiary">Pass Rate</span>
            <span className="text-3xl font-bold text-text-primary">
              {actionCompletion}%
            </span>
            <span className="text-xs text-muted-foreground">
              {hasRealData ? "Success rate" : "No data yet"}
            </span>
          </div>
        </div>

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
            {!hasTrendsData && (
              <p className="text-sm text-muted-foreground text-center">
                No trend data available. Complete inspections to see trends.
              </p>
            )}
          </div>

          {/* Issues by Category Chart */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-tertiary">
              Issues by Category
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
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
              </ResponsiveContainer>
            </div>
            {!hasIssuesData && (
              <p className="text-sm text-muted-foreground text-center">
                No issues data available. Report issues to see category
                breakdown.
              </p>
            )}
          </div>
        </div>

        {/* Action Completion Rate Chart */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-tertiary">
            Action Completion Rate
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={actionCompletionRate}>
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis domain={[0, 100]} stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="rate"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fill="#DBEAFE"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {!hasRealData && (
            <p className="text-sm text-muted-foreground text-center">
              No action data available. Create actions to see completion rates.
            </p>
          )}
        </div>

        <Link
          className="text-[#5266EB] w-full text-center"
          href="/dashboard/analytics"
        >
          View Full Analytics
        </Link>
      </div>
    </div>
  );
}
