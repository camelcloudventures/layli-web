import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SiteFormData } from "../../settings/actions/types";
import { createOrganizationSite } from "./actions";

export function useCreateOrganizationSiteMutation() {
  const queryClient = useQueryClient();
  return useMutation<SiteFormData, Error, SiteFormData>({
    mutationFn: async (siteData: SiteFormData) =>
      createOrganizationSite(siteData),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ["organization-sites"],
      });
    },
    onError: (error) => {
      console.error("Error creating organization site:", error);
    },
  });
}
