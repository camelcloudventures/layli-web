import { useGetInspections } from "@/app/dashboard/inspections/actions/query";
import { useInspectionStore } from "@/store/inspections";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

export function useInspections() {
  const { inspections, success, error, setInspections, setSuccess, setError } =
    useInspectionStore(
      useShallow((state) => ({
        inspections: state.inspections,
        success: state.success,
        error: state.error,
        setInspections: state.setInspections,
        setSuccess: state.setSuccess,
        setError: state.setError,
      }))
    );

  const { data: inspectionsData, isLoading } = useGetInspections(
    !inspections || inspections.length === 0
  );

  useEffect(() => {
    if (inspectionsData?.data && inspections.length === 0) {
      setInspections(inspectionsData.data);
      setSuccess(inspectionsData.success!);
      setError(inspectionsData.error!);
    }
  }, [inspectionsData, setInspections, inspections]);

  return { inspections, isLoading, success, error };
}
