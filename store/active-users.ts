import { User } from "@/lib/types";
import { create } from "zustand";

interface ActiveUsersStore {
  users: User[];
  setActiveUsers: (users: User[]) => void;
}

export const useActiveUsersStore = create<ActiveUsersStore>()((set) => ({
  users: [],
  setActiveUsers: (users) => set({ users }),
}));
