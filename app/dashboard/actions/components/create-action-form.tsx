'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ActionPriority, ActionStatus, Assignee, User } from '@/lib/types'
import { CalendarIcon } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { createAction } from '../actions/actions'
import { toast } from 'sonner'
import { MultiSelect } from '@/components/ui/multi-select'
import SubmitBtn from '@/components/custom/submit-btn'
import { Label } from '@/components/ui/label'

interface CreateActionFormProps {
  users: User[]
  onCancel: () => void
}

export function CreateActionForm({ users, onCancel }: CreateActionFormProps) {
  const [selectedAssignees, setSelectedAssignees] = useState<Assignee[]>([])
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date())

  const handleSubmit = async (formData: FormData) => {
    formData.append('priority', ActionPriority.MEDIUM)
    formData.append('status', ActionStatus.TODO)
    if (dueDate) {
      formData.append('due_at', dueDate.toISOString())
    }
    const assigneeIds = selectedAssignees.map((a) => a.id)
    formData.append('assignees', JSON.stringify(assigneeIds))

    toast.promise(createAction(formData), {
      loading: 'Creating action...',
      success: 'Action created successfully',
      error: 'Failed to create action',
    })
    onCancel()
  }

  const userOptions = users.map((user) => ({
    value: user.user.id,
    label: user.user.full_name,
  }))

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" placeholder="e.g. Fix leaky faucet" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="e.g. The faucet in the main kitchen is dripping."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Priority</Label>
          <Select name="priority" defaultValue={ActionPriority.MEDIUM}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ActionPriority).map((priority) => (
                <SelectItem key={priority} value={priority}>
                  {priority}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select name="status" defaultValue={ActionStatus.TODO}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ActionStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Assignees</Label>
        <MultiSelect
          name="assignees"
          options={userOptions}
          value={selectedAssignees.map((a) => a.id)}
          onValueChange={(ids) => {
            const assignees = users
              .filter((u) => ids.includes(u.user.id))
              .map((u) => ({
                id: u.user.id,
                full_name: u.user.full_name,
                email: u.user.email,
                role: u.user.role,
              }))
            setSelectedAssignees(assignees)
          }}
          placeholder="Select assignees"
        />
      </div>
      <div className="space-y-2">
        <Label>Due Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'w-full justify-start text-left font-normal',
                !dueDate && 'text-muted-foreground',
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dueDate ? format(dueDate, 'PPP') : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dueDate}
              onSelect={setDueDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="label">Label</Label>
        <Input id="label" name="label" placeholder="e.g. maintenance, safety" />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <SubmitBtn label="Create Action" variant="default" className="" />
      </div>
    </form>
  )
}
