import { Action } from "@/lib/types";
import { create } from "zustand";

interface ActionsStore {
  actions: Action[];
  setActions: (actions: Action[]) => void;
}

export const useActionsStore = create<ActionsStore>()((set) => ({
  actions: [],
  setActions: (actions) => set({ actions }),
}));
