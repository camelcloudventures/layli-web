import { useQuery } from "@tanstack/react-query";
import { getIssues } from "./actions";

export function useGetIssues(enabled: boolean) {
  return useQuery({
    queryKey: ["issues"],
    queryFn: async () => {
      return await getIssues();
    },
    enabled: enabled ?? true,
  });
}
