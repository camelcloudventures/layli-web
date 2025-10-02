import { Site } from "@/lib/types";
import { create } from "zustand";

interface SitesStore {
  sites: Site[];
  setSites: (sites: Site[]) => void;
  updateSite: (siteId: string, name: string) => void;
  removeSite: (siteId: string) => void;
  addSite: (site: Site) => void;
}

export const useSitesStore = create<SitesStore>()((set) => ({
  sites: [],
  setSites: (sites) => set({ sites }),
  updateSite: (siteId, name) => {
    set((state) => ({
      sites: state.sites.map((site) =>
        String(site.id) === siteId ? { ...site, name } : site
      ),
    }));
  },
  removeSite: (siteId) =>
    set((state) => ({
      sites: state.sites.filter((site) => site.id !== siteId),
    })),
  addSite: (site) => set((state) => ({ sites: [...state.sites, site] })),
}));
