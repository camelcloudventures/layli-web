import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SiteFormData } from "../../settings/actions/types";
import { createOrganizationSite, deleteSite, updateSite } from "./actions";
import { Site } from "@/lib/types";

export function useCreateOrganizationSiteMutation() {
  const queryClient = useQueryClient();

  return useMutation<Site, Error, SiteFormData>({
    mutationFn: async (siteData: SiteFormData) =>
      createOrganizationSite(siteData),
    onSuccess: () => {
      // Invalidate and refetch sites cache used by issues, actions, schedules
      queryClient.invalidateQueries({ queryKey: ["sites"] });
    },
  });
}

export function useUpdateSiteMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    { name: string } | null,
    Error,
    { siteId: string; name: string }
  >({
    mutationFn: async ({ siteId, name }) => updateSite(siteId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sites"] });
    },
  });
}

export function useDeleteSiteMutation() {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, string>({
    mutationFn: async (siteId: string) => deleteSite(siteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sites"] });
    },
  });
}
