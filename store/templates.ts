import { AuditTemplate } from "@/lib/types/audit-types";
import { create } from "zustand";

interface TemplatesStore {
  templates: AuditTemplate[];
  setTemplates: (templates: AuditTemplate[]) => void;
  reset: () => void;
}

export const useTemplatesStore = create<TemplatesStore>()((set) => ({
  templates: [],
  setTemplates: (templates) => set({ templates }),
  reset: () => set({ templates: [] }),
}));
