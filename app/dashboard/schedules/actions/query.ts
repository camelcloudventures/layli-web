import { useQuery } from "@tanstack/react-query";
import {
  getActiveUsers,
  getSchedules,
  getSites,
  getTemplates,
} from "./actions";

export function useGetActiveUsers(enabled: boolean) {
  return useQuery({
    queryKey: ["active-users"],
    queryFn: async () => {
      return await getActiveUsers();
    },
    enabled: enabled ?? true,
  });
}

export function useGetSites(enabled: boolean) {
  return useQuery({
    queryKey: ["sites"],
    queryFn: async () => {
      return await getSites();
    },
    enabled: enabled ?? true,
  });
}

export function useGetSchedules(page: number, enabled: boolean) {
  return useQuery({
    queryKey: ["schedules", page],
    queryFn: async () => {
      return await getSchedules(page);
    },
    enabled: enabled ?? true,
  });
}

export function useGetTemplates(enabled: boolean) {
  return useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      return await getTemplates();
    },
    enabled: enabled ?? true,
  });
}
