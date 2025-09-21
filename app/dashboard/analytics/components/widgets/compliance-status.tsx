"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import EmptyState from "../empty-state";

interface ComplianceStatusProps {
  data?: {
    overall_percentage: number;
    compliant_areas: number;
    non_compliant_areas: number;
  };
  isLoading?: boolean;
}

export default function ComplianceStatus({
  data,
  isLoading,
}: ComplianceStatusProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Compliance Status</CardTitle>
          <p className="text-sm text-muted-foreground">
            Overall compliance metrics
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
    return <EmptyState type="general" title="No Compliance Data" />;
  }

  const chartData = [
    { name: "Compliant", value: data.overall_percentage, color: "#1f2937" },
    {
      name: "Non-compliant",
      value: 100 - data.overall_percentage,
      color: "#e5e7eb",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">Compliance Status</CardTitle>
        <p className="text-sm text-muted-foreground">
          Overall compliance metrics
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center">
          <div className="relative w-48 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  dataKey="value"
                  startAngle={90}
                  endAngle={450}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {data.overall_percentage}%
                </div>
                <div className="text-xs text-gray-500">Compliant</div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              {data.compliant_areas} Compliant Areas
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              {data.non_compliant_areas} Non-compliant Areas
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
