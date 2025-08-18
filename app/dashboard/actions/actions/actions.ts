"use server";

import { GET, UPDATE, DELETE, POST } from "@/app/backend/apiMethods";
import {
  Action,
  ActionPriority,
  ActionStatus,
  Assignee,
  Site,
} from "@/lib/types";
import { revalidatePath, revalidateTag } from "next/cache";
import { ActionsResponse } from "./types";

export async function getActions(): Promise<{ data: Action[] } | null> {
  const result = await GET<ActionsResponse>("/actions", ["actions"]);
  return result as { data: Action[] } | null;
}

type CreatedBy = {
  id: string;
  full_name: string;
  email: string;
  role: string;
};
export async function createAction(
  formData: FormData,
  created_by: CreatedBy,
  site: Site,
  assignees: Assignee[]
) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const status = formData.get("status") as ActionStatus;
    const priority = formData.get("priority") as ActionPriority;
    const due_at = formData.get("due_at") as string;
    const label = formData.get("label") as string;

    const frequency = (formData.get("frequency") as string) || "one_time";

    const payload = {
      title,
      description,
      status,
      priority,
      due_at,
      frequency,
      site_id: Number(site.id),
      site: {
        id: Number(site.id),
        name: site.name,
        address: site.address,
        latitude: site.latitude,
        longitude: site.longitude,
      },
      label,
      assignees,
      created_by,
    };

    console.log("payload", payload);
    const res = await POST("/actions/create", payload);

    revalidateTag("actions");

    if (res && res.error) {
      return { error: res.error };
    }

    return { success: "Action created successfully", data: res };
  } catch (error) {
    console.error("Error creating action:", error);
    return { error: "Failed to create action" };
  }
}

export async function updateAction(id: string, payload: Partial<Action>) {
  console.log("updateAction called with:", id, payload);

  const res = await UPDATE(`/actions/${id}/update`, payload);
  console.log("updateAction API response:", res);
  revalidateTag("actions");
  return res;
}

export async function deleteAction(id: string) {
  const res = await DELETE(`/actions/${id}/delete `, {});
  revalidatePath("/dashboard/actions");
  return res;
}

/**
 * Mark an action as completed
 * comment which is a must
 * files (not a must) [url from supabase after user uploads the file]
 *site (not a must)
 *  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;
 */
export async function markActionAsCompleted(
  id: string,
  payload: { comments: string; file?: string; site_id: string }
) {
  const res = await UPDATE(`/actions/${id}/done`, payload);
  revalidatePath("/dashboard/actions");
  return res;
}
