import { updateOrganization } from "@/app/dashboard/settings/actions/actions";
import { toast } from "sonner";
import { useState } from "react";
import { useAuth } from "@/lib/context/auth-provider";
import { Org } from "@/lib/types";

export function useOrganizationUpdate() {
  const { activeOrg, updateActiveOrg } = useAuth();

  const [updating, setUpdating] = useState(false);

  async function handleUpdateOrganization(formData: FormData) {
    if (!activeOrg?.id) {
      toast.error("No active organization found");
      return;
    }

    setUpdating(true);
    const res = await updateOrganization(activeOrg.id, formData);
    setUpdating(false);

    if (res?.error) {
      toast.error(res.error);
      return;
    }

    if (res?.success && res?.data) {
      updateActiveOrg(res.data as Org);
      toast.success("Organization updated successfully");
    } else {
      toast.error("Failed to update organization");
    }
  }

  return {
    handleUpdateOrganization,
    updating,
    activeOrg,
  };
}
