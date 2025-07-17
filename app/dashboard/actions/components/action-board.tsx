'use client'

import { useMemo } from 'react'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'

import { cn } from '@/lib/utils'
import { ActionCard } from './action-card'
import type { Action, ActionStatus } from '@/lib/types/action-types'

interface ActionColumnProps {
  id: ActionStatus
  title: string
  actions: Action[]
  onEditAction: (action: Action) => void
}

function ActionColumn({ id, title, actions, onEditAction }: ActionColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'bg-muted/50 rounded-lg p-4 min-h-[500px] w-full transition-all',
        isOver && 'ring-2 ring-primary ring-inset bg-muted',
      )}
    >
      <h3 className="font-medium mb-4 flex items-center justify-between">
        <span>{title}</span>
        <span className="bg-background text-muted-foreground text-xs px-2 py-1 rounded-full">
          {actions.length}
        </span>
      </h3>
      <SortableContext
        items={actions.map((action) => action.id)}
        strategy={rectSortingStrategy}
      >
        <div className="space-y-3">
          {actions.map((action) => (
            <ActionCard
              key={action.id}
              action={action}
              onClick={onEditAction}
            />
          ))}
          {actions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm border border-dashed rounded-md">
              No actions
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  )
}

interface ActionBoardProps {
  actions: Action[]
  onEditAction: (action: Action) => void
}

export function ActionBoard({ actions, onEditAction }: ActionBoardProps) {
  const todoActions = useMemo(
    () => actions.filter((action) => action.status === 'todo'),
    [actions],
  )

  const inProgressActions = useMemo(
    () => actions.filter((action) => action.status === 'in_progress'),
    [actions],
  )

  const completedActions = useMemo(
    () => actions.filter((action) => action.status === 'completed'),
    [actions],
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <ActionColumn
        id="todo"
        title="To Do"
        actions={todoActions}
        onEditAction={onEditAction}
      />
      <ActionColumn
        id="in_progress"
        title="In Progress"
        actions={inProgressActions}
        onEditAction={onEditAction}
      />
      <ActionColumn
        id="completed"
        title="Completed"
        actions={completedActions}
        onEditAction={onEditAction}
      />
    </div>
  )
}
