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
import { Loader2, MoreHorizontal, UserPlus } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

type UserRole = 'admin' | 'auditor' | 'supervisor'

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: 'active' | 'invited' | 'inactive'
}

export function UserManagement() {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'auditor' as UserRole,
  })

  // Mock users data
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Demo User',
      email: 'demo@example.com',
      role: 'admin',
      status: 'active',
    },
    {
      id: '2',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'auditor',
      status: 'active',
    },
    {
      id: '3',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'supervisor',
      status: 'active',
    },
    {
      id: '4',
      name: 'Pending User',
      email: 'pending@example.com',
      role: 'auditor',
      status: 'invited',
    },
  ])

  const handleInviteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setInviteForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (userId: string, role: UserRole) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === userId ? { ...user, role } : user)),
    )

    toast.success('User role has been updated successfully.')
  }

  const handleStatusChange = (
    userId: string,
    status: 'active' | 'inactive',
  ) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === userId ? { ...user, status } : user)),
    )

    toast.success(
      `User has been ${
        status === 'active' ? 'activated' : 'deactivated'
      } successfully.`,
    )
  }

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Add new invited user to the list
      const newUser: User = {
        id: Date.now().toString(),
        name: inviteForm.email.split('@')[0],
        email: inviteForm.email,
        role: inviteForm.role,
        status: 'invited',
      }

      setUsers((prev) => [...prev, newUser])

      toast.success(`An invitation has been sent to ${inviteForm.email}.`)

      // Reset form and close dialog
      setInviteForm({ email: '', role: 'auditor' })
      setIsInviteDialogOpen(false)
    } catch (error) {
      console.error(error)
      toast.error('Failed to send invitation. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 hover:bg-red-100/80'
      case 'supervisor':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100/80'
      case 'auditor':
        return 'bg-green-100 text-green-800 hover:bg-green-100/80'
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
            <form onSubmit={handleInviteSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={inviteForm.email}
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
                <Button type="submit" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Send Invitation
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
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
                    className={getStatusBadgeColor(user.status)}
                  >
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
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
                        onClick={() => handleRoleChange(user.id, 'admin')}
                        disabled={user.role === 'admin'}
                      >
                        Set as Admin
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleRoleChange(user.id, 'supervisor')}
                        disabled={user.role === 'supervisor'}
                      >
                        Set as Supervisor
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleRoleChange(user.id, 'auditor')}
                        disabled={user.role === 'auditor'}
                      >
                        Set as Auditor
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {user.status === 'active' ? (
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusChange(user.id, 'inactive')
                          }
                          className="text-red-600"
                        >
                          Deactivate User
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(user.id, 'active')}
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
