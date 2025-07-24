'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { format } from 'date-fns'
import { Calendar, GripVertical } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import type { Action } from '@/lib/types'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface ActionCardProps {
  action: Action
  onClick: (action: Action) => void
  isDraggable?: boolean
}

export function ActionCard({
  action,
  onClick,
  isDraggable = true,
}: ActionCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: action.id,
    disabled: !isDraggable,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const assignee = action.assignees[0]

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        'cursor-pointer hover:border-primary/50 transition-colors',
        isDragging ? 'opacity-50 border-primary' : 'opacity-100',
      )}
      onClick={() => onClick(action)}
    >
      <CardContent className="p-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {isDraggable && (
                <button
                  {...attributes}
                  {...listeners}
                  className="touch-none p-1 rounded hover:bg-muted cursor-grab active:cursor-grabbing"
                  aria-label="Drag to reorder"
                  onClick={(e) => e.stopPropagation()}
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
              <span className="text-xs text-muted-foreground">
                {action.code}
              </span>
              <Badge
                variant="outline"
                className={priorityColors[action.priority]}
              >
                {action.priority}
              </Badge>
            </div>
            <h3 className="font-medium text-sm">{action.title}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
              {action.description}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          {format(new Date(action.due_at), 'MMM d, yyyy')}
        </div>
        {assignee && (
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs">
              {assignee.full_name
                ?.split(' ')
                .map((n) => n[0])
                .join('') || 'N/A'}
            </AvatarFallback>
          </Avatar>
        )}
      </CardFooter>
    </Card>
  )
}
