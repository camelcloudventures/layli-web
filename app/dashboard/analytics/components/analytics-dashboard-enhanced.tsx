"use client";

import { useAnalyticsComprehensive } from "@/hooks/use-analytics-comprehensive";
import AnalyticsHeader from "./analytics-header";
import SummaryMetrics from "./summary-metrics";
import TrendIndicators from "./trend-indicators";
import AnalyticsTabs from "./tabs/analytics-tabs";
import ErrorBoundary from "./error-boundary";
import { AnalyticsLoadingSkeleton } from "./analytics-loading-skeleton";

export default function AnalyticsDashboardEnhanced() {
  const {
    trendIndicators,
    currentTab,
    isLoading,
    error,
    changeTab,
    refreshData,
  } = useAnalyticsComprehensive();

  if (error) {
    return <ErrorBoundary error={error} onRetry={refreshData} />;
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <AnalyticsHeader />

      {/* Enhanced Summary Metrics */}
      <SummaryMetrics />

      {/* Trend Indicators */}
      {trendIndicators && trendIndicators.length > 0 && (
        <TrendIndicators trends={trendIndicators} />
      )}

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
