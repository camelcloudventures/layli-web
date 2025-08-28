"use server";
import { GET, POST } from "@/app/backend/apiMethods";
import { Site } from "@/lib/types";
import { revalidateTag } from "next/cache";
import { SiteFormData } from "../../settings/actions/types";

export async function getSites(): Promise<Site[] | null> {
  return await GET("/sites", ["sites"]);
}

export async function createOrganizationSite(formData: SiteFormData) {
  const siteData = {
    name: formData.name,
    address: "Address",
    longitude: 0,
    latitude: 0,
  };

  const res = await POST("/sites/create", siteData);

  revalidateTag("organization-sites");
  return res;
}
