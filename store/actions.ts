import { Action } from "@/lib/types";
import { create } from "zustand";

interface ActionsStore {
  actions: Action[];
  setActions: (actions: Action[] | ((prev: Action[]) => Action[])) => void;
  clearActions: () => void;
}

export const useActionsStore = create<ActionsStore>()((set) => ({
  actions: [],
  setActions: (actions) =>
    set((state) => ({
      actions: typeof actions === "function" ? actions(state.actions) : actions,
    })),
  clearActions: () => set({ actions: [] }),
}));
