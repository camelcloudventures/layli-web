'use client'

import { useState, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import type { Question, Response } from '@/lib/types/inspection-types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'

interface User {
  id: string
  email: string
  role: string
  created_at: string
  invited_by: string
  organization_id: string
  token: string
  used: boolean
  user: {
    id: string
    full_name: string
    email: string
    role: string
    created_at: string
    user_id: string
  }
}

interface PersonFieldProps {
  question: Question
  response?: Response
  onResponse: (value: string | string[]) => void
  users?: User[]
  isDisabled?: boolean
}

export function PersonField({
  question,
  response,
  onResponse,
  users = [],
  isDisabled,
}: PersonFieldProps) {
  // Debug logging
  console.log('PersonField render:', {
    users,
    usersLength: users.length,
    question,
  })

  // Local state to track selected users for immediate UI updates
  const [localSelectedUsers, setLocalSelectedUsers] = useState<string[]>(
    response?.selected_options?.map(String) || [],
  )

  // Initialize local state from response
  useEffect(() => {
    setLocalSelectedUsers(response?.selected_options?.map(String) || [])
  }, [response?.selected_options])

  const handleUserSelect = (userId: string) => {
    if (isDisabled) return

    const newSelected = localSelectedUsers.includes(userId)
      ? localSelectedUsers.filter((id) => id !== userId)
      : [...localSelectedUsers, userId]

    setLocalSelectedUsers(newSelected)
    onResponse(newSelected)
  }

  const handleRemoveUser = (userId: string) => {
    if (isDisabled) return

    const newSelected = localSelectedUsers.filter((id) => id !== userId)
    setLocalSelectedUsers(newSelected)
    onResponse(newSelected)
  }

  // Debug logging for SelectContent
  console.log('Rendering SelectContent with users:', users)
  console.log('localSelectedUsers:', localSelectedUsers)
  console.log(
    'users array IDs:',
    users.map((u) => u),
  )

  return (
    <div className="space-y-2">
      <Label>{question.text}</Label>

      {/* Debug info */}
      <div className="text-xs text-gray-500">
        Users available: {users.length} | Selected: {localSelectedUsers.length}
      </div>

      {/* Selected Users Display */}
      {localSelectedUsers.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {localSelectedUsers.map((userId) => {
            const user = users.find(
              (u) => u.user?.id === userId || u.id === userId,
            )
            console.log('Looking for userId:', userId, 'Found user:', user)
            return (
              <Badge
                key={userId}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {user?.user?.full_name || user?.email || 'Unknown User'}
                {!isDisabled && (
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-red-500"
                    onClick={() => handleRemoveUser(userId)}
                  />
                )}
              </Badge>
            )
          })}
        </div>
      )}

      {/* User Selection Dropdown */}
      <Select value="" onValueChange={handleUserSelect} disabled={isDisabled}>
        <SelectTrigger>
          <SelectValue
            placeholder={
              localSelectedUsers.length > 0
                ? `${localSelectedUsers.length} item${
                    localSelectedUsers.length > 1 ? 's' : ''
                  } selected`
                : users.length === 0
                ? 'No users available'
                : 'Select users'
            }
          />
        </SelectTrigger>
        <SelectContent>
          {users.map((user) => {
            console.log('Rendering user item:', user)
            console.log('User full_name:', user.user?.full_name)
            console.log('User email:', user.user?.email)
            return (
              <SelectItem
                key={user.id}
                value={user.id}
                className={
                  localSelectedUsers.includes(user.id) ? 'bg-muted' : ''
                }
              >
                <div className="flex items-center justify-between w-full">
                  <span>
                    {user.user?.full_name || user.email || 'Unknown User'}
                  </span>
                  {localSelectedUsers.includes(user.id) && (
                    <span className="text-primary">✓</span>
                  )}
                </div>
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    </div>
  )
}
