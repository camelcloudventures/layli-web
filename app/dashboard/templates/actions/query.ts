import { useQuery } from "@tanstack/react-query";
import { getTemplates } from "./actions";

export function useGetAuditTemplates(pageNumber: number, enabled: boolean) {
  return useQuery({
    queryKey: ["audit-templates", pageNumber],
    queryFn: async () => {
      return await getTemplates(pageNumber);
    },
    enabled: enabled ?? true,
  });
}
