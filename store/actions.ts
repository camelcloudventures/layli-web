import { Action } from "@/lib/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ActionsStore {
  actions: Action[];
  setActions: (actions: Action[]) => void;
}

export const useActionsStore = create<ActionsStore>()(
  persist(
    (set) => ({
      actions: [],
      setActions: (actions) => set({ actions }),
    }),
    {
      name: "actions-storage",
    }
  )
);
