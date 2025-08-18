import { User } from "@/lib/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ActiveUsersStore {
  users: User[];
  setActiveUsers: (users: User[]) => void;
}

export const useActiveUsersStore = create<ActiveUsersStore>()(
  persist(
    (set) => ({
      users: [],
      setActiveUsers: (users) => set({ users }),
    }),
    {
      name: "active-users-storage",
    }
  )
);
