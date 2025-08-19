import { Schedule } from "@/lib/types/schedule-types";
import { create } from "zustand";

interface SchedulesStore {
  schedules: Schedule[];
  setSchedules: (schedules: Schedule[]) => void;
}

export const useSchedulesStore = create<SchedulesStore>()((set) => ({
  schedules: [],
  setSchedules: (schedules) => set({ schedules }),
}));
