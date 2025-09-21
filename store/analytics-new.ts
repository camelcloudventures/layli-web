import {
  ComprehensiveAnalytics,
  LocationAnalytics,
  RiskAnalytics,
  ComplianceAnalytics,
  IssuesAnalyticsNew,
  TimeFilter,
} from "@/app/dashboard/analytics/actions/actions";
import { create } from "zustand";

interface AnalyticsStore {
  // Data
  comprehensiveData: ComprehensiveAnalytics | null;
  locationData: LocationAnalytics | null;
  riskData: RiskAnalytics | null;
  complianceData: ComplianceAnalytics | null;
  issuesData: IssuesAnalyticsNew | null;

  // UI State
  currentTab: "inspections" | "issues" | "actions" | "locations";
  timeFilter: TimeFilter;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;

  // Actions
  setComprehensiveData: (data: ComprehensiveAnalytics) => void;
  setLocationData: (data: LocationAnalytics) => void;
  setRiskData: (data: RiskAnalytics) => void;
  setComplianceData: (data: ComplianceAnalytics) => void;
  setIssuesData: (data: IssuesAnalyticsNew) => void;
  setCurrentTab: (
    tab: "inspections" | "issues" | "actions" | "locations"
  ) => void;
  setTimeFilter: (filter: TimeFilter) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setLastUpdated: (date: Date) => void;
  clearData: () => void;
}

export const useAnalyticsStore = create<AnalyticsStore>()((set) => ({
  // Initial state
  comprehensiveData: null,
  locationData: null,
  riskData: null,
  complianceData: null,
  issuesData: null,
  currentTab: "inspections",
  timeFilter: "month",
  isLoading: false,
  error: null,
  lastUpdated: null,

  // Actions
  setComprehensiveData: (data) => set({ comprehensiveData: data }),
  setLocationData: (data) => set({ locationData: data }),
  setRiskData: (data) => set({ riskData: data }),
  setComplianceData: (data) => set({ complianceData: data }),
  setIssuesData: (data) => set({ issuesData: data }),
  setCurrentTab: (tab) => set({ currentTab: tab }),
  setTimeFilter: (filter) => set({ timeFilter: filter }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setLastUpdated: (date) => set({ lastUpdated: date }),
  clearData: () =>
    set({
      comprehensiveData: null,
      locationData: null,
      riskData: null,
      complianceData: null,
      issuesData: null,
      error: null,
      lastUpdated: null,
    }),
}));
