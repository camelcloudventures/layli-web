"use client";

import { Button } from "@/components/ui/button";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Permission } from "@/lib/auth/auth";
import type { Schedule } from "@/lib/types/schedule-types";
import { useSchedulesStore } from "@/store/schedules";
import { Trash2Icon } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { getUser } from "@/utils/common";
import HasPermission from "../../components/has-permission";
import {
  deleteSchedule,
  updateScheduleStatus,
  UpdateScheduleStatusResponse,
  createInspectionFromSchedule,
  CreateInspectionFromScheduleResponse,
} from "../actions/actions";
import type {
  SiteOption,
  TemplateOption,
  UserOption,
} from "../types/schedule-form-types";
import { CreateScheduleForm } from "./create-schedule-form";
import { EditScheduleForm } from "./edit-schedule-form";
import { ScheduleCard } from "./schedule-card";
import { ScheduleDetailsDialog } from "./schedule-details-dialog";
import { ScheduleHeader } from "./schedule-header";
import { ScheduleSearch } from "./schedule-search";
import { SiteFilter } from "./site-filter";
import SchedulesLoadingSkeleton from "./schedules-loading-skeleton";

interface SchedulesListProps {
  schedules: Schedule[];
  users: UserOption[];
  templates: TemplateOption[];
  sites: SiteOption[];
  isLoading: boolean;
}

export function SchedulesList({
  schedules,
  users,
  templates,
  sites,
  isLoading,
}: SchedulesListProps) {
  const { removeSchedule, setSchedules } = useSchedulesStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  console.log("schedules", schedules);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSite, setSelectedSite] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [loadingInspectionId, setLoadingInspectionId] = useState<string | null>(
    null
  );

  const filteredSchedules = useMemo(() => {
    let filtered = schedules;

    // Filter by site
    if (selectedSite !== "all") {
      filtered = filtered.filter(
        (schedule) => String(schedule.site_id) === selectedSite
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (schedule) =>
          schedule.title.toLowerCase().includes(query) ||
          schedule.site?.name?.toLowerCase().includes(query) ||
          schedule.assignees?.some((assignee) =>
            // @ts-expect-error - assignees structure needs to be fixed
            assignee.full_name?.toLowerCase().includes(query)
          ) ||
          schedule.assignees?.some((assignee) =>
            // @ts-expect-error - assignees structure needs to be fixed
            assignee.email?.toLowerCase().includes(query)
          ) ||
          schedule.template?.title?.toLowerCase().includes(query) ||
          schedule.frequency.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, selectedSite, schedules]);

  // Handle scheduleId and scheduleTitle query parameters to auto-open dialog
  useEffect(() => {
    const scheduleId = searchParams.get("scheduleId");
    const scheduleTitle = searchParams.get("scheduleTitle");

    if (schedules.length > 0) {
      let schedule: Schedule | undefined;

      if (scheduleId) {
        // Find by ID
        schedule = schedules.find((s) => String(s.id) === scheduleId);
      } else if (scheduleTitle) {
        // Find by title (for notifications with empty links)
        schedule = schedules.find(
          (s) =>
            s.title.toLowerCase() ===
            decodeURIComponent(scheduleTitle).toLowerCase()
        );
      }

      if (schedule) {
        setSelectedSchedule(schedule);
        setDetailsOpen(true);
        // Remove query params from URL
        const params = new URLSearchParams(searchParams.toString());
        params.delete("scheduleId");
        params.delete("scheduleTitle");
        router.replace(
          `/dashboard/schedules${
            params.toString() ? `?${params.toString()}` : ""
          }`
        );
      }
    }
  }, [searchParams, schedules, router]);

  async function handleDelete(schedule: Schedule) {
    const res = await deleteSchedule(String(schedule.id));
    if (res?.success) {
      toast.success("Schedule deleted successfully");
      removeSchedule(String(schedule.id));
    } else {
      toast.error(res?.error || "Failed to delete schedule");
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

  async function handleCreateInspection(schedule: Schedule) {
    const scheduleId = String(schedule.id);
    setLoadingInspectionId(scheduleId);

    try {
      const user = await getUser();
      if (!user?.id) {
        toast.error("User not found");
        return;
      }

      const res: CreateInspectionFromScheduleResponse =
        await createInspectionFromSchedule(scheduleId, user.id);

      if (res?.success && res.data) {
        toast.success("Inspection created successfully");
        router.push(`/dashboard/inspections/${res.data.inspection.id}/edit`);
      } else {
        toast.error(res?.error || "Failed to create inspection");
      }
    } catch (error) {
      console.error("Error creating inspection:", error);
      toast.error("Failed to create inspection");
    } finally {
      setLoadingInspectionId(null);
    }
  }

  return (
    <div className="space-y-6">
      <ScheduleHeader onCreateClick={() => setOpen(true)} />
      {isLoading && <SchedulesLoadingSkeleton />}
      <HasPermission permission={Permission.MANAGE_SCHEDULES}>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px] overflow-hidden hover:overflow-y-auto scrollbar-none p-6">
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
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px] overflow-hidden hover:overflow-y-auto scrollbar-none p-6">
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

      <div className="flex flex-col sm:flex-row gap-4 items-center ">
        <SiteFilter
          sites={sites}
          value={selectedSite}
          onChange={setSelectedSite}
        />
        <div className="flex-1 w-full sm:w-auto">
          <ScheduleSearch value={searchQuery} onChange={setSearchQuery} />
        </div>
      </div>

      <div className="space-y-4">
        {filteredSchedules?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No schedules found</p>
          </div>
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
              onCreateInspection={handleCreateInspection}
              isLoadingInspection={loadingInspectionId === String(schedule.id)}
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
