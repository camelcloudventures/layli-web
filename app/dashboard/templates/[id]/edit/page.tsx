import { getTemplate } from "@/app/dashboard/templates/actions/actions";
import { redirect } from "next/navigation";
import EditTemplateShell from "./components/edit-template-shell";
import { createClient } from "@/utils/supabase/server";
import { Permission, hasPermission } from "@/lib/auth/auth";

export const dynamic = "force-dynamic";

export default async function EditTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Check if user has permission to edit templates
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/dashboard/templates");
  }

  // Get user profile with role
  const { data: profile } = await supabase
    .from("profile")
    .select("role")
    .eq("id", authUser.id)
    .single();

  if (
    !profile ||
    !hasPermission(
      { id: authUser.id, role: profile.role },
      Permission.EDIT_TEMPLATES
    )
  ) {
    redirect("/dashboard/templates");
  }

  const { id } = await params;
  const template = await getTemplate(id);
  if (!template || (template && "error" in template)) {
    redirect("/dashboard/templates");
  }
  // If wrapped, unwrap
  const realTemplate = "data" in template ? template.data : template;
  //@ts-expect-error -e9
  return <EditTemplateShell template={realTemplate} />;
}
