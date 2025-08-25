import { useQuery } from "@tanstack/react-query";
import { GET } from "@/app/backend/apiMethods";
import { TemplatesResponse } from "@/lib/types/audit-types";

export function useGetAuditTemplates(enabled: boolean) {
  return useQuery({
    queryKey: ["audit-templates"],
    queryFn: async () => {
      return await GET<TemplatesResponse>(`/audit-template/get`);
    },
    enabled: enabled ?? true,
  });
}
