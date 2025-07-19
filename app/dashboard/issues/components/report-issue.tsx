import CustomSelect from '@/components/custom/custom-select'
import { Label } from '@/components/ui/label'
import { MultiSelect } from '@/components/ui/multi-select'
import { Textarea } from '@/components/ui/textarea'
import { IssuePriority } from '@/lib/types/issue-types'
import { cn } from '@/lib/utils'

import React from 'react'
import { Upload } from 'lucide-react'

import DatePopover from '@/components/custom/date-popover'
import { Assignee } from '@/types/types'

export interface UserOption {
  user: {
    id: string
    full_name: string
    role: string
    email: string
  }
}

interface ReportIssueProps {
  priority: IssuePriority
  setPriority: (priority: IssuePriority) => void
  users: UserOption[]
  selectedAssignees: Assignee[]
  setSelectedAssignees: (assignees: Assignee[]) => void
  date: Date | undefined
  setDate: (date: Date | undefined) => void
}

export default function ReportIssue({
  priority,
  setPriority,
  users,
  selectedAssignees,
  setSelectedAssignees,
  date,
  setDate,
}: ReportIssueProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="description">
          Description <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Provide detailed information about the issue"
          className={cn('min-h-[150px]')}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className=" w-full">
          <Label htmlFor="priority">
            Priority <span className="text-red-500">*</span>
          </Label>
          <CustomSelect
            options={[
              { label: 'Low', value: 'low' },
              { label: 'Medium', value: 'medium' },
              { label: 'High', value: 'high' },
              { label: 'Critical', value: 'critical' },
            ]}
            value={priority}
            onValueChange={(value) => setPriority(value as IssuePriority)}
          />
        </div>

        <DatePopover date={date} setDate={setDate} />
      </div>
      <div className="w-full">
        <Label htmlFor="assignee">
          Assignees <span className="text-red-500">*</span>
        </Label>
        <MultiSelect
          className=""
          name="assignee_ids"
          required
          value={selectedAssignees.map((assignee) => assignee.id)}
          onValueChange={(value) =>
            setSelectedAssignees(
              users
                .filter((user) => value.includes(user.user.id))
                .map((user) => user.user),
            )
          }
          placeholder="Select assignees"
          options={users.map((user) => ({
            value: user.user.id,
            label: user.user.full_name,
          }))}
        />
      </div>

      <div className="space-y-2">
        <Label>Attachments (Optional)</Label>
        <div className="flex items-center justify-center rounded-md border border-dashed p-4">
          <div className="flex flex-col items-center gap-1 text-center">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium">Upload files</p>
            <p className="text-xs text-muted-foreground">
              File attachment will be enabled in production
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
