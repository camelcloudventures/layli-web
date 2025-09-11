import { Schedule } from "@/lib/types/schedule-types";
import { create } from "zustand";

interface SchedulesStore {
  schedules: Schedule[];
  setSchedules: (
    schedules: Schedule[] | ((prev: Schedule[]) => Schedule[])
  ) => void;
  clearSchedules: () => void;
  removeSchedule: (scheduleId: string) => void;
}

export const useSchedulesStore = create<SchedulesStore>()((set) => ({
  schedules: [],
  setSchedules: (schedules) =>
    set((state) => ({
      schedules:
        typeof schedules === "function"
          ? schedules(state.schedules)
          : schedules,
    })),
  clearSchedules: () => set({ schedules: [] }),
  removeSchedule: (scheduleId) =>
    set((state) => ({
      schedules: state.schedules.filter(
        (schedule) => String(schedule.id) !== scheduleId
      ),
    })),
}));
