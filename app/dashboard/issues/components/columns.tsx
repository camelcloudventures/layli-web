'use client'
import { Issue } from '@/types/types'
import { ColumnDef } from '@tanstack/react-table'
import { formatDate } from '@/lib/utils'
import { IssueActions } from './issue-actions'
import { Badge } from '@/components/ui/badge'

function capitalize(str: string) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function getPriorityBadgeColor(priority: string) {
  switch (priority) {
    case 'high':
      return 'bg-orange-100 text-orange-800 hover:bg-orange-100/80'
    case 'critical':
      return 'bg-red-100 text-red-800 hover:bg-red-100/80'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80'
    case 'low':
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100/80'
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100/80'
  }
}

function getStatusBadgeColor(status: string) {
  switch (status) {
    case 'in-progress':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80'
    case 'open':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-100/80'
    case 'resolved':
      return 'bg-green-100 text-green-800 hover:bg-green-100/80'
    case 'closed':
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100/80'
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100/80'
  }
}

export const columns: ColumnDef<Issue>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => (
      <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100/80">
        {capitalize(row.original.category)}
      </Badge>
    ),
  },
  {
    accessorKey: 'priority',
    header: 'Priority',
    cell: ({ row }) => (
      <Badge className={getPriorityBadgeColor(row.original.priority)}>
        {capitalize(row.original.priority)}
      </Badge>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge className={getStatusBadgeColor(row.original.status)}>
        {capitalize(row.original.status)}
      </Badge>
    ),
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    cell: ({ row }) => {
      return <span>{formatDate(row.original.created_at)}</span>
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <IssueActions issue={row.original} />,
  },
]
