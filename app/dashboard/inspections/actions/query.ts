import { useQuery } from "@tanstack/react-query";
import { getAllInspections } from "./actions";

export function useGetInspections(enabled: boolean) {
  return useQuery({
    queryKey: ["inspections"],
    queryFn: async () => {
      return await getAllInspections();
    },
    enabled: enabled ?? true,
  });
}
