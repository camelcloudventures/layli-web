import { Site } from "@/lib/types";
import { create } from "zustand";

interface OrganizationSitesStore {
  sites: Site[];
  setSites: (sites: Site[]) => void;
  addSite: (site: Site) => void;
}

export const useOrganizationSitesStore = create<OrganizationSitesStore>()(
  (set) => ({
    sites: [],
    setSites: (sites) => set({ sites }),
    addSite: (site) => set((state) => ({ sites: [...state.sites, site] })),
  })
);
