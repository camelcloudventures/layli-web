"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Link from "next/link";
import type { InspectionsByTemplate } from "@/app/dashboard/analytics/actions/actions";

interface InspectionsByTemplateChartProps {
  data: InspectionsByTemplate[] | null;
  isLoading?: boolean;
}

export function InspectionsByTemplateChart({
  data,
  isLoading,
}: InspectionsByTemplateChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Inspections by Template</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-gray-100 rounded animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Inspections by Template</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort descending by count, limit to top 10, and truncate template names
  const sortedData = [...data]
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .map((item) => ({
      ...item,
      template_name: item.template_name.length > 30 
        ? `${item.template_name.substring(0, 30)}...` 
        : item.template_name,
    }));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Inspections by Template</CardTitle>
          {data.length > 10 && (
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/inspections">View all</Link>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sortedData} layout="horizontal" margin={{ left: 10, right: 10, top: 5, bottom: 5 }}>
              <XAxis 
                type="number" 
                domain={[0, 'dataMax']}
                tick={{ fontSize: 11 }}
              />
              <YAxis
                type="category"
                dataKey="template_name"
                width={180}
                tick={{ fontSize: 11 }}
                interval={0}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                }}
                formatter={(value: number) => [value, "Inspections"]}
              />
              <Bar 
                dataKey="count" 
                fill="#3b82f6" 
                radius={[0, 4, 4, 0]}
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

