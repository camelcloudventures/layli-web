"use client";

import { useAnalyticsComprehensive } from "@/hooks/use-analytics-comprehensive";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import LoadingSkeleton from "./widgets/loading-skeleton";

export default function SummaryMetrics() {
  const { summaryMetrics, trendIndicators, isLoading } =
    useAnalyticsComprehensive();

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
      value: summaryMetrics.totalInspections,
      description: "Last period",
      icon: "📊",
      trend: trendIndicators?.[0]?.value || 0,
    },
    {
      title: "Average Score",
      value: `${summaryMetrics.averageScore}%`,
      description: "Across all inspections",
      icon: "🎯",
      trend: trendIndicators?.[1]?.value || 0,
    },
    {
      title: "Open Issues",
      value: summaryMetrics.openIssues,
      description: "Requiring attention",
      icon: "⚠️",
      trend: trendIndicators?.[2]?.value || 0,
    },
    {
      title: "Action Completion",
      value: `${summaryMetrics.actionCompletionRate}%`,
      description: "On-time completion rate",
      icon: "✅",
      trend: trendIndicators?.[3]?.value || 0,
    },
  ];

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0) return "text-green-600";
    if (trend < 0) return "text-red-600";
    return "text-gray-500";
  };

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

            {/* Trend indicator */}
            <div className="mt-4 flex items-center space-x-2">
              {getTrendIcon(metric.trend)}
              <span
                className={`text-sm font-medium ${getTrendColor(metric.trend)}`}
              >
                {metric.trend > 0 ? "+" : ""}
                {metric.trend}%
              </span>
              <span className="text-xs text-gray-500">
                from previous period
              </span>
            </div>
          </CardContent>

          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50/50 pointer-events-none" />
        </Card>
      ))}
    </div>
  );
}
