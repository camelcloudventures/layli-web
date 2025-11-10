"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";

interface FlaggedItemsWidgetProps {
  flaggedCount: number;
  failedCount: number;
  onOpenPanel: () => void;
  isLoading?: boolean;
}

export function FlaggedItemsWidget({
  flaggedCount,
  failedCount,
  onOpenPanel,
  isLoading,
}: FlaggedItemsWidgetProps) {
  const [showFailed, setShowFailed] = useState(false);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowFailed(!showFailed);
  };

  if (isLoading) {
    return (
      <Card className="cursor-pointer hover:bg-accent/50 transition-colors border-red-200 bg-red-50" onClick={onOpenPanel}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-red-900">Flagged Items</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">--</div>
        </CardContent>
      </Card>
    );
  }

  const displayCount = showFailed ? failedCount : flaggedCount;
  const displayLabel = showFailed ? "Failed" : "Flagged";

  return (
    <Card
      className="cursor-pointer hover:bg-red-100 transition-colors border-red-200 bg-red-50"
      onClick={onOpenPanel}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-red-900 flex items-center gap-2">
          Flagged Items
          <Badge
            variant="outline"
            className="cursor-pointer border-red-300 text-red-700"
            onClick={handleToggle}
          >
            {displayLabel}
          </Badge>
        </CardTitle>
        <AlertTriangle className="h-4 w-4 text-red-600" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-red-900">{displayCount}</div>
        <p className="text-xs text-red-700 mt-1">
          {showFailed ? "Failed items" : "Flagged items"}
        </p>
      </CardContent>
    </Card>
  );
}

