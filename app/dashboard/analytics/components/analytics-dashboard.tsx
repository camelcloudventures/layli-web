"use client";

import { useAnalyticsComprehensive } from "@/hooks/use-analytics-comprehensive";
import TrendIndicators from "./trend-indicators";
import AnalyticsTabs from "./tabs/analytics-tabs";
import { AnalyticsLoadingSkeleton } from "./analytics-loading-skeleton";
import TimeFilterDropdown from "./time-filter-dropdown";

export default function AnalyticsDashboard() {
  const {
    trendIndicators,
    summaryMetrics,
    currentTab,
    timeFilter,
    isLoading,
    error,
    changeTimeFilter,
    changeTab,
  } = useAnalyticsComprehensive();

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Analytics
          </h3>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">
            View audit analytics and insights
          </p>
        </div>
        <TimeFilterDropdown value={timeFilter} onChange={changeTimeFilter} />
      </div>

      {/* Summary Metrics */}
      {summaryMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col items-center justify-center rounded-lg border p-4 text-card-foreground">
            <span className="text-sm font-medium text-tertiary">
              Total Inspections
            </span>
            <span className="text-3xl font-bold text-text-primary">
              {summaryMetrics.totalInspections}
            </span>
            <span className="text-xs text-muted-foreground">
              Last{" "}
              {timeFilter === "month"
                ? "month"
                : timeFilter === "6months"
                ? "6 months"
                : "year"}
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
      )}

      {/* Trend Indicators */}
      {trendIndicators && trendIndicators.length > 0 && (
        <TrendIndicators trends={trendIndicators} />
      )}

      {/* Tabs */}
      <AnalyticsTabs
        currentTab={currentTab}
        onTabChange={changeTab}
        isLoading={isLoading}
      />

      {isLoading && <AnalyticsLoadingSkeleton />}
    </div>
  );
}
