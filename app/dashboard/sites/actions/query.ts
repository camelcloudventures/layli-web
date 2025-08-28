import { GET } from "@/app/backend/apiMethods";
import { Site } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

interface OrganizationSitesResponse {
  data: Site[];
}

export function useGetOrganizationSites(enabled: boolean) {
  return useQuery({
    queryKey: ["organization-sites"],
    queryFn: async () => {
      return await GET<OrganizationSitesResponse>("/sites", [
        "organization-sites",
      ]);
    },
    enabled: enabled ?? true,
  });
}
