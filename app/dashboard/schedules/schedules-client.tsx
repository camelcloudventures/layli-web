"use client";
import { useSchedules } from "@/hooks/use-schedules";
import { useSites } from "@/hooks/use-sites";
import { useUsers } from "@/hooks/use-users";
import { SchedulesList } from "./components/schedules-list";
import { useAuditTemplates } from "@/hooks/use-audit-templates";

export function SchedulesClient() {
  const { schedules, isLoading: isLoadingSchedules } = useSchedules();
  const { users, isLoading: isLoadingUsers } = useUsers();
  const { templates, isLoading: isLoadingTemplates } = useAuditTemplates();
  const { sites, isLoading: isLoadingSites } = useSites();

  console.log("I CAN SEE THE LOGGGGGS--------------------");
  console.log("sites are", sites);
  const isLoading =
    isLoadingSchedules ||
    isLoadingUsers ||
    isLoadingTemplates ||
    isLoadingSites;

  return (
    <SchedulesList
      schedules={schedules}
      users={users || []}
      templates={templates || []}
      sites={sites}
      isLoading={isLoading}
    />
  );
}
