"use client";

import { Suspense } from "react";
import AnalyticsSummary from "./components/analytics-summary";

import { useActionsAnalytics } from "@/hooks/use-actions-analytics";
import { useAnalyticsSummary } from "@/hooks/use-analytics-summary";
import { useInspectionsAnalytics } from "@/hooks/use-inspections-analytics";
import { useIssuesAnalytics } from "@/hooks/use-issues-analytics";
import { useSchedulesAnalytics } from "@/hooks/use-schedules-analytics";
import ActionsAnalytics from "./components/actions-analytics";
import { AnalyticsLoadingSkeleton } from "./components/analytics-loading-skeleton";
import InspectionsAnalytics from "./components/inspections-analytics";
import IssuesAnalytics from "./components/issues-analytics";
import SchedulesAnalytics from "./components/schedules-analytics";

export default function AnalyticsClient() {
  const { analyticsSummary, isLoading: isLoadingSummary } =
    useAnalyticsSummary();
  const { issuesAnalytics, isLoading: isLoadingIssues } = useIssuesAnalytics();
  const { actionsAnalytics, isLoading: isLoadingActions } =
    useActionsAnalytics();
  const { schedulesAnalytics, isLoading: isLoadingSchedules } =
    useSchedulesAnalytics();
  const { inspectionsAnalytics, isLoading: isLoadingInspections } =
    useInspectionsAnalytics();

  const isLoading =
    isLoadingSummary ||
    isLoadingIssues ||
    isLoadingActions ||
    isLoadingSchedules ||
    isLoadingInspections;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Comprehensive insights into your audit activities
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      {analyticsSummary && (
        <Suspense fallback={<div>Loading summary...</div>}>
          <AnalyticsSummary data={analyticsSummary} />
        </Suspense>
      )}

      {/* Issues Analytics */}
      {issuesAnalytics && (
        <Suspense fallback={<div>Loading issues analytics...</div>}>
          <IssuesAnalytics data={issuesAnalytics} />
        </Suspense>
      )}

      {/* Actions Analytics */}
      {actionsAnalytics && (
        <Suspense fallback={<div>Loading actions analytics...</div>}>
          <ActionsAnalytics data={actionsAnalytics} />
        </Suspense>
      )}

      {/* Schedules Analytics */}
      {schedulesAnalytics && (
        <Suspense fallback={<div>Loading schedules analytics...</div>}>
          <SchedulesAnalytics data={schedulesAnalytics} />
        </Suspense>
      )}

      {/* Inspections Analytics */}
      {inspectionsAnalytics && (
        <Suspense fallback={<div>Loading inspections analytics...</div>}>
          <InspectionsAnalytics data={inspectionsAnalytics} />
        </Suspense>
      )}

      {isLoading && <AnalyticsLoadingSkeleton />}

      {/* Fallback for when no data is available */}
      {/* {!analyticsSummary &&
        !issuesAnalytics &&
        !actionsAnalytics &&
        !schedulesAnalytics &&
        !inspectionsAnalytics && (
          <AnalyticsLoadingSkeleton />
        )} */}
    </div>
  );
}
