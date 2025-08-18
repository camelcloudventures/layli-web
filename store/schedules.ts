import { Schedule } from "@/lib/types/schedule-types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SchedulesStore {
  schedules: Schedule[];
  setSchedules: (schedules: Schedule[]) => void;
}

export const useSchedulesStore = create<SchedulesStore>()(
  persist(
    (set) => ({
      schedules: [],
      setSchedules: (schedules) => set({ schedules }),
    }),
    {
      name: "schedules-storage",
    }
  )
);
