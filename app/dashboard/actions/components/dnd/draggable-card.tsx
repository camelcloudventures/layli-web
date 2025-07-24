'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ActionCard } from '../action-card'
import { Action } from '@/lib/types'

interface DraggableCardProps {
  action: Action
  onEdit: (action: Action) => void
}

export function DraggableCard({ action, onEdit }: DraggableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: action.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <ActionCard action={action} onEdit={onEdit} />
    </div>
  )
}
