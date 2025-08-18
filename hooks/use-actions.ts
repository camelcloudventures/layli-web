import { useGetActions } from "@/app/dashboard/actions/actions/query";
import { useActionsStore } from "@/store/actions";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

export function useActions() {
  const { actions, setActions } = useActionsStore(
    useShallow((state) => ({
      actions: state.actions,
      setActions: state.setActions,
    }))
  );
  const { data: fetchedActions, isLoading } = useGetActions(
    !actions || actions.length === 0
  );

  useEffect(() => {
    if (fetchedActions?.data && actions.length === 0) {
      setActions(fetchedActions.data);
    }
  }, [fetchedActions, setActions, actions]);

  return { actions, setActions, isLoading };
}
