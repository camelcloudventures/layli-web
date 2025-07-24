'use client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Trash2, Pencil, CheckCircle } from 'lucide-react'
import { Issue } from '@/lib/types'
import { useState } from 'react'
import UpdateIssue from './update-issue'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from '@/components/ui/dialog'
import CloseIssue from './close-issue'
import DeleteIssue from './delete-issue'

type DialogType = 'update' | 'close' | 'delete' | null

interface IssueActionsProps {
  issue: Issue
  assignees: Array<{
    id: string
    full_name: string
    email: string
    role: string
  }>
}

export function IssueActions({ issue, assignees }: IssueActionsProps) {
  const [activeDialog, setActiveDialog] = useState<DialogType>(null)

  const renderDialogContent = () => {
    if (!activeDialog) return null

    switch (activeDialog) {
      case 'update':
        return (
          <UpdateIssue
            issue={issue}
            onClose={() => setActiveDialog(null)}
            assignees={assignees}
          />
        )
      case 'close':
        return (
          <CloseIssue issue={issue} onClose={() => setActiveDialog(null)} />
        )
      case 'delete':
        return (
          <DeleteIssue issue={issue} onClose={() => setActiveDialog(null)} />
        )
      default:
        return null
    }
  }
  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {issue.status !== 'closed' && (
            <DropdownMenuItem onClick={() => setActiveDialog('update')}>
              <Pencil className="mr-2 h-4 w-4" />
              Update issue
            </DropdownMenuItem>
          )}
          {issue.status !== 'closed' && (
            <DropdownMenuItem onClick={() => setActiveDialog('close')}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Close issue
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className="text-red-500"
            onClick={() => setActiveDialog('delete')}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete issue
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog
        open={activeDialog !== null}
        onOpenChange={() => setActiveDialog(null)}
      >
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {activeDialog === 'update' && 'Issue Details'}
              {activeDialog === 'close' && 'Close Issue'}
              {activeDialog === 'delete' && 'Delete Issue'}
            </DialogTitle>
          </DialogHeader>
          {renderDialogContent()}
        </DialogContent>
      </Dialog>
    </>
  )
}
