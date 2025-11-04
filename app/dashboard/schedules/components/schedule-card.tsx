"use client";

import type { Schedule } from "@/lib/types/schedule-types";
import { ScheduleActions } from "./schedule-actions";
import { ScheduleInfo } from "./schedule-info";
import { ScheduleFooter } from "./schedule-footer";
import HasPermission from "../../components/has-permission";
import { Permission } from "@/lib/auth/auth";
import { Badge } from "@/components/ui/badge";

interface ScheduleCardProps {
  schedule: Schedule;
  onEdit: (schedule: Schedule) => void;
  onDelete: (schedule: Schedule) => void;
  onViewDetails: (schedule: Schedule) => void;
  onCreateInspection: (schedule: Schedule) => void;
  isLoadingInspection?: boolean;
}

export function ScheduleCard({
  schedule,
  onEdit,
  onDelete,
  onViewDetails,
  onCreateInspection,
  isLoadingInspection = false,
}: ScheduleCardProps) {
  return (
    <div className="border rounded-md overflow-hidden bg-white">
      <div className="p-6 space-y-4">
        <div className="flex justify-between">
          <div>
            <div className="text-xs font-medium text-muted-foreground  mb-1">
              Title
            </div>
            <div className="font-semibold text-lg text-gray-900 mb-2">
              {schedule.title}
            </div>

            {schedule.site?.name && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground ">
                  Site:
                </span>
                <Badge variant="outline" className="text-sm">
                  {schedule.site.name}
                </Badge>
              </div>
            )}
          </div>
          <HasPermission permission={Permission.MANAGE_SCHEDULES}>
            <ScheduleActions
              schedule={schedule}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </HasPermission>
        </div>
        <ScheduleInfo schedule={schedule} />
      </div>
      <ScheduleFooter
        schedule={schedule}
        onViewDetails={onViewDetails}
        onCreateInspection={onCreateInspection}
        isLoadingInspection={isLoadingInspection}
      />
    </div>
  );
}
