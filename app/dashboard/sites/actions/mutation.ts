import { useMutation } from "@tanstack/react-query";
import { SiteFormData } from "../../settings/actions/types";
import { createOrganizationSite } from "./actions";

export function useCreateOrganizationSiteMutation() {
  return useMutation<SiteFormData, Error, SiteFormData>({
    mutationFn: async (siteData: SiteFormData) =>
      createOrganizationSite(siteData),
  });
}
