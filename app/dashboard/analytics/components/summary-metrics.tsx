"use client";

import { useAnalyticsComprehensive } from "@/hooks/use-analytics-comprehensive";
import { useInspections } from "@/hooks/use-inspections";
import { Card, CardContent } from "@/components/ui/card";
import LoadingSkeleton from "./widgets/loading-skeleton";

export default function SummaryMetrics() {
  const { inspections: inspectionsData } = useInspections();
  const { summaryMetrics, isLoading } = useAnalyticsComprehensive();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <LoadingSkeleton key={index} type="metric" />
        ))}
      </div>
    );
  }

  if (!summaryMetrics) {
    return null;
  }

  const metrics = [
    {
      title: "Total Inspections",
      value: inspectionsData.length,
      description: "Last period",
      icon: "📊",
    },
    {
      title: "Average Score",
      value: `${summaryMetrics.averageScore}%`,
      description: "Across all inspections",
      icon: "🎯",
    },
    {
      title: "Open Issues",
      value: summaryMetrics.openIssues,
      description: "Requiring attention",
      icon: "⚠️",
    },
    {
      title: "Action Completion",
      value: `${summaryMetrics.actionCompletionRate}%`,
      description: "On-time completion rate",
      icon: "✅",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">
                  {metric.title}
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {metric.value}
                </p>
                <p className="text-xs text-gray-500">{metric.description}</p>
              </div>
              <div className="text-2xl">{metric.icon}</div>
            </div>
          </CardContent>

          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50/50 pointer-events-none" />
        </Card>
      ))}
    </div>
  );
}
