import { InspectionDashboardType } from "@/app/dashboard/(home)/actions/types";
import { Inspection } from "@/lib/types/inspection-types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface InspectionsStore {
  inspections: InspectionDashboardType[];
  success: boolean;
  error?: string | null;
  addInspections: (inspections: InspectionDashboardType[]) => void;
  setInspections: (inspections: InspectionDashboardType[]) => void;
  setSuccess: (success: boolean) => void;
  setError: (message: string) => void;
}

export const useInspectionStore = create<InspectionsStore>()(
  persist(
    (set) => ({
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
    }),
    { name: "inspections-storage" }
  )
);
