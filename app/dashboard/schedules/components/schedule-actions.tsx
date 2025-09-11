"use client";

import { useState } from "react";
import { MoreHorizontal, EditIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Schedule } from "@/lib/types/schedule-types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ScheduleActionsProps {
  schedule: Schedule;
  onEdit: (schedule: Schedule) => void;
  onDelete: (schedule: Schedule) => void;
}

export function ScheduleActions({
  schedule,
  onEdit,
  onDelete,
}: ScheduleActionsProps) {
  const [dropdownOpenId, setDropdownOpenId] = useState<string | number | null>(
    null
  );

  return (
    <DropdownMenu
      open={dropdownOpenId === schedule.id}
      onOpenChange={(open) => setDropdownOpenId(open ? schedule.id : null)}
    >
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="More actions">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            setDropdownOpenId(null);
            onEdit(schedule);
          }}
        >
          <EditIcon className="mr-2 h-4 w-4" />
          Edit Schedule
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-red-500 hover:bg-red-500 hover:text-white focus:bg-red-600 focus:text-white"
          onSelect={(e) => {
            e.preventDefault();
            setDropdownOpenId(null);
            onDelete(schedule);
          }}
        >
          <Trash2Icon className="mr-2 focus:text-white h-4 w-4" />
          Delete Schedule
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
