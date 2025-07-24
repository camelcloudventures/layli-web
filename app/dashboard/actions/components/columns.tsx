'use client'

import { Action, ActionPriority, ActionStatus, Site } from '@/lib/types'
import { ColumnDef } from '@tanstack/react-table'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowUpDown, Hash, Users2, MoreHorizontal } from 'lucide-react'
import { toast } from 'sonner'
import { deleteAction } from '../actions/actions'
import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { MarkAsDoneDialog } from './mark-as-done-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const getPriorityBadgeColor = (priority: ActionPriority) => {
  switch (priority) {
    case ActionPriority.HIGH:
      return 'bg-red-100 text-red-800 hover:bg-red-100/80'
    case ActionPriority.MEDIUM:
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80'
    case ActionPriority.LOW:
      return 'bg-green-100 text-green-800 hover:bg-green-100/80'
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100/80'
  }
}

const getStatusBadgeColor = (status: ActionStatus) => {
  switch (status) {
    case ActionStatus.IN_PROGRESS:
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80'
    case ActionStatus.TODO:
      return 'bg-blue-100 text-blue-800 hover:bg-blue-100/80'
    case ActionStatus.COMPLETED:
      return 'bg-green-100 text-green-800 hover:bg-green-100/80'
    case ActionStatus.DONE:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100/80'
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100/80'
  }
}

// Separate component for the actions cell to fix useState issue
function ActionCell({
  action,
  sites,
  onEdit,
}: {
  action: Action
  sites: Site[]
  onEdit?: (action: Action) => void
}) {
  const [open, setOpen] = useState(false)
  const isDone = action.status === ActionStatus.DONE

  // Reset dialog state when action changes
  useEffect(() => {
    setOpen(false)
  }, [action.id])

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark as Done</DialogTitle>
          </DialogHeader>
          <MarkAsDoneDialog
            key={action.id} // Force re-render when action changes
            action={action}
            sites={sites}
            onComplete={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {onEdit && (
            <DropdownMenuItem onClick={() => onEdit(action)}>
              Edit
            </DropdownMenuItem>
          )}
          {!isDone && (
            <DropdownMenuItem onClick={() => setOpen(true)}>
              Mark as Done
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className="text-red-500"
            onClick={() => {
              toast.promise(deleteAction(action.id), {
                loading: 'Deleting action...',
                success: 'Action deleted successfully',
                error: 'Failed to delete action',
              })
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export const columns = (
  sites: Site[],
  onEdit?: (action: Action) => void,
): ColumnDef<Action>[] => [
  {
    accessorKey: 'code',
    header: 'Action Code',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Hash className="h-4 w-4" />
        <span>{row.original.code}</span>
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge className={getStatusBadgeColor(row.original.status)}>
        {row.original.status.replace('_', ' ')}
      </Badge>
    ),
  },
  {
    accessorKey: 'priority',
    header: 'Priority',
    cell: ({ row }) => (
      <Badge className={getPriorityBadgeColor(row.original.priority)}>
        {row.original.priority}
      </Badge>
    ),
  },
  {
    accessorKey: 'due_at',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Due Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <span>{formatDate(row.original.due_at)}</span>
    },
  },
  {
    accessorKey: 'assignees',
    header: 'Assignee',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Users2 className="h-4 w-4" />
        <span>{row.original.assignees.length}</span>
      </div>
    ),
  },
  {
    accessorKey: 'site',
    header: 'Site',
    cell: ({ row }) => <span>{row.original.site?.name}</span>,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <ActionCell action={row.original} sites={sites} onEdit={onEdit} />
    ),
  },
]
