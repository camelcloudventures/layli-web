import { useQuery } from "@tanstack/react-query";
import { getInvites } from "./actions";

export function useGetInvites(enabled: boolean) {
  return useQuery({
    queryKey: ["invites"],
    queryFn: async () => {
      return await getInvites();
    },
    enabled: enabled ?? true,
  });
}
