"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EmptyState from "../empty-state";

interface InspectionCoverageProps {
  data?: Array<{
    location_name: string;
    inspection_count: number;
  }>;
  isLoading?: boolean;
}

export default function InspectionCoverage({
  data,
  isLoading,
}: InspectionCoverageProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Inspection Coverage</CardTitle>
          <p className="text-sm text-muted-foreground">
            Inspection frequency by location
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

  if (!data || data.length === 0) {
    return <EmptyState type="locations" />;
  }

  const maxCount = Math.max(...data.map((item) => item.inspection_count));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">Inspection Coverage</CardTitle>
        <p className="text-sm text-muted-foreground">
          Inspection frequency by location
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((location, index) => {
            const percentage = (location.inspection_count / maxCount) * 100;
            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    {location.location_name}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {location.inspection_count} inspections
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
