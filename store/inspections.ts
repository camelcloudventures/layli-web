import { InspectionDashboardType } from "@/app/dashboard/(home)/actions/types";
import { create } from "zustand";

interface InspectionsStore {
  inspections: InspectionDashboardType[];
  success: boolean;
  error?: string | null;
  addInspections: (inspections: InspectionDashboardType[]) => void;
  setInspections: (inspections: InspectionDashboardType[]) => void;
  setSuccess: (success: boolean) => void;
  setError: (message: string) => void;
}

export const useInspectionStore = create<InspectionsStore>()((set) => ({
  inspections: [],
  success: false,
  error: null,
  addInspections: (inspections) =>
    set((state) => ({
      inspections: [...state.inspections, ...inspections],
    })),
  setInspections: (inspections) => set({ inspections }),
  setSuccess: (success) => set({ success }),
  setError: (message) => set({ error: message }),
}));
