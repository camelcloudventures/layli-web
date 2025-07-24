'use client'
import { Issue } from '@/lib/types'
import { ColumnDef } from '@tanstack/react-table'
import { formatDate } from '@/lib/utils'
import { IssueActions } from './issue-actions'
import Chip from '@/components/custom/chip'
import { Category, Priority, Status } from '@/lib/types'

export const createColumns = (
  assignees: Array<{
    id: string
    full_name: string
    email: string
    role: string
  }>,
): ColumnDef<Issue>[] => [
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => (
      <Chip type="category" value={row.original.category as Category} />
    ),
  },
  {
    accessorKey: 'priority',
    header: 'Priority',
    cell: ({ row }) => (
      <Chip type="priority" value={row.original.priority as Priority} />
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Chip type="status" value={row.original.status as Status} />
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
    cell: ({ row }) => (
      <IssueActions issue={row.original} assignees={assignees} />
    ),
  },
]
