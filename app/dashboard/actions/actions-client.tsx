"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useActions } from "@/hooks/use-actions";
import { useSites } from "@/hooks/use-sites";
import { useUsers } from "@/hooks/use-users";
import { Action, ActionStatus } from "@/lib/types";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { LayoutGrid, ListIcon, PlusCircle } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { updateAction } from "./actions/actions";
import { ActionBoard } from "./components/action-board";
import { ActionCard } from "./components/action-card";
import { ActionList } from "./components/action-list";
import { columns } from "./components/columns";
import { CreateActionForm } from "./components/create-action-form";
import { EditActionForm } from "./components/edit-action-form";

type View = "board" | "list";
type UpdateActionResponse = { success?: string; error?: string };

export default function ActionsClient() {
  const [viewMode, setViewMode] = useState<View>("board");
  const [isCreateActionDialogOpen, setIsCreateActionDialogOpen] =
    useState(false);
  const [isEditActionDialogOpen, setIsEditActionDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [activeAction, setActiveAction] = useState<Action | null>(null);

  const { actions, setActions } = useActions();

  const { users } = useUsers();

  const { sites } = useSites();

  const handleCreateAction = () => {
    setIsCreateActionDialogOpen(true);
  };

  const handleEditAction = useCallback((action: Action) => {
    setSelectedAction(action);
    setIsEditActionDialogOpen(true);
  }, []);

  // Memoize columns to prevent recreation on every render
  const memoizedColumns = useMemo(
    () => columns(sites, handleEditAction),
    [sites, handleEditAction]
  );

  const statusMap: Record<string, ActionStatus> = {
    [ActionStatus.TODO]: ActionStatus.TODO,
    [ActionStatus.IN_PROGRESS]: ActionStatus.IN_PROGRESS,
    [ActionStatus.COMPLETED]: ActionStatus.COMPLETED,
    [ActionStatus.DONE]: ActionStatus.DONE,
  };

  const getStatusFromOverId = (overId: string): ActionStatus | undefined => {
    // If overId matches a status, return it
    if (statusMap[overId]) return statusMap[overId];
    // Otherwise, try to find the action and return its status
    const targetAction = actions.find((a) => a.id === overId);
    return targetAction?.status;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const draggedAction = actions.find((action) => action.id === active.id);
    setActiveAction(draggedAction || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveAction(null);
    const { active, over } = event;
    if (!over || !active) return;
    if (active.id === over.id) return;
    const action = actions.find((a) => a.id === active.id);
    if (!action) return;

    // Get the new status
    const newStatus = getStatusFromOverId(String(over.id));
    console.log("over.id:", over.id, "type:", typeof over.id);
    console.log("newStatus", newStatus);
    if (!newStatus) {
      toast.error("Invalid status");
      return;
    }

    // Store original state for rollback
    const originalActions = [...actions];

    // Optimistic UI update
    setActions(
      actions.map((a) => (a.id === action.id ? { ...a, status: newStatus } : a))
    );

    // Send API request in background
    try {
      console.log("Moving action", action.id, "to status", newStatus);
      const res = (await updateAction(action.id, {
        status: newStatus,
      })) as UpdateActionResponse;
      console.log("Update response: is ", res);

      if (res && res.success) {
        toast.success(res.success);
      } else {
        // API failed - rollback to original state
        setActions(originalActions);
        //Put it back incase of an error
        setActions(
          actions.map((a) =>
            a.id === action.id ? { ...a, status: newStatus } : a
          )
        );
        toast.error(res?.error || "Failed to update action");
      }
    } catch (error) {
      // Network error or other exception - rollback to original state
      console.error("Update action error:", error);
      setActions(originalActions);
      toast.error("Failed to update action - please try again");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Actions</h1>
          <p className="text-muted-foreground">
            Manage action items and follow-ups
          </p>
        </div>
        <Button onClick={handleCreateAction}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Action
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <Tabs
          defaultValue="board"
          value={viewMode}
          onValueChange={(value) => setViewMode(value as "board" | "list")}
          className="w-full"
        >
          <TabsList className="grid w-[200px] grid-cols-2">
            <TabsTrigger value="board">
              <LayoutGrid className="mr-2 h-4 w-4" />
              Board
            </TabsTrigger>
            <TabsTrigger value="list">
              <ListIcon className="mr-2 h-4 w-4" />
              List
            </TabsTrigger>
          </TabsList>

          <TabsContent value="board" className="mt-6">
            <DndContext
              collisionDetection={closestCorners}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <ActionBoard actions={actions} onEdit={handleEditAction} />
              <DragOverlay>
                {activeAction ? (
                  <div className="w-[calc(100%-2rem)] max-w-sm">
                    <ActionCard
                      action={activeAction}
                      onClick={() => {}}
                      isDraggable={false}
                    />
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          </TabsContent>

          <TabsContent value="list" className="mt-6">
            <ActionList actions={actions} columns={memoizedColumns} />
          </TabsContent>
        </Tabs>
      </div>
      <Dialog
        open={isCreateActionDialogOpen}
        onOpenChange={setIsCreateActionDialogOpen}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px] p-6 overflow-hidden hover:overflow-y-auto scrollbar-none">
          <DialogHeader>
            <DialogTitle>Create Action</DialogTitle>
            <DialogDescription>
              Create a new action to assign and track.
            </DialogDescription>
          </DialogHeader>
          <CreateActionForm
            users={users}
            sites={sites}
            onCancel={() => setIsCreateActionDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      <Dialog
        open={isEditActionDialogOpen}
        onOpenChange={(open) => {
          setIsEditActionDialogOpen(open);
          if (!open) {
            setSelectedAction(null); // Clear selected action when dialog closes
          }
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px] overflow-hidden hover:overflow-y-auto scrollbar-none p-6">
          <DialogHeader>
            <DialogTitle>Edit Action</DialogTitle>
            <DialogDescription>
              Edit the details of this action.
            </DialogDescription>
          </DialogHeader>
          {selectedAction && (
            <EditActionForm
              users={users}
              sites={sites}
              action={selectedAction}
              onCancel={() => {
                setIsEditActionDialogOpen(false);
                setSelectedAction(null); // Also clear when cancel is clicked
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
