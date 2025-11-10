"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { Info } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ComplianceScoreData } from "@/app/dashboard/analytics/actions/actions";

interface ComplianceScoreWidgetProps {
  data: ComplianceScoreData | null;
  isLoading?: boolean;
}

export function ComplianceScoreWidget({ data, isLoading }: ComplianceScoreWidgetProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push("/dashboard/analytics");
  };

  if (isLoading) {
    return (
      <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={handleClick}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Compliance Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">--</div>
          <div className="h-[40px] w-full bg-gray-100 rounded animate-pulse mt-2" />
        </CardContent>
      </Card>
    );
  }

  const score = data?.score || 0;
  const sparklineData = data?.sparkline || [];

  return (
    <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={handleClick}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          Average Compliance Score
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Passed items divided by total scored items on completed inspections within 30 days
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <div className="text-3xl font-bold">{score.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all sites
            </p>
          </div>
          {sparklineData.length > 0 && (
            <div className="w-[100px] h-[40px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineData}>
                  <defs>
                    <linearGradient id="complianceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#complianceGradient)"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

