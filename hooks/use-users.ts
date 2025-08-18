import { useGetActiveUsers } from "@/app/dashboard/schedules/actions/query";
import { useActiveUsersStore } from "@/store/active-users";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

export function useUsers() {
  const { users, setActiveUsers } = useActiveUsersStore(
    useShallow((state) => ({
      users: state.users,
      setActiveUsers: state.setActiveUsers,
    }))
  );

  const enabled = !users || users.length === 0;
  const { data: fetchedUsers, isLoading } = useGetActiveUsers(enabled);

  useEffect(() => {
    if (fetchedUsers?.data && users.length === 0) {
      setActiveUsers(fetchedUsers.data);
    }
  }, [fetchedUsers, users, setActiveUsers]);

  return { users, isLoading };
}
