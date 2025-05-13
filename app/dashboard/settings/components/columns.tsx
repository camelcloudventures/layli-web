'use client'

import { capsFirstLetter, formatDate } from '@/lib/utils'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal } from 'lucide-react'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Invite = {
  id: string
  email: string
  role: string
  token: string
  invited_by: string
  created_at: string
  used: boolean
}

function getRoleBadgeColor(role: string) {
  switch (role) {
    case 'admin':
      return 'bg-purple-100 text-purple-800 hover:bg-purple-100/80 dark:bg-purple-900/30 dark:text-purple-300'
    case 'supervisor':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-100/80 dark:bg-blue-900/30 dark:text-blue-300'
    case 'auditor':
      return 'bg-orange-100 text-orange-800 hover:bg-orange-100/80 dark:bg-orange-900/30 dark:text-orange-300'
    default:
      return ''
  }
}

function getStatusBadgeColor(status: string) {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'invited':
      return 'bg-yellow-100 text-yellow-800'
    case 'inactive':
      return 'bg-gray-100 text-gray-800'
    default:
      return ''
  }
}

function getUserStatus(used: boolean) {
  return used ? 'active' : 'invited'
}

export const columns: ColumnDef<Invite>[] = [
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => (
      <Badge className={getRoleBadgeColor(row.original.role)}>
        {capsFirstLetter(row.original.role)}
      </Badge>
    ),
  },
  {
    accessorKey: 'used',
    header: 'Status',
    cell: ({ row }) => {
      const status = getUserStatus(row.original.used)
      return (
        <Badge className={getStatusBadgeColor(status)}>
          {capsFirstLetter(status)}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Invited On',
    cell: ({ row }) => {
      return <span>{formatDate(row.original.created_at)}</span>
    },
  },

  // actions
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      //have the three dot icon
      return (
        <span>
          <MoreHorizontal className="h-4 w-4" />
        </span>
      )
    },
  },
]
