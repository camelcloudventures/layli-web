'use client'

import { formatDate } from '@/lib/utils'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { RoleActionItem } from './role-action-item'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { updateUserRole } from '../actions/actions'
import { toast } from 'sonner'

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
  user_id: string
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

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

async function handleRoleChange(userId: string, role: string) {
  const res = await updateUserRole(userId, role)
  console.log('res here is', res)

  //@ts-expect-error -0e
  if (res.error) {
    //@ts-expect-error -0e
    toast.error(res.error)
  } else {
    toast.success(`Role updated to ${role} successfully`)
  }
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
        {capitalize(row.original.role)}
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
          {capitalize(status)}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Invited At',
    cell: ({ row }) => {
      return <span>{formatDate(row.original.created_at)}</span>
    },
  },

  // actions
  {
    id: 'actions',
    cell: ({ row }) => {
      const user = row.original
      const isActive = getUserStatus(user.used) === 'active'
      if (isActive) {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="z-10 bg-white" align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <RoleActionItem
                user={user}
                role="admin"
                onChange={handleRoleChange}
              />
              <RoleActionItem
                user={user}
                role="supervisor"
                onChange={handleRoleChange}
              />
              <RoleActionItem
                user={user}
                role="auditor"
                onChange={handleRoleChange}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              aria-disabled="true"
              className="inline-flex opacity-50 cursor-not-allowed"
              tabIndex={0}
            >
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 pointer-events-none"
                tabIndex={-1}
                aria-label="Actions unavailable"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent className="">
            <p className="font-medium">
              Role changes are only available for active users.
            </p>
          </TooltipContent>
        </Tooltip>
      )
    },
  },
]
