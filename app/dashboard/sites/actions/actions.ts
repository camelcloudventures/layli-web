"use server";
import { DELETE, GET, POST, UPDATE } from "@/app/backend/apiMethods";
import { Site } from "@/lib/types";
import { revalidateTag } from "next/cache";
import { SiteFormData } from "../../settings/actions/types";

export async function getSites(): Promise<{ data: Site[] } | null> {
  return await GET<{ data: Site[] }>("/sites", ["sites"]);
}

export async function createOrganizationSite(formData: SiteFormData) {
  const siteData = {
    name: formData.name,
    address: "",
    longitude: 0,
    latitude: 0,
  };

  console.log("site data being sent", siteData);

  const res = await POST("/sites/create", siteData);

  console.log("response from the backend", res);
  revalidateTag("organization-sites");
  return res;
}

export async function updateSite(siteId: string, name: string) {
  const res = await UPDATE(`/sites/${siteId}/update`, { name });
  revalidateTag("organization-sites");
  return res;
}

export async function deleteSite(siteId: string) {
  const res = await DELETE(`/sites/${siteId}/delete`, {});
  revalidateTag("organization-sites");
  return res;
}
