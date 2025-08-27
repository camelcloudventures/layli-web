"use client";

import { useMemo } from "react";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";

import { cn } from "@/lib/utils";
import { ActionCard } from "./action-card";
import { Action, ActionStatus } from "@/lib/types";
import { CardLoadingSkeleton } from "./card-loading-skeleton";

interface ActionColumnProps {
  id: ActionStatus;
  title: string;
  actions: Action[];
  onEditAction: (action: Action) => void;
  droppable?: boolean;
  isLoading: boolean;
}

function ActionColumn({
  id,
  title,
  actions,
  onEditAction,
  droppable = true,
  isLoading,
}: ActionColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  const content = (
    <div className="space-y-3">
      {isLoading ? (
        <CardLoadingSkeleton />
      ) : (
        actions.map((action) => (
          <ActionCard
            key={action.id}
            action={action}
            onClick={onEditAction}
            isDraggable={droppable}
          />
        ))
      )}
      {actions.length === 0 && (
        <div className="text-muted-foreground text-center">
          No actions found
        </div>
      )}
    </div>
  );

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "bg-muted/50 rounded-lg p-4 min-h-[500px] w-full transition-all",
        isOver && droppable && "ring-2 ring-primary ring-inset bg-muted",
        !droppable && "opacity-70 pointer-events-none"
      )}
    >
      <h3 className="font-medium mb-4 flex items-center justify-between">
        <span>{title}</span>
        <span className="bg-background text-muted-foreground text-xs px-2 py-1 rounded-full">
          {actions.length}
        </span>
      </h3>
      {droppable ? (
        <SortableContext
          items={actions.map((action) => action.id)}
          strategy={rectSortingStrategy}
        >
          {content}
        </SortableContext>
      ) : (
        content
      )}
    </div>
  );
}

interface ActionBoardProps {
  actions: Action[];
  isLoading: boolean;
  onEdit: (action: Action) => void;
}

export function ActionBoard({ actions, isLoading, onEdit }: ActionBoardProps) {
  const todoActions = useMemo(
    () => actions.filter((a) => a.status === ActionStatus.TODO),
    [actions]
  );
  const inProgressActions = useMemo(
    () => actions.filter((a) => a.status === ActionStatus.IN_PROGRESS),
    [actions]
  );
  const completedActions = useMemo(
    () => actions.filter((a) => a.status === ActionStatus.COMPLETED),
    [actions]
  );
  const doneActions = useMemo(
    () => actions.filter((a) => a.status === ActionStatus.DONE),
    [actions]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <ActionColumn
        id={ActionStatus.TODO}
        title="To Do"
        actions={todoActions}
        onEditAction={onEdit}
        isLoading={isLoading}
      />
      <ActionColumn
        id={ActionStatus.IN_PROGRESS}
        title="In Progress"
        actions={inProgressActions}
        onEditAction={onEdit}
        isLoading={isLoading}
      />
      <ActionColumn
        id={ActionStatus.COMPLETED}
        title="Completed"
        actions={completedActions}
        onEditAction={onEdit}
        isLoading={isLoading}
      />
      <ActionColumn
        id={ActionStatus.DONE}
        title="Done"
        actions={doneActions}
        onEditAction={() => {}}
        droppable={false}
        isLoading={isLoading}
      />
    </div>
  );
}
