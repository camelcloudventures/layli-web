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
import type { FlaggedItemsBySite } from "@/app/dashboard/analytics/actions/actions";
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
        <p>{`Flagged: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

interface FlaggedItemsBySiteChartProps {
  data: FlaggedItemsBySite[] | null;
  isLoading?: boolean;
  onOpenPanel?: () => void;
}

export function FlaggedItemsBySiteChart({
  data,
  isLoading,
  onOpenPanel,
}: FlaggedItemsBySiteChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Flagged Items by Site</CardTitle>
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
          <CardTitle>Flagged Items by Site</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  // Aggregate data by site name
  const aggregatedData = data.reduce<
    Record<
      string,
      { site_name: string; flagged_count: number; failed_count: number }
    >
  >((acc, item) => {
    const siteName = item.site_name || "No Site";
    if (!acc[siteName]) {
      acc[siteName] = {
        site_name: siteName,
        flagged_count: 0,
        failed_count: 0,
      };
    }
    // Handle cases where API returns 'count' instead of 'flagged_count'
    const itemWithCount = item as FlaggedItemsBySite & { count?: number };
    const flaggedCount =
      "flagged_count" in itemWithCount &&
      typeof itemWithCount.flagged_count === "number"
        ? Number(itemWithCount.flagged_count) || 0
        : "count" in itemWithCount && typeof itemWithCount.count === "number"
        ? Number(itemWithCount.count) || 0
        : 0;
    acc[siteName].flagged_count += flaggedCount;
    acc[siteName].failed_count += Number(item.failed_count) || 0;
    return acc;
  }, {});

  // Convert to array, truncate names, and sort
  const chartData = Object.values(aggregatedData)
    .map((item) => ({
      ...item,
      site_name: normalizeAndTruncateSiteName(item.site_name, 20),
    }))
    .sort((a, b) => {
      const aValue = a.flagged_count;
      const bValue = b.flagged_count;
      return bValue - aValue;
    })
    .filter((item) => item.flagged_count > 0);

  // Generate abbreviations and name map
  const { processedData: abbreviatedData, nameMap } =
    abbreviateSiteNames(chartData);

  const dataKey = "flagged_count";
  const barColor = "#f59e0b";

  return (
    <Card
      className={
        onOpenPanel ? "cursor-pointer hover:bg-accent/50 transition-colors" : ""
      }
      onClick={onOpenPanel}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Flagged Items by Site</CardTitle>
        </div>
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
                dataKey={dataKey}
                fill={barColor}
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
