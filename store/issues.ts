import { Issue } from "@/lib/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IssuesStore {
  issues: Issue[];
  success: boolean;
  setIssues: (issues: Issue[]) => void;
  setSuccess: (success: boolean) => void;
}

export const useIssuesStore = create<IssuesStore>()(
  persist(
    (set) => ({
      issues: [],
      success: false,
      setIssues: (issues) => set({ issues }),
      setSuccess: (success) => set({ success }),
    }),
    {
      name: "issues-storage",
    }
  )
);
