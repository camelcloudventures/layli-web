'use client'

import { Action, ActionPriority, ActionStatus } from '@/lib/types'
import { ColumnDef } from '@tanstack/react-table'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowUpDown, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { deleteAction } from '../actions/actions'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

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
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100/80'
  }
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
}

export const columns: ColumnDef<Action>[] = [
  {
    accessorKey: 'code',
    header: 'Code',
  },
  {
    accessorKey: 'title',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
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
        <Avatar className="h-6 w-6">
          <AvatarFallback>
            {getInitials(row.original.assignees[0]?.full_name ?? 'N/A')}
          </AvatarFallback>
        </Avatar>
        <span>{row.original.assignees[0]?.full_name}</span>
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
    cell: ({ row }) => (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          toast.promise(deleteAction(row.original.id), {
            loading: 'Deleting action...',
            success: 'Action deleted successfully',
            error: 'Failed to delete action',
          })
        }}
      >
        <Trash2 className="h-4 w-4 text-red-500" />
      </Button>
    ),
  },
]
