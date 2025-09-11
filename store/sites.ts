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
    console.log("updateSite called with siteId:", siteId, "and name:", name);
    set((state) => {
      console.log("Current sites:", state.sites);
      const updatedSites = state.sites.map((site) => {
        console.log(
          `Comparing store site.id (${
            site.id
          }, type: ${typeof site.id}) with received siteId (${siteId}, type: ${typeof siteId})`
        );
        if (String(site.id) === siteId) {
          console.log("Match found for site.id:", site.id);
          return { ...site, name };
        }
        return site;
      });
      console.log("Updated sites:", updatedSites);
      return { sites: updatedSites };
    });
  },
  removeSite: (siteId) =>
    set((state) => ({
      sites: state.sites.filter((site) => site.id !== siteId),
    })),
  addSite: (site) => set((state) => ({ sites: [...state.sites, site] })),
}));
