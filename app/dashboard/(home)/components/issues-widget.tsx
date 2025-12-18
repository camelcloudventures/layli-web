"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Flag } from "lucide-react";
import { ArrowUp, ArrowDown } from "lucide-react";

interface IssuesWidgetProps {
  count: number;
  delta?: number;
  isLoading?: boolean;
}

export function IssuesWidget({ count, delta, isLoading }: IssuesWidgetProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push("/dashboard/issues");
  };

  if (isLoading) {
    return (
      <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={handleClick}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Issues</CardTitle>
          <Flag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">--</div>
        </CardContent>
      </Card>
    );
  }

  const isPositive = delta !== undefined ? delta >= 0 : undefined;
  const deltaDisplay = delta !== undefined ? Math.abs(delta) : undefined;

  return (
    <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={handleClick}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Issues</CardTitle>
        <Flag className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{count}</div>
        {deltaDisplay !== undefined && (
          <div className="flex items-center gap-1 mt-1">
            {isPositive ? (
              <ArrowUp className="h-3 w-3 text-red-600" />
            ) : (
              <ArrowDown className="h-3 w-3 text-green-600" />
            )}
            <span
              className={`text-xs ${
                isPositive ? "text-red-600" : "text-green-600"
              }`}
            >
              {deltaDisplay} vs previous period
            </span>
          </div>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          From failed items in date range
        </p>
      </CardContent>
    </Card>
  );
}

