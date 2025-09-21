"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FileX, TrendingUp, AlertTriangle, MapPin } from "lucide-react";

interface EmptyStateProps {
  type: "inspections" | "issues" | "actions" | "locations" | "general";
  title?: string;
  description?: string;
}

const emptyStateConfig = {
  inspections: {
    icon: TrendingUp,
    title: "No Inspection Data",
    description:
      "Start conducting inspections to see analytics and insights here.",
  },
  issues: {
    icon: AlertTriangle,
    title: "No Issues Found",
    description:
      "No issues have been reported yet. Issues will appear here once they are created.",
  },
  actions: {
    icon: FileX,
    title: "No Actions Available",
    description:
      "No action items have been created yet. Actions will appear here once they are assigned.",
  },
  locations: {
    icon: MapPin,
    title: "No Location Data",
    description:
      "No location performance data available. Add locations and conduct inspections to see analytics.",
  },
  general: {
    icon: FileX,
    title: "No Data Available",
    description:
      "No analytics data is available at the moment. Please try again later.",
  },
};

export default function EmptyState({
  type,
  title,
  description,
}: EmptyStateProps) {
  const config = emptyStateConfig[type];
  const Icon = config.icon;

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="rounded-full bg-gray-100 p-4 mb-4">
          <Icon className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title || config.title}
        </h3>
        <p className="text-sm text-gray-500 text-center max-w-sm">
          {description || config.description}
        </p>
      </CardContent>
    </Card>
  );
}
