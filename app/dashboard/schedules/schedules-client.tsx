"use client";
import { useSchedules } from "@/hooks/use-schedules";
import { useSites } from "@/hooks/use-sites";
import { useUsers } from "@/hooks/use-users";
import { SchedulesList } from "./components/schedules-list";
import { useAuditTemplates } from "@/hooks/use-audit-templates";

export function SchedulesClient() {
  const { schedules } = useSchedules();
  const { users } = useUsers();
  const { templates } = useAuditTemplates();
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
