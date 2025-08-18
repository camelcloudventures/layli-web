"use server";

import { GET, POST, UPDATE } from "@/app/backend/apiMethods";
import { revalidateTag } from "next/cache";
import { InviteResponse } from "./types";
export async function inviteUser(
  formData: FormData,
  userId: string,
  role: string,
  orgId: string
) {
  const email = formData.get("email");

  console.log("role", role);
  console.log("userId", userId);
  const data = {
    email,
    role: role,
    user: userId,
  };
  console.log("orgId", orgId);

  console.log("data", data);
  const res = await POST(`/organizations/invite-member/${orgId}`, data);
  console.log("res", res);
  revalidateTag("invites");
  return res;
}

export async function getInvites(): Promise<InviteResponse | null> {
  return await GET(`/invites/organization/users`, ["invites"]);
}

export async function updateUserRole(userId: string, role: string) {
  const res = await UPDATE(`/invites/update/${userId}`, { role });
  revalidateTag("invites");
  return res;
}
