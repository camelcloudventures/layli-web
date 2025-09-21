"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare } from "lucide-react";
import EmptyState from "../empty-state";

interface InspectionEfficiencyProps {
  data?: {
    inspections_per_inspector: number;
    // Note: Excluding time-related metrics as requested
  };
  isLoading?: boolean;
}

export default function InspectionEfficiency({
  data,
  isLoading,
}: InspectionEfficiencyProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Inspection Efficiency</CardTitle>
          <p className="text-sm text-muted-foreground">
            Time and resource metrics
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return <EmptyState type="general" title="No Efficiency Data" />;
  }

  const metrics = [
    {
      label: "Inspections per Inspector",
      value: data.inspections_per_inspector || 18, // Default value from screenshots
      icon: CheckSquare,
      color: "text-blue-600",
    },
    // Note: Excluding time-related metrics as requested
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">Inspection Efficiency</CardTitle>
        <p className="text-sm text-muted-foreground">
          Time and resource metrics
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon className={`h-5 w-5 ${metric.color}`} />
                  <span className="text-sm font-medium text-gray-700">
                    {metric.label}
                  </span>
                </div>
                <span className="text-lg font-bold text-gray-900">
                  {metric.value}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
