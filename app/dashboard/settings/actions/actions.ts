"use server";

import { GET, POST, UPDATE, DELETE } from "@/app/backend/apiMethods";
import { revalidateTag } from "next/cache";
export async function inviteUser(
  formData: FormData,
  userId: string,
  role: string,
  orgId: string,
  site_ids: number[] = []
) {
  const email = formData.get("email");

  console.log("role", role);
  console.log("userId", userId);
  const data = {
    email,
    role: role,
    user: userId,
    site_ids,
  };
  console.log("orgId", orgId);

  console.log("data", data);
  const res = await POST(`/organizations/invite-member/${orgId}`, data);
  console.log("res", res);
  revalidateTag("invites");
  return res;
}

export async function getInvites() {
  return await GET(`/invites/organization/users`, ["invites"]);
}

export async function updateUserRole(userId: string, role: string) {
  const res = await UPDATE(`/invites/update/${userId}`, { role });
  revalidateTag("invites");
  return res;
}

export async function updateOrganization(orgId: string, formData: FormData) {
  const name = formData.get("name") as string;

  if (!name) {
    return { error: "Organization name is required" };
  }

  const res = await UPDATE(`/organizations/${orgId}/update`, { name });

  return res;
}

export async function removeUser(userId: string) {
  const res = await DELETE(`/invites/user/${userId}`, undefined, ["invites"]);
  revalidateTag("invites");
  return res;
}

export async function revokeInvite(inviteId: string) {
  const res = await POST(`/invites/${inviteId}/revoke`, {});
  revalidateTag("invites");
  return res;
}

export async function resendInvite(inviteId: string) {
  const res = await POST(`/invites/${inviteId}/resend`, {});
  revalidateTag("invites");
  return res;
}
