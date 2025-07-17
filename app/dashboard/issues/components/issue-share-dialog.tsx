'use client'

import type React from 'react'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Loader2 } from 'lucide-react'
import { mockUsers } from '@/lib/data/mock-issues'
import type { Issue } from '@/lib/types/issue-types'

interface IssueShareDialogProps {
  issue: Issue
  onShare: () => void
  onCancel: () => void
}

export function IssueShareDialog({
  issue,
  onShare,
  onCancel,
}: IssueShareDialogProps) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [sendNotification, setSendNotification] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleToggleUser = (userId: string) => {
    setSelectedUsers((prevSelected) => {
      if (prevSelected.includes(userId)) {
        return prevSelected.filter((id) => id !== userId)
      } else {
        return [...prevSelected, userId]
      }
    })
  }

  const handleSelectAll = () => {
    if (selectedUsers.length === mockUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(mockUsers.map((user) => user.id))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Here we would normally send the sharing request to the server
    setTimeout(() => {
      onShare()
      setIsSubmitting(false)
    }, 800)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-base">Select Users</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleSelectAll}
            disabled={isSubmitting}
          >
            {selectedUsers.length === mockUsers.length
              ? 'Deselect All'
              : 'Select All'}
          </Button>
        </div>

        <div className="max-h-[200px] overflow-y-auto rounded-md border p-2">
          {mockUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-2 py-2 px-1 hover:bg-accent rounded-sm"
            >
              <Checkbox
                id={`user-${user.id}`}
                checked={selectedUsers.includes(user.id)}
                onCheckedChange={() => handleToggleUser(user.id)}
                disabled={isSubmitting}
              />
              <Label
                htmlFor={`user-${user.id}`}
                className={`flex flex-1 items-center gap-2 ${
                  isSubmitting
                    ? 'cursor-not-allowed opacity-70'
                    : 'cursor-pointer'
                }`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.image || ''} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.role}</p>
                </div>
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-start gap-2">
        <Checkbox
          id="sendNotification"
          checked={sendNotification}
          onCheckedChange={() => setSendNotification(!sendNotification)}
          disabled={isSubmitting}
        />
        <Label
          htmlFor="sendNotification"
          className={`text-sm ${
            isSubmitting ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'
          }`}
        >
          Send notification to selected users
        </Label>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={selectedUsers.length === 0 || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sharing...
            </>
          ) : (
            'Share Issue'
          )}
        </Button>
      </div>
    </form>
  )
}
