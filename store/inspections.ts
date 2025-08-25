import { InspectionDashboardType } from "@/app/dashboard/(home)/actions/types";
import { create } from "zustand";

interface InspectionsStore {
  inspections: InspectionDashboardType[];
  setInspections: (
    inspections:
      | InspectionDashboardType[]
      | ((prev: InspectionDashboardType[]) => InspectionDashboardType[])
  ) => void;
  clearInspections: () => void;
}

export const useInspectionStore = create<InspectionsStore>()((set) => ({
  inspections: [],
  setInspections: (inspections) =>
    set((state) => ({
      inspections:
        typeof inspections === "function"
          ? inspections(state.inspections)
          : inspections,
    })),
  clearInspections: () => set({ inspections: [] }),
}));
