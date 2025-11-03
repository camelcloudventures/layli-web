"use server";

import { extractTokens } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { GET, POST } from "@/app/backend/apiMethods";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signUp(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email");
  const password = formData.get("password");
  const name = formData.get("fullName");
  const phoneNumber = formData.get("phoneNumber");

  try {
    const { data: authUser, error: signUpError } = await supabase.auth.signUp({
      email: email as string,
      password: password as string,
      options: {
        emailRedirectTo: process.env.SITE_URL,
        data: {
          name: name as string,
        },
      },
    });

    if (signUpError) {
      return { error: signUpError.message };
    }

    const { error: profileError } = await supabase.from("profile").insert({
      id: authUser!.user?.id,
      full_name: name,
      email,
      role: "admin",
      phone_number: phoneNumber,
    });
    if (profileError) {
      return { error: profileError.message };
    }

    return {
      success:
        "Account created successfully! Check your email for verification.",
      user: authUser!.user?.id,
    };
  } catch (err) {
    const error = err as Error;
    return { error: error.message };
  }
}

export async function signIn(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email");
  const password = formData.get("password");

  try {
    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email: email as string,
        password: password as string,
      });

    if (signInError) {
      return { error: signInError.message };
    }

    //Query the profile table to get the last_active_organizatio_id  and store this id in the frontend and use to query for any data
    const { error: setSessionError } = await supabase.auth.setSession({
      access_token: signInData.session?.access_token,
      refresh_token: signInData.session?.refresh_token,
    });

    console.log("access_token", signInData.session?.access_token);
    console.log("refresh_token", signInData.session?.refresh_token);

    if (setSessionError) {
      return { error: setSessionError.message };
    }

    // Fetch organization context immediately after successful sign in
    const orgContext = await getUserOrganizations();

    if (!orgContext?.success) {
      return { error: "Failed to load organization data" };
    }

    return {
      success: "Signed in successfully! Redirecting...",
      user: signInData.user,
      //@ts-expect-error - orgContext.data is not typed
      organizations: orgContext.data?.organizations,
      //@ts-expect-error - orgContext.data is not typed
      activeOrganization: orgContext.data?.activeOrganization,
    };
  } catch (err) {
    const error = err as Error;
    return { error: error.message };
  }
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) return { error: "User not authenticated." };

  try {
    const fullName = formData.get("fullName") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const image = formData.get("image") as string | null;

    const updateData: {
      full_name: string;
      phone_number: string;
      image?: string;
    } = { full_name: fullName, phone_number: phoneNumber };
    if (image) updateData.image = image;

    const { error } = await supabase
      .from("profile")
      .update(updateData)
      .eq("id", user.id);

    if (error) return { error: error.message };
    return { success: "Profile updated successfully." };
  } catch (err) {
    const error = err as Error;
    return { error: error.message };
  }
}

export async function acceptInvite(
  formData: FormData,
  router: string,
  role: string,
  token: string,
  orgId: string
) {
  const supabase = await createClient();

  const cookieStore = await cookies();
  cookieStore.set("active_org", orgId, {
    path: "/",
    sameSite: "lax",
  });
  try {
    const { accessToken, refreshToken } = extractTokens(router);
    if (!accessToken || !refreshToken) {
      return { error: "Invalid or expired invite link." };
    }

    const { data: sessionData, error: sessionError } =
      await supabase.auth.setSession({
        access_token: accessToken!,
        refresh_token: refreshToken!,
      });
    if (sessionError) {
      return { error: sessionError.message };
    }

    const password = formData.get("password") as string;
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });
    if (updateError) {
      return { error: updateError.message };
    }

    const validateRes = await GET(`/invites/validate/${token}`);
    if (!validateRes?.success) {
      return { error: validateRes?.error || "Invalid invite token" };
    }

    const fullName = formData.get("fullName") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const { error: profileError } = await supabase
      .from("profile")
      .upsert({
        id: sessionData.user?.id,
        full_name: fullName,
        phone_number: phoneNumber,
        email: sessionData.user?.email,
        role,
        email_verified_at: new Date(),
      })
      .select()
      .single();

    //Add the user to the invite table
    const { error: inviteError } = await supabase
      .from("invites")
      .update({
        user_id: sessionData.user?.id,
      })
      .eq("token", token);

    if (inviteError) {
      return { error: inviteError.message };
    }

    // Add the user to organization_members
    const { error: orgMemberError } = await supabase
      .from("organization_members")
      .insert({
        organization_id: orgId,
        user_id: sessionData.user?.id,
        role: role,
        is_default: true,
      });

    if (orgMemberError) {
      return { error: orgMemberError.message };
    }

    if (profileError) {
      return { error: profileError.message };
    }

    // Set the active organization in cookies

    return { success: "Account setup complete! Redirecting..." };
  } catch (error) {
    const err = error as Error;
    return { error: err.message };
  }
}

export async function getUsers() {
  return await GET("/users", ["users"]);
}

interface OrgResponse {
  success: boolean;
  data: {
    user: {
      id: string;
      email: string;
      full_name?: string;
      role?: string;
      phone_number?: string;
      image?: string;
    };
    organizations: Array<{
      id: string;
      name: string;
      type?: string;
      created_at: string;
      updated_at: string;
      created_by: string;
    }>;
    orgMemberships: Array<{
      organization_id: string;
      role: string;
      is_default: boolean;
    }>;
    activeOrganization: {
      id: string;
      name: string;
      type?: string;
      created_at: string;
      updated_at: string;
      created_by: string;
    };
  };
}

export async function createOrganization(formData: FormData, user: string) {
  try {
    const name = formData.get("name") as string;
    const type = formData.get("type") as string;

    const data = {
      name,
      type,
      created_by: user,
    };
    // Skip organization check since this is creating a new organization
    // and there won't be an active organization yet
    const res = await POST("/organizations/create", data, false);
    return res;
  } catch (error) {
    const err = error as Error;
    return { error: err.message };
  }
}

export async function getUserOrganizations() {
  const response = await GET<OrgResponse>("/auth/context", undefined, true);

  //@ts-expect-error - response.data is not typed
  if (response?.success && response?.data?.activeOrganization) {
    const cookieStore = await cookies();
    //@ts-expect-error - response.data is not typed
    cookieStore.set("active_org", response.data.activeOrganization.id, {
      path: "/",
      sameSite: "lax",
    });
  }

  return response;
}

export async function logout() {
  const supabase = await createClient();
  const cookieStore = await cookies();
  await supabase.auth.signOut();
  cookieStore.delete("active_org");
  return redirect("/auth/login");
}

export async function resetPasswordAction(formData: FormData) {
  const email = formData.get("email");
  const supabase = await createClient();

  try {
    await supabase.auth.resetPasswordForEmail(email as string, {
      redirectTo: `${process.env.SITE_URL}/api/auth/callback`,
    });

    return {
      success: true,
      message: `Reset email sent to ${email}. Click the link to reset your password`,
    };
  } catch (error) {
    const err = error as Error;
    return { error: err.message || "Failed to send reset email" };
  }
}
