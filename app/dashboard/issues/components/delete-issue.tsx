'use client'

import { DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Issue } from '@/types/types'

interface DeleteIssueProps {
  issue: Issue
}

export default function DeleteIssue({ issue }: DeleteIssueProps) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Delete issue: {issue.title}</DialogTitle>
      </DialogHeader>
      <div>
        <p>Are you sure you want to delete this issue?</p>
      </div>
    </>
  )
}
