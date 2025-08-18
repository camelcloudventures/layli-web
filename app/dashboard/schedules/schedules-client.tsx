"use client";
import { useSchedules } from "@/hooks/use-schedules";
import { useSites } from "@/hooks/use-sites";
import { useTemplates } from "@/hooks/use-templates";
import { useUsers } from "@/hooks/use-users";
import { SchedulesList } from "./components/schedules-list";

export function SchedulesClient() {
  const { schedules } = useSchedules();
  const { users } = useUsers();
  const { templates } = useTemplates();
  const { sites } = useSites();

  return (
    <SchedulesList
      schedules={schedules}
      users={users || []}
      templates={templates || []}
      sites={sites || []}
    />
  );
}
