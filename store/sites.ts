import { Site } from "@/lib/types";
import { persist } from "zustand/middleware";
import { create } from "zustand";

interface SitesStore {
  sites: Site[];
  setSites: (sites: Site[]) => void;
}

export const useSitesStore = create<SitesStore>()(
  persist(
    (set) => ({
      sites: [],
      setSites: (sites) => set({ sites }),
    }),
    {
      name: "sites-storage",
    }
  )
);
