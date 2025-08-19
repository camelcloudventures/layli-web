import { useGetSchedules } from "@/app/dashboard/schedules/actions/query";
import { useSchedulesStore } from "@/store/schedules";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

export function useSchedules() {
  const { schedules, setSchedules } = useSchedulesStore(
    useShallow((state) => ({
      schedules: state.schedules,
      setSchedules: state.setSchedules,
    }))
  );

  console.log("schd", schedules);
  const enabled = !schedules || schedules.length === 0;
  const { data: fetchedSchedules, isLoading } = useGetSchedules(1, enabled);

  useEffect(() => {
    if (fetchedSchedules?.data && schedules.length === 0) {
      setSchedules(fetchedSchedules.data);
    }
  }, [fetchedSchedules, schedules, setSchedules]);

  return { schedules, isLoading };
}
