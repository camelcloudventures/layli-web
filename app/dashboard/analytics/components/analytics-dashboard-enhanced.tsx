"use client";

import { useAnalyticsComprehensive } from "@/hooks/use-analytics-comprehensive";
import AnalyticsHeader from "./analytics-header";
import SummaryMetrics from "./summary-metrics";
import AnalyticsTabs from "./tabs/analytics-tabs";
import ErrorBoundary from "./error-boundary";
import { AnalyticsLoadingSkeleton } from "./analytics-loading-skeleton";

export default function AnalyticsDashboardEnhanced() {
  const { currentTab, isLoading, error, changeTab, refreshData } =
    useAnalyticsComprehensive();

  if (error) {
    return <ErrorBoundary error={error} onRetry={refreshData} />;
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <AnalyticsHeader />

      {/* Enhanced Summary Metrics */}
      <SummaryMetrics />

      {/* Enhanced Tabs */}
      <AnalyticsTabs
        currentTab={currentTab}
        onTabChange={changeTab}
        isLoading={isLoading}
      />

      {/* Loading State */}
      {isLoading && <AnalyticsLoadingSkeleton />}
    </div>
  );
}
