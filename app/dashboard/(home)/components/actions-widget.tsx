"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { ListChecks } from "lucide-react";
import { useState } from "react";

interface ActionsWidgetProps {
  openCount: number;
  totalCount: number;
  isLoading?: boolean;
}

export function ActionsWidget({ openCount, totalCount, isLoading }: ActionsWidgetProps) {
  const router = useRouter();
  const [showAll, setShowAll] = useState(false);

  const handleClick = () => {
    router.push("/dashboard/actions");
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowAll(!showAll);
  };

  if (isLoading) {
    return (
      <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={handleClick}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Open Actions</CardTitle>
          <ListChecks className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">--</div>
        </CardContent>
      </Card>
    );
  }

  const displayCount = showAll ? totalCount : openCount;
  const subtitle = showAll ? "All" : "Open";

  return (
    <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={handleClick}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Open Actions</CardTitle>
        <ListChecks className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-3xl font-bold">{displayCount}</div>
          <Badge
            variant="outline"
            className="cursor-pointer"
            onClick={handleToggle}
          >
            {subtitle}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {showAll ? "All actions" : "Open actions only"}
        </p>
      </CardContent>
    </Card>
  );
}

