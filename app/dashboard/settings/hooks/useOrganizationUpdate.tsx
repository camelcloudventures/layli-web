import { updateOrganization } from "@/app/dashboard/settings/actions/actions";
import { toast } from "sonner";
import { useState } from "react";
import { useAuth } from "@/lib/context/auth-provider";
import { Org } from "@/lib/types";
import { uploadImage } from "@/utils/common";

export function useOrganizationUpdate() {
  const { activeOrg, updateActiveOrg } = useAuth();

  const [updating, setUpdating] = useState(false);
  const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedLogoFile(file);
    setLogoPreviewUrl(URL.createObjectURL(file));
  }

  async function handleUpdateOrganization(formData: FormData) {
    if (!activeOrg?.id) {
      toast.error("No active organization found");
      return;
    }

    setUpdating(true);

    let logoUrl = activeOrg?.logo || "";
    if (selectedLogoFile) {
      const { fileUrl, error } = await uploadImage(
        { file: selectedLogoFile },
        "organization-logos"
      );
      if (error) {
        toast.error(error);
        setUpdating(false);
        return;
      }
      logoUrl = fileUrl || "";
    }
    if (logoUrl) formData.set("logo", logoUrl);

    const res = await updateOrganization(activeOrg.id, formData);
    setUpdating(false);

    if (res?.error) {
      toast.error(res.error);
      return;
    }

    if (res?.success && res?.data) {
      updateActiveOrg(res.data as Org);
      toast.success("Organization updated successfully");
      setSelectedLogoFile(null);
      setLogoPreviewUrl(null);
    } else {
      toast.error("Failed to update organization");
    }
  }

  return {
    handleUpdateOrganization,
    handleLogoChange,
    updating,
    activeOrg,
    logoPreviewUrl,
  };
}
