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
import { MoreHorizontal, Share2, Trash2, Pencil } from 'lucide-react'
import { Issue } from '@/types/types'
import { useState } from 'react'
import UpdateIssue from './update-issue'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import ShareIssue from './share-issue'
import DeleteIssue from './delete-issue'

type DialogType = 'update' | 'share' | 'delete' | null

interface IssueActionsProps {
  issue: Issue
}

export function IssueActions({ issue }: IssueActionsProps) {
  const [activeDialog, setActiveDialog] = useState<DialogType>(null)

  const renderDialogContent = () => {
    if (!activeDialog) return null

    switch (activeDialog) {
      case 'update':
        return <UpdateIssue issue={issue} />
      case 'share':
        return <ShareIssue issue={issue} />
      case 'delete':
        return <DeleteIssue issue={issue} />
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

          <DropdownMenuItem onClick={() => setActiveDialog('update')}>
            <Pencil className="mr-2 h-4 w-4" />
            Update issue
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setActiveDialog('share')}>
            <Share2 className="mr-2 h-4 w-4" />
            Share issue
          </DropdownMenuItem>
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
        <DialogContent>{renderDialogContent()}</DialogContent>
      </Dialog>
    </>
  )
}
