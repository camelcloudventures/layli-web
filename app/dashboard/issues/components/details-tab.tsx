'use client'

import Comments from '@/components/custom/comments'
import CustomSelect from '@/components/custom/custom-select'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { MultiSelect } from '@/components/ui/multi-select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Issue, IssuePriority, IssueStatus } from '@/lib/types'
import { Loader2, Send } from 'lucide-react'
import React from 'react'

type DetailsTabProps = {
  issue: Issue
  status: IssueStatus
  priority: IssuePriority
  assigneeIds: string[]
  setStatus: (status: IssueStatus) => void
  setPriority: (priority: IssuePriority) => void
  setAssigneeIds: (assigneeIds: string[]) => void
  addComment: (comment: string) => void
  comment: string
  setComment: (comment: string) => void
  pending: boolean
  isSendingComment: boolean
}

export default function DetailsTab({
  issue,
  status,
  priority,
  assigneeIds,
  setStatus,
  setPriority,
  setAssigneeIds,
  comment,
  setComment,
  pending,
  isSendingComment,
  addComment,
}: DetailsTabProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="cause" className="text-lg font-medium mb-2">
          Cause
        </Label>
        <Textarea
          id="cause"
          name="cause"
          defaultValue={issue?.cause || ''}
          className="text-muted-foreground"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 w-full items-center">
          <h3 className="text-sm font-medium">Status</h3>
          <input type="hidden" name="status" value={status} />
          <CustomSelect
            options={[
              { label: 'Open', value: 'open' },
              { label: 'In Progress', value: 'in_progress' },
              { label: 'Resolved', value: 'resolved' },
              { label: 'Closed', value: 'closed' },
            ]}
            value={status}
            onValueChange={(value) => setStatus(value as IssueStatus)}
          />
        </div>

        <div className="space-y-2 w-full items-center">
          <h3 className="text-sm font-medium">Priority</h3>
          <input type="hidden" name="priority" value={priority} />
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

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Assignee</h3>
          <MultiSelect
            name="assignee_ids"
            className="mb-8"
            required
            value={assigneeIds}
            onValueChange={setAssigneeIds}
            placeholder="Select assignees"
            options={issue.assignees.map((a) => ({
              value: a.id,
              label: a.full_name,
            }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="due-date">Due Date</Label>
          <Input
            id="due-date"
            name="due_at"
            type="date"
            defaultValue={issue.due_at?.split('T')[0]}
          />
        </div>
      </div>

      <Comments comments={issue.comments} />

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Add Comment</h3>
        <div className="flex gap-2">
          <Textarea
            name="comment"
            placeholder="Type your comment here..."
            className="min-h-[100px] flex-1"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={() => addComment(comment)}
            disabled={pending || isSendingComment || !comment.trim()}
            className="w-fit"
            size="sm"
          >
            {isSendingComment ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            {isSendingComment ? 'Sending...' : 'Send Comment'}
          </Button>
        </div>
      </div>
    </div>
  )
}
