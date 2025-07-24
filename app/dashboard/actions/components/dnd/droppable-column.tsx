'use client'

import { useDroppable } from '@dnd-kit/core'
import { Action } from '@/lib/types'
import { DraggableCard } from './draggable-card'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

interface DroppableColumnProps {
  id: string
  title: string
  count: number
  actions: Action[]
  onEdit: (action: Action) => void
}

export function DroppableColumn({
  id,
  title,
  count,
  actions,
  onEdit,
}: DroppableColumnProps) {
  const { setNodeRef } = useDroppable({
    id,
  })

  return (
    <div ref={setNodeRef} className="w-1/3 rounded-lg bg-gray-50 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold capitalize">{title}</h2>
        <span className="text-sm font-bold text-gray-500">{count}</span>
      </div>
      <SortableContext
        id={id}
        items={actions.map((a) => a.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {actions.map((action) => (
            <DraggableCard key={action.id} action={action} onEdit={onEdit} />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}
