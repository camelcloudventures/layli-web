import { useGetOrganizationSites } from "@/app/dashboard/sites/actions/query";
import { useSitesStore } from "@/store/sites";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

export function useOrganizationSite() {
  const { sites, setSites, addSite } = useSitesStore(
    useShallow((state) => ({
      sites: state.sites,
      setSites: state.setSites,
      addSite: state.addSite,
    }))
  );

  const enabled = !sites || sites.length === 0;
  const { data: fetchedOrganizationSites, isLoading } =
    useGetOrganizationSites(enabled);

  useEffect(() => {
    if (fetchedOrganizationSites && sites.length === 0) {
      setSites(fetchedOrganizationSites.data);
    }
  }, [fetchedOrganizationSites, sites, setSites]);

  return { sites, setSites, addSite, isLoading };
}
