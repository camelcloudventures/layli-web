'use client'

import { DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Issue } from '@/types/types'

interface ShareIssueProps {
  issue: Issue
}

export default function ShareIssue({ issue }: ShareIssueProps) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Share issue: {issue.title}</DialogTitle>
      </DialogHeader>
      <div>
        <p>Share functionality will be implemented here.</p>
      </div>
    </>
  )
}
