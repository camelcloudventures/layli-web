"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import EmptyState from "../empty-state";

interface LocationPerformanceProps {
  data?: Array<{
    location_name: string;
    average_score: number;
  }>;
  isLoading?: boolean;
}

export default function LocationPerformance({
  data,
  isLoading,
}: LocationPerformanceProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Location Performance</CardTitle>
          <p className="text-sm text-muted-foreground">
            Average inspection scores by location
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

  const chartData = data.map((location) => ({
    name: location.location_name,
    score: location.average_score,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">Location Performance</CardTitle>
        <p className="text-sm text-muted-foreground">
          Average inspection scores by location
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: number) => [`${value}%`, "Score"]}
                labelStyle={{ color: "#374151" }}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
