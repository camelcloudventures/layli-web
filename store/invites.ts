import { Invite } from "@/app/dashboard/settings/components/user-management";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface InvitesStore {
  invites: Invite[];
  setInvites: (invites: Invite[]) => void;
}

export const useInvitesStore = create<InvitesStore>()(
  persist(
    (set) => ({
      invites: [],
      setInvites: (invites) => set({ invites }),
    }),
    {
      name: "invites-storage",
    }
  )
);
