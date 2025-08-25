import { useQuery } from "@tanstack/react-query";
import { getSchedules, getSites } from "./actions";
import { GET } from "@/app/backend/apiMethods";
import { ActiveUser } from "@/lib/types";

export function useGetActiveUsers(enabled: boolean) {
  return useQuery({
    queryKey: ["active-users"],
    queryFn: async () => {
      return await GET<ActiveUser>(`/invites/organization/active-users`, [
        "users",
      ]);
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
