import { useGetInspections } from "@/app/dashboard/inspections/actions/query";
import { useInspectionStore } from "@/store/inspections";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

export function useInspections() {
  const { inspections, setInspections } = useInspectionStore(
    useShallow((state) => ({
      inspections: state.inspections,
      setInspections: state.setInspections,
    }))
  );

  const { data: inspectionsData, isLoading } = useGetInspections(
    !inspections || inspections.length === 0
  );

  useEffect(() => {
    if (inspectionsData?.data && inspections.length === 0) {
      setInspections(inspectionsData.data);
    }
  }, [inspectionsData, setInspections, inspections]);

  return { inspections, isLoading };
}
