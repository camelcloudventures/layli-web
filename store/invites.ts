import { Invite } from "@/app/dashboard/settings/components/user-management";
import { create } from "zustand";

interface InvitesStore {
  invites: Invite[];
  setInvites: (invites: Invite[]) => void;
}

export const useInvitesStore = create<InvitesStore>()((set) => ({
  invites: [],
  setInvites: (invites) => set({ invites }),
}));
