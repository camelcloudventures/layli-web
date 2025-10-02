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

  // Always allow fetching - let React Query handle caching
  const { data: fetchedSites, isLoading } = useGetSites(true);

  useEffect(() => {
    if (fetchedSites) {
      setSites(fetchedSites);
    }
  }, [fetchedSites, setSites]);

  return { sites, isLoading };
}
