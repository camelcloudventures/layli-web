"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import EmptyState from "../empty-state";

interface RiskAssessmentProps {
  data?: {
    high_risk_percentage: number;
    medium_risk_percentage: number;
    low_risk_percentage: number;
  };
  isLoading?: boolean;
}

export default function RiskAssessment({
  data,
  isLoading,
}: RiskAssessmentProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Risk Assessment</CardTitle>
          <p className="text-sm text-muted-foreground">Current risk levels</p>
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
    return <EmptyState type="general" title="No Risk Data" />;
  }

  const riskLevels = [
    {
      label: "High Risk",
      percentage: data.high_risk_percentage,
      color: "bg-red-500",
      textColor: "text-red-600",
    },
    {
      label: "Medium Risk",
      percentage: data.medium_risk_percentage,
      color: "bg-orange-500",
      textColor: "text-orange-600",
    },
    {
      label: "Low Risk",
      percentage: data.low_risk_percentage,
      color: "bg-green-500",
      textColor: "text-green-600",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">Risk Assessment</CardTitle>
        <p className="text-sm text-muted-foreground">Current risk levels</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {riskLevels.map((level, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  {level.label}
                </span>
                <span className={`text-sm font-semibold ${level.textColor}`}>
                  {level.percentage}%
                </span>
              </div>
              <Progress
                value={level.percentage}
                className="h-2"
                style={{
                  backgroundColor: "#e5e7eb",
                }}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
