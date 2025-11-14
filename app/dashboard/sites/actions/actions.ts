"use server";
import { DELETE, GET, POST, UPDATE } from "@/app/backend/apiMethods";
import { Site } from "@/lib/types";
import { revalidateTag } from "next/cache";
import { SiteFormData } from "../../settings/actions/types";

export async function getSites(): Promise<{ data: Site[] } | null> {
  // @ts-expect-error - GET is not typed
  return await GET<{ data: Site[] }>("/sites", ["sites"]);
}

export async function createOrganizationSite(
  formData: SiteFormData
): Promise<Site> {
  const siteData = {
    name: formData.name,
    address: "",
    longitude: 0,
    latitude: 0,
  };

  console.log("site data being sent", siteData);

  const res = await POST<{
    name: string;
    address: string;
    longitude: number;
    latitude: number;
  }>("/sites/create", siteData);

  console.log("response from the backend", res);
  revalidateTag("organization-sites");

  if (!res || res.error) {
    throw new Error(res?.error || "Failed to create site");
  }

  if (!res.data) {
    throw new Error("No data returned from server");
  }

  return res.data as Site;
}

export async function updateSite(
  siteId: string,
  name: string
): Promise<{ name: string }> {
  const res = await UPDATE(`/sites/${siteId}/update`, { name });
  revalidateTag("organization-sites");

  if (!res || res.error) {
    throw new Error(res?.error || "Failed to update site");
  }

  if (!res.data) {
    throw new Error("No data returned from server");
  }

  return res.data as { name: string };
}

export async function deleteSite(siteId: string) {
  const res = await DELETE(`/sites/${siteId}/delete`, {});
  revalidateTag("organization-sites");
  return res;
}
