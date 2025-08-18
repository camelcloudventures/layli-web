import { useGetSites } from "@/app/dashboard/schedules/actions/query";
import { useSitesStore } from "@/store/sites";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

export function useSites() {
  const { sites, setSites } = useSitesStore(
    useShallow((state) => ({
      sites: state.sites,
      setSites: state.setSites,
    }))
  );

  const enabled = !sites || sites.length === 0;
  const { data: fetchedSites, isLoading } = useGetSites(enabled);

  useEffect(() => {
    if (fetchedSites && sites.length === 0) {
      setSites(fetchedSites);
    }
  }, [fetchedSites, sites, setSites]);

  return { sites, isLoading };
}
