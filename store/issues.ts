import { Issue } from "@/lib/types";
import { create } from "zustand";

interface IssuesStore {
  issues: Issue[];
  setIssues: (issues: Issue[] | ((prev: Issue[]) => Issue[])) => void;
  clearIssues: () => void;
}

export const useIssuesStore = create<IssuesStore>()((set) => ({
  issues: [],
  setIssues: (issues) =>
    set((state) => ({
      issues: typeof issues === "function" ? issues(state.issues) : issues,
    })),
  clearIssues: () => set({ issues: [] }),
}));
