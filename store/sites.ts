import { Site } from "@/lib/types";
import { create } from "zustand";

interface SitesStore {
  sites: Site[];
  setSites: (sites: Site[]) => void;
}

export const useSitesStore = create<SitesStore>()((set) => ({
  sites: [],
  setSites: (sites) => set({ sites }),
}));
