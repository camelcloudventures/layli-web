import { useQuery } from "@tanstack/react-query";
import {
  getActionsAnalytics,
  getAnalyticsSummary,
  getInspectionsAnalytics,
  getIssuesAnalytics,
  getSchedulesAnalytics,
} from "./actions";

export function useGetAnalyticsSummary(enabled: boolean) {
  return useQuery({
    queryKey: ["analytics-summary"],
    queryFn: async () => {
      return await getAnalyticsSummary();
    },
    enabled: enabled ?? true,
  });
}

export function useGetIssuesAnalytics(enabled: boolean) {
  return useQuery({
    queryKey: ["issues-analytics"],
    queryFn: async () => {
      return await getIssuesAnalytics();
    },
    enabled: enabled ?? true,
  });
}

export function useGetActionsAnalytics(enabled: boolean) {
  return useQuery({
    queryKey: ["actions-analytics"],
    queryFn: async () => {
      return await getActionsAnalytics();
    },
    enabled: enabled ?? true,
  });
}
export function useGetSchedulesAnalytics(enabled: boolean) {
  return useQuery({
    queryKey: ["schedules-analytics"],
    queryFn: async () => {
      return await getSchedulesAnalytics();
    },
    enabled: enabled ?? true,
  });
}

export function useGetInspectionsAnalytics(enabled: boolean) {
  return useQuery({
    queryKey: ["inspections-analytics"],
    queryFn: async () => {
      return await getInspectionsAnalytics();
    },
    enabled: enabled ?? true,
  });
}
