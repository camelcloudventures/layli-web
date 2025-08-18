import {
  ActionsAnalytics,
  AnalyticsSummary,
  InspectionsAnalytics,
  IssuesAnalytics,
  SchedulesAnalytics,
} from "@/app/dashboard/analytics/actions/actions";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AnalyticsStore {
  analyticsSummary: AnalyticsSummary | null;
  issuesAnalytics: IssuesAnalytics | null;
  actionsAnalytics: ActionsAnalytics | null;
  schedulesAnalytics: SchedulesAnalytics | null;
  inspectionsAnalytics: InspectionsAnalytics | null;
  setAnalyticsSummary: (summary: AnalyticsSummary) => void;
  setIssuesAnalytics: (issue: IssuesAnalytics) => void;
  setActionsAnalytics: (action: ActionsAnalytics) => void;
  setSchedulesAnalytics: (schedule: SchedulesAnalytics) => void;
  setInspectionsAnalytics: (inspection: InspectionsAnalytics) => void;
}

export const useAnalyticsStore = create<AnalyticsStore>()(
  persist(
    (set) => ({
      analyticsSummary: null,
      issuesAnalytics: null,
      actionsAnalytics: null,
      schedulesAnalytics: null,
      inspectionsAnalytics: null,
      setAnalyticsSummary: (summary) => set({ analyticsSummary: summary }),
      setIssuesAnalytics: (issue) => set({ issuesAnalytics: issue }),
      setActionsAnalytics: (action) => set({ actionsAnalytics: action }),
      setSchedulesAnalytics: (schedule) =>
        set({ schedulesAnalytics: schedule }),
      setInspectionsAnalytics: (inspection) =>
        set({ inspectionsAnalytics: inspection }),
    }),
    {
      name: "analytics-summary-storage",
    }
  )
);
