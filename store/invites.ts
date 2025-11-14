import { Invite } from "@/app/dashboard/settings/components/user-management";
import { create } from "zustand";

interface InvitesStore {
  invites: Invite[];
  setInvites: (invites: Invite[]) => void;
  addInvite: (invite: Invite) => void;
  updateInviteRole: (userId: string, role: Invite["role"]) => void;
  removeUser: (userId: string) => void;
  revokeInvite: (inviteId: string) => void;
  resendInvite: (inviteId: string, updatedInvite: Invite) => void;
}

export const useInvitesStore = create<InvitesStore>()((set) => ({
  invites: [],
  setInvites: (invites) => set({ invites }),
  addInvite: (invite) =>
    set((state) => ({ invites: [invite, ...state.invites] })),
  updateInviteRole: (userId, role) =>
    set((state) => ({
      invites: state.invites.map((invite) =>
        invite.user_id === userId ? { ...invite, role } : invite
      ),
    })),
  removeUser: (userId) =>
    set((state) => ({
      invites: state.invites.filter(
        (invite) => invite.user_id !== userId && invite.id !== userId
      ),
    })),
  revokeInvite: (inviteId) =>
    set((state) => ({
      invites: state.invites.map((invite) =>
        invite.id === inviteId ? { ...invite, revoked: true } : invite
      ),
    })),
  resendInvite: (inviteId, updatedInvite) =>
    set((state) => ({
      invites: state.invites.map((invite) =>
        invite.id === inviteId ? updatedInvite : invite
      ),
    })),
}));
