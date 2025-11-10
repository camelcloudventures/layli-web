"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  normalizeAndTruncateSiteName,
  abbreviateSiteNames,
} from "../utils/site-name-normalizer";

interface CustomTooltipProps {
  active?: boolean;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any[];
  label?: string;
  nameMap: Record<string, string>;
}

// Custom Tooltip Component
const CustomTooltip = ({
  active,
  payload,
  label,
  nameMap,
}: CustomTooltipProps) => {
  if (active && payload && payload.length && label) {
    const fullSiteName = nameMap[label];
    return (
      <div className="p-2 bg-white border rounded shadow-lg">
        <p className="font-bold">{fullSiteName}</p>
        <p>{`Overdue: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

interface OverdueInspectionsBySiteChartProps {
  data: Array<{ site_id: string; site_name: string; count: number }> | null;
  isLoading?: boolean;
}

export function OverdueInspectionsBySiteChart({
  data,
  isLoading,
}: OverdueInspectionsBySiteChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Overdue Inspections by Site</CardTitle>
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
          <CardTitle>Overdue Inspections by Site</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No overdue inspections
          </div>
        </CardContent>
      </Card>
    );
  }

  // Aggregate data by site_name
  const aggregatedData = data.reduce<
    Record<string, { count: number; site_name: string }>
  >((acc, item) => {
    const siteName = item.site_name || "No Site";
    if (!acc[siteName]) {
      acc[siteName] = { count: 0, site_name: siteName };
    }
    acc[siteName].count += Number(item.count) || 0;
    return acc;
  }, {});

  // Convert aggregated data to an array, sort, and truncate names
  const processedData = Object.values(aggregatedData)
    .map((item) => ({
      ...item,
      site_name: normalizeAndTruncateSiteName(item.site_name, 20),
    }))
    .sort((a, b) => b.count - a.count)
    .filter((item) => item.count > 0);

  // Generate abbreviations and name map
  const { processedData: abbreviatedData, nameMap } =
    abbreviateSiteNames(processedData);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overdue Inspections by Site</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={abbreviatedData} layout="vertical">
              <XAxis type="number" domain={[0, "dataMax"]} />
              <YAxis
                type="category"
                dataKey="abbreviated_name"
                tick={{ fontSize: 11 }}
                interval={0}
              />
              <Tooltip content={<CustomTooltip nameMap={nameMap} />} />
              <Bar
                dataKey="count"
                fill="#ef4444"
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
