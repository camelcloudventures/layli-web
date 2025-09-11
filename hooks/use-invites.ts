import { useGetInvites } from "@/app/dashboard/settings/actions/query";
import { useInvitesStore } from "@/store/invites";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

export function useInvites() {
  const { invites, setInvites } = useInvitesStore(
    useShallow((state) => ({
      invites: state.invites,
      setInvites: state.setInvites,
    }))
  );

  const enabled = !invites || invites.length === 0;

  const { data: fetchedInvites, isLoading } = useGetInvites(enabled);

  useEffect(() => {
    if (fetchedInvites?.data && invites.length === 0) {
      setInvites(fetchedInvites.data);
    }
  }, [fetchedInvites, invites, setInvites]);

  return { invites, isLoading, setInvites };
}
