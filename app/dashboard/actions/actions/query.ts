import { useQuery } from "@tanstack/react-query";
import { getActions } from "./actions";

export function useGetActions(enabled: boolean) {
  return useQuery({
    queryKey: ["actions"],
    queryFn: async () => {
      return await getActions();
    },
    enabled: enabled ?? true,
  });
}
