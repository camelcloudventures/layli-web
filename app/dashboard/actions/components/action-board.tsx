'use client'

import { Action, ActionStatus } from '@/lib/types'
import { DroppableColumn } from './dnd/droppable-column'

interface ActionBoardProps {
  actions: Action[]
  onEdit: (action: Action) => void
}

export function ActionBoard({ actions, onEdit }: ActionBoardProps) {
  const columns = {
    [ActionStatus.TODO]: actions.filter(
      (action) => action.status === ActionStatus.TODO,
    ),
    [ActionStatus.IN_PROGRESS]: actions.filter(
      (action) => action.status === ActionStatus.IN_PROGRESS,
    ),
    [ActionStatus.COMPLETED]: actions.filter(
      (action) => action.status === ActionStatus.COMPLETED,
    ),
  }

  return (
    <div className="flex gap-4">
      {Object.entries(columns).map(([status, actions]) => (
        <DroppableColumn
          key={status}
          id={status}
          title={`${status.replace('_', ' ')}`}
          count={actions.length}
          actions={actions}
          onEdit={onEdit}
        />
      ))}
    </div>
  )
}
