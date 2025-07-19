'use client'

import { DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Issue } from '@/types/types'

interface UpdateIssueProps {
  issue: Issue
}

export default function UpdateIssue({ issue }: UpdateIssueProps) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Update issue: {issue.title}</DialogTitle>
      </DialogHeader>
    </>
  )
}
