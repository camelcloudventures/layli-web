'use client'

import type React from 'react'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal, UserPlus } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { inviteUser } from '@/app/dashboard/settings/actions/actions'
import { useAuth } from '@/lib/context/auth-provider'
import SubmitBtn from '@/components/custom/submit-btn'

type UserRole = 'admin' | 'auditor' | 'supervisor'

interface Invite {
  id: string
  email: string
  role: UserRole
  token: string
  invited_by: string
  created_at: string
  used: boolean
}

interface InvitesResponse {
  data: Invite[]
}

export function UserManagement({ invites }: { invites: InvitesResponse }) {
  const { user } = useAuth()

  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [inviteForm, setInviteForm] = useState({
    role: 'auditor' as UserRole,
  })

  console.log('invites', invites)

  const handleInviteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setInviteForm((prev) => ({ ...prev, [name]: value }))
  }

  // const handleRoleChange = (userId: string, role: UserRole) => {
  //   setUsers((prev) =>
  //     prev.map((user) => (user.id === userId ? { ...user, role } : user)),
  //   )

  //   toast.success('User role has been updated successfully.')
  // }

  // const handleStatusChange = (
  //   userId: string,
  //   status: 'active' | 'inactive',
  // ) => {
  //   setUsers((prev) =>
  //     prev.map((user) => (user.id === userId ? { ...user, status } : user)),
  //   )

  //   toast.success(
  //     `User has been ${
  //       status === 'active' ? 'activated' : 'deactivated'
  //     } successfully.`,
  //   )
  // }

  const handleInviteSubmit = async (formData: FormData) => {
    setIsLoading(true)
    const res = await inviteUser(formData, inviteForm.role, user?.id || '')
    console.log('res', res)
    setIsLoading(false)
    if (res.error) {
      toast.error(res.error || 'Invitation failed, please try again.')
      return
    }
    toast.success(res.success)
    setInviteForm({ role: inviteForm.role })
    setIsInviteDialogOpen(false)
  }

  const getRoleBadgeColor = (role: UserRole) => {
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

  const getStatusBadgeColor = (status: string) => {
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

  const getUserStatus = (used: boolean) => {
    return used ? 'active' : 'invited'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Users</h3>
        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsInviteDialogOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite a new user</DialogTitle>
              <DialogDescription>
                Send an invitation to join your organization.
              </DialogDescription>
            </DialogHeader>
            <form action={handleInviteSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    onChange={handleInviteChange}
                    placeholder="user@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={inviteForm.role}
                    onValueChange={(value) =>
                      setInviteForm((prev) => ({
                        ...prev,
                        role: value as UserRole,
                      }))
                    }
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="supervisor">Supervisor</SelectItem>
                      <SelectItem value="auditor">Auditor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <SubmitBtn
                  label={isLoading ? 'Sending...' : 'Send Invitation'}
                  variant="default"
                  className=""
                  isDisabled={isLoading}
                />
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invites?.data?.map((user: Invite) => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={getRoleBadgeColor(user.role)}
                  >
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={getStatusBadgeColor(getUserStatus(user.used))}
                  >
                    {getUserStatus(user.used).charAt(0).toUpperCase() +
                      getUserStatus(user.used).slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        // onClick={() => handleRoleChange(user.id, 'admin')}
                        disabled={user?.role === 'admin'}
                      >
                        Set as Admin
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        // onClick={() => handleRoleChange(user.id, 'supervisor')}
                        disabled={user?.role === 'supervisor'}
                      >
                        Set as Supervisor
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        // onClick={() => handleRoleChange(user.id, 'auditor')}
                        disabled={user?.role === 'auditor'}
                      >
                        Set as Auditor
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {getUserStatus(user.used) === 'active' ? (
                        <DropdownMenuItem
                          // onClick={() =>
                          //   handleStatusChange(user.id, 'inactive')
                          // }
                          className="text-red-600"
                        >
                          Deactivate User
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          // onClick={() => handleStatusChange(user.id, 'active')}
                          className="text-green-600"
                        >
                          Activate User
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
