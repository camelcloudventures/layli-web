'use client'

import PageHeader from '@/components/custom/page-header'
import { User } from '@/types/types'
import { ReportIssueForm } from './report-issue-form'
import { Download, Plus } from 'lucide-react'
import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogContent,
} from '@/components/ui/dialog'

export default function Issues({ users }: { users: User[] }) {
  const [isReportIssueDialogOpen, setIsReportIssueDialogOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Issues"
          description="Track and manage audit issues"
          actions={[
            {
              label: 'Export CSV',
              onClick: () => {},
              icon: <Download className="mr-2 h-4 w-4" />,
              variant: 'outline',
            },
            {
              label: 'Report Issue',
              onClick: () => setIsReportIssueDialogOpen(true),
              icon: <Plus className="mr-2 h-4 w-4" />,
              variant: 'default',
            },
          ]}
        />
      </div>

      <Dialog
        open={isReportIssueDialogOpen}
        onOpenChange={setIsReportIssueDialogOpen}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Report Issue</DialogTitle>
            <DialogDescription>
              Report a new issue that requires attention or action.
            </DialogDescription>
          </DialogHeader>
          <ReportIssueForm
            users={users}
            onCancel={() => setIsReportIssueDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
