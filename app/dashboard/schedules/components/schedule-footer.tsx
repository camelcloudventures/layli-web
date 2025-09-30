"use client";

import { FileText, Play, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Schedule } from "@/lib/types/schedule-types";

interface ScheduleFooterProps {
  schedule: Schedule;
  onViewDetails: (schedule: Schedule) => void;
  onCreateInspection: (schedule: Schedule) => void;
  isLoadingInspection?: boolean;
}

export function ScheduleFooter({
  schedule,
  onViewDetails,
  onCreateInspection,
  isLoadingInspection = false,
}: ScheduleFooterProps) {
  return (
    <div className="border-t bg-muted/50 p-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Template: {schedule.template?.title || "N/A"}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onCreateInspection(schedule)}
          disabled={isLoadingInspection}
        >
          {isLoadingInspection ? (
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          ) : (
            <Play className="h-4 w-4 mr-1" />
          )}
          {isLoadingInspection ? "Creating..." : "Start inspection"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(schedule)}
        >
          View Details
        </Button>
      </div>
    </div>
  );
}
