"use server";

import { GET, POST, UPDATE, DELETE } from "@/app/backend/apiMethods";
import { revalidateTag } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function changePasswordAction(formData: FormData) {
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const email = formData.get("email") as string;

  if (!currentPassword || !newPassword || !email) {
    return { error: "All fields are required" };
  }

  const supabase = await createClient();

  try {
    // First, verify the current password by attempting to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword,
    });

    if (signInError) {
      return { error: "Current password is incorrect" };
    }

    // If verification succeeds, update to new password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      return { error: updateError.message || "Failed to update password" };
    }

    // Sign out the user
    await supabase.auth.signOut();

    return { success: true };
  } catch (error) {
    console.error("Error changing password:", error);
    return { error: "An unexpected error occurred" };
  }
}

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
  const logo = formData.get("logo") as string | null;

  if (!name) {
    return { error: "Organization name is required" };
  }

  const updateData: { name: string; logo?: string } = { name };
  if (logo) {
    updateData.logo = logo;
  }

  const res = await UPDATE(`/organizations/${orgId}/update`, updateData);

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
