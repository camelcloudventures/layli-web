import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "./actions";

export function useGetNotifications(enabled: boolean) {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      return await getNotifications();
    },
    enabled: enabled ?? true,
  });
}
