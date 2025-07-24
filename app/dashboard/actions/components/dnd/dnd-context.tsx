'use client'

import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { Action, ActionStatus } from '@/lib/types'

interface DndProviderProps {
  children: React.ReactNode
  setActions: React.Dispatch<React.SetStateAction<Action[]>>
}

export function DndProvider({ children, setActions }: DndProviderProps) {
  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event

    if (over) {
      const newStatus = over.id as ActionStatus
      const actionId = active.id as string

      setActions((prevActions) =>
        prevActions.map((action) =>
          action.id === actionId ? { ...action, status: newStatus } : action,
        ),
      )
    }
  }

  return <DndContext onDragEnd={handleDragEnd}>{children}</DndContext>
}
