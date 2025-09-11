import { useMutation } from "@tanstack/react-query";
import { SiteFormData } from "../../settings/actions/types";
import { createOrganizationSite, deleteSite, updateSite } from "./actions";

export function useCreateOrganizationSiteMutation() {
  return useMutation<SiteFormData, Error, SiteFormData>({
    mutationFn: async (siteData: SiteFormData) =>
      createOrganizationSite(siteData),
  });
}

export function useUpdateSiteMutation() {
  return useMutation<
    { name: string } | null,
    Error,
    { siteId: string; name: string }
  >({
    mutationFn: async ({ siteId, name }) => updateSite(siteId, name),
  });
}

export function useDeleteSiteMutation() {
  return useMutation<unknown, Error, string>({
    mutationFn: async (siteId: string) => deleteSite(siteId),
  });
}
