'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { shareIssue } from '../actions/actions'

interface User {
  id: string
  full_name: string
  email: string
  role: string
}

interface ShareIssueDialogProps {
  isOpen: boolean
  onClose: () => void
  issueId: string
  assignees: User[] // All available users
  currentAssignees: User[] // Currently assigned users to this issue
}

export default function ShareIssueDialog({
  isOpen,
  onClose,
  issueId,
  assignees,
  currentAssignees,
}: ShareIssueDialogProps) {
  console.log('assignees', assignees)
  console.log('currentAssignees', currentAssignees)

  // Initialize selectedUsers with the current assignees (users already assigned to this issue)
  const [selectedUsers, setSelectedUsers] = useState<string[]>(
    currentAssignees.map((user) => user.id),
  )
  const [sendNotification, setSendNotification] = useState(true)
  const [isSharing, setIsSharing] = useState(false)

  // Update selectedUsers when currentAssignees change
  useEffect(() => {
    setSelectedUsers(currentAssignees.map((user) => user.id))
  }, [currentAssignees])

  const handleSelectAll = () => {
    if (selectedUsers.length === assignees.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(assignees.map((user) => user.id))
    }
  }

  const handleUserToggle = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    )
  }

  const handleShare = async () => {
    if (selectedUsers.length === 0) {
      toast.error('Please select at least one user to share with')
      return
    }

    setIsSharing(true)

    // Get current assignee IDs
    const currentAssigneeIds = currentAssignees.map((user) => user.id)

    // Find newly selected users (users that are selected but not currently assigned)
    const newlySelectedUserIds = selectedUsers.filter(
      (userId) => !currentAssigneeIds.includes(userId),
    )

    if (newlySelectedUserIds.length === 0) {
      toast.error('No new users selected to share with')
      setIsSharing(false)
      return
    }

    // Convert newly selected user IDs to Assignee objects
    const newlySelectedAssignees = assignees
      .filter((user) => newlySelectedUserIds.includes(user.id))
      .map((user) => ({
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      }))

    const response = await shareIssue(issueId, newlySelectedAssignees)
    console.log('response', response)
    if (response?.success) {
      setIsSharing(false)
      toast.success(
        `Issue shared with ${newlySelectedAssignees.length} new team member(s)`,
      )
      onClose()
      setSelectedUsers([])
    } else {
      toast.error(response?.error || 'Failed to share issue')
    }
  }

  const handleClose = () => {
    setSelectedUsers([])
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Share Issue</DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Share this issue with team members
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Select Users</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSelectAll}
                className="h-auto p-0 text-sm"
              >
                {selectedUsers?.length === assignees?.length
                  ? 'Deselect All'
                  : 'Select All'}
              </Button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {assignees?.map((user) => (
                <div key={user.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={user.id}
                    checked={selectedUsers?.includes(user.id)}
                    onCheckedChange={() => handleUserToggle(user.id)}
                  />
                  <Label
                    htmlFor={user.id}
                    className="flex flex-col cursor-pointer"
                  >
                    <span className="text-sm font-medium">
                      {user.full_name}
                    </span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {user.role}
                    </span>
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="notification"
              checked={sendNotification}
              onCheckedChange={(checked) =>
                setSendNotification(checked as boolean)
              }
            />
            <Label htmlFor="notification" className="text-sm cursor-pointer">
              Send notification to selected users
            </Label>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={handleClose} disabled={isSharing}>
            Cancel
          </Button>
          <Button
            onClick={handleShare}
            disabled={isSharing || selectedUsers?.length === 0}
          >
            {isSharing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sharing...
              </>
            ) : (
              'Share Issue'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
