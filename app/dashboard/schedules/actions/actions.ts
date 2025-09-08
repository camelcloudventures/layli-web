"use server";

import { DELETE, GET, POST, UPDATE } from "@/app/backend/apiMethods";
import type { SchedulesResponse, Schedule } from "@/lib/types/schedule-types";
import { revalidateTag } from "next/cache";
import { ActiveUser } from "@/lib/types";

export async function getSchedules(
  page: number
): Promise<SchedulesResponse | null> {
  return await GET<SchedulesResponse>(`/schedules/get?page=${page}`, [
    "schedules",
  ]);
}

export async function createSchedule(formData: FormData) {
  const title = formData.get("title") as string;
  const template_id = formData.get("template_id") as string;
  const site_id = formData.get("site_id") as string;
  const assigneesString = formData.get("assignees") as string;
  const assignees = assigneesString ? JSON.parse(assigneesString) : [];
  const frequency = formData.get("frequency") as string;
  const start_time = formData.get("start_time") as string;
  const end_time = formData.get("end_time") as string;
  const completion_policy = formData.get("completion_policy") as string;
  const scheduleData = {
    title,
    template_id,
    site_id,
    assignees,
    frequency,
    start_time,
    end_time,
    completion_policy,
  };
  console.log("THE REAL SCHEDULE DATA", scheduleData);

  const res = await POST("/schedules/create", scheduleData, true, [
    "schedules",
  ]);

  revalidateTag("schedules");

  return res;
}

export async function getActiveUsers(): Promise<ActiveUser | null> {
  return await GET(`/invites/organization/active-users`, ["users"]);
}

export async function updateSchedule(formData: FormData) {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const template_id = formData.get("template_id") as string;
  const site_id = formData.get("site_id") as string;
  const assigneesString = formData.get("assignees") as string;
  const assignees = assigneesString ? JSON.parse(assigneesString) : [];
  const frequency = formData.get("frequency") as string;
  const status = formData.get("status") as string;
  const start_time = formData.get("start_time") as string;
  const end_time = formData.get("end_time") as string;
  const completion_policy = formData.get("completion_policy") as string;
  const scheduleData = {
    id,
    title,
    template_id,
    site_id,
    assignees,
    frequency,
    status,
    start_time,
    end_time,
    completion_policy,
  };

  const res = await UPDATE(`/schedules/update/${id}`, scheduleData);

  revalidateTag("schedules");

  return res;
}

export async function deleteSchedule(id: string) {
  const res = await DELETE(`/schedules/delete/${id}`, true, ["schedules"]);
  revalidateTag("schedules");
  return res;
}

export type UpdateScheduleStatusResponse = {
  success?: string;
  error?: string;
  data?: Schedule;
};

export async function updateScheduleStatus(
  id: string,
  status: string
): Promise<UpdateScheduleStatusResponse> {
  const res = await UPDATE(`/schedules/update-status/${id}`, { status });
  revalidateTag("schedules");
  if (!res) return { error: "No response from server" };
  if ("success" in res || "error" in res || "data" in res)
    return res as UpdateScheduleStatusResponse;
  return { error: "Unexpected response format" };
}
