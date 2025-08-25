"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2Icon } from "lucide-react";
import type { Schedule } from "@/lib/types/schedule-types";
import type {
  UserOption,
  TemplateOption,
  SiteOption,
} from "../types/schedule-form-types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreateScheduleForm } from "./create-schedule-form";
import { EditScheduleForm } from "./edit-schedule-form";
import { ScheduleDetailsDialog } from "./schedule-details-dialog";
import {
  deleteSchedule,
  updateScheduleStatus,
  UpdateScheduleStatusResponse,
} from "../actions/actions";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { ScheduleHeader } from "./schedule-header";
import { ScheduleSearch } from "./schedule-search";
import { ScheduleCard } from "./schedule-card";
import HasPermission from "../../components/has-permission";
import { Permission } from "@/lib/auth/auth";
import SchedulesLoadingSkeleton from "./schedules-loading-skeleton";
import { useSchedulesStore } from "@/store/schedules";

interface SchedulesListProps {
  schedules: Schedule[];
  users: UserOption[];
  templates: TemplateOption[];
  sites: SiteOption[];
}

export function SchedulesList({
  schedules,
  users,
  templates,
  sites,
}: SchedulesListProps) {
  const { clearSchedules, setSchedules } = useSchedulesStore();
  console.log("schedules", schedules);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [detailsOpen, setDetailsOpen] = useState(false);
  const router = useRouter();

  const filteredSchedules = useMemo(() => {
    if (!searchQuery.trim()) return schedules;
    const query = searchQuery.toLowerCase().trim();
    return schedules.filter(
      (schedule) =>
        schedule.title.toLowerCase().includes(query) ||
        schedule.site?.name?.toLowerCase().includes(query) ||
        schedule.assignees?.some((assignee) =>
          assignee.assignee.full_name?.toLowerCase().includes(query)
        ) ||
        schedule.assignees?.some((assignee) =>
          assignee.assignee.email?.toLowerCase().includes(query)
        ) ||
        schedule.template?.title?.toLowerCase().includes(query) ||
        schedule.frequency.toLowerCase().includes(query)
    );
  }, [searchQuery, schedules]);

  async function handleDelete(schedule: Schedule) {
    try {
      await deleteSchedule(String(schedule.id));
      toast.success("Schedule deleted successfully");
      clearSchedules(); // Clear store to trigger refetch
      router.refresh();
    } catch (error) {
      console.error("Failed to delete schedule:", error);
      toast.error("Failed to delete schedule");
    }
  }

  async function handleStatusUpdate(status: string) {
    if (!selectedSchedule) return;

    const res: UpdateScheduleStatusResponse = await updateScheduleStatus(
      String(selectedSchedule.id),
      status
    );
    if (res?.success) {
      toast.success(res.success);
      if (res.data) setSelectedSchedule(res.data);
      // Update the schedules list with the updated data
      if (res.data) {
        const updatedSchedules = schedules.map((schedule) =>
          schedule.id === selectedSchedule.id ? res.data! : schedule
        );
        setSchedules(updatedSchedules);
      }
    } else if (res?.error) {
      toast.error(res.error);
    }
  }

  return (
    <div className="space-y-6">
      <ScheduleHeader onCreateClick={() => setOpen(true)} />
      <HasPermission permission={Permission.MANAGE_SCHEDULES}>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Schedule</DialogTitle>
            </DialogHeader>
            <CreateScheduleForm
              users={users}
              templates={templates}
              sites={sites}
              onCancel={() => setOpen(false)}
              onSubmit={() => setOpen(false)}
            />
          </DialogContent>
        </Dialog>
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Schedule</DialogTitle>
            </DialogHeader>
            {selectedSchedule && (
              <EditScheduleForm
                schedule={selectedSchedule}
                users={users}
                templates={templates}
                sites={sites}
                onCancel={() => setEditOpen(false)}
                onSubmit={() => setEditOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>

        <DeleteDialog
          title="Delete Schedule"
          description="Are you sure you want to delete this schedule? This action cannot be undone."
          onDelete={() => handleDelete(selectedSchedule!)}
          trigger={
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Delete Schedule"
              className="hidden"
            >
              <Trash2Icon className="h-4 w-4 text-destructive" />
            </Button>
          }
        />
      </HasPermission>

      <ScheduleSearch value={searchQuery} onChange={setSearchQuery} />

      <div className="space-y-4">
        {filteredSchedules?.length === 0 ? (
          <SchedulesLoadingSkeleton />
        ) : (
          filteredSchedules?.map((schedule) => (
            <ScheduleCard
              key={schedule.id}
              schedule={schedule}
              onEdit={(schedule) => {
                setSelectedSchedule(schedule);
                setEditOpen(true);
              }}
              onDelete={(schedule) => {
                setSelectedSchedule(schedule);
                const deleteButton = document.querySelector(
                  '[aria-label="Delete Schedule"]'
                ) as HTMLButtonElement;
                if (deleteButton) {
                  deleteButton.click();
                }
              }}
              onViewDetails={(schedule) => {
                setSelectedSchedule(schedule);
                setDetailsOpen(true);
              }}
            />
          ))
        )}
      </div>

      <ScheduleDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        schedule={selectedSchedule}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
}
