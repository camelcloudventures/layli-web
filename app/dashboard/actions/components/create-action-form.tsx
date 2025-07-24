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
import {
  ActionPriority,
  ActionStatus,
  Assignee,
  User,
  ActionFrequency,
  Site,
} from '@/lib/types'
import { createAction } from '../actions/actions'
import { toast } from 'sonner'
import { MultiSelect } from '@/components/ui/multi-select'
import SubmitBtn from '@/components/custom/submit-btn'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/lib/context/auth-provider'

interface CreateActionFormProps {
  users: User[]
  sites: Site[]
  onCancel: () => void
}

export function CreateActionForm({
  users,
  sites,
  onCancel,
}: CreateActionFormProps) {
  const { user } = useAuth()
  const [selectedAssignees, setSelectedAssignees] = useState<Assignee[]>([])
  const [dueDate, setDueDate] = useState<string>(
    new Date().toISOString().split('T')[0],
  )
  const [selectedSite, setSelectedSite] = useState<Site | null>(null)
  const [selectedFrequency, setSelectedFrequency] = useState<ActionFrequency>(
    ActionFrequency.ONE_TIME,
  )

  const handleSubmit = async (formData: FormData) => {
    // Validate required fields
    if (!selectedSite) {
      toast.error('Please select a site')
      return
    }

    if (selectedAssignees.length === 0) {
      toast.error('Please select at least one assignee')
      return
    }

    // Add form data
    formData.append('priority', ActionPriority.MEDIUM)
    formData.append('status', ActionStatus.TODO)
    formData.append('frequency', selectedFrequency)
    formData.append('due_at', dueDate)

    // Add assignees and created_by data
    formData.append('assignees', JSON.stringify(selectedAssignees))
    formData.append(
      'created_by',
      JSON.stringify({
        id: user?.id || '',
        full_name: user?.full_name || '',
        email: user?.email || '',
        role: user?.role || 'user',
      }),
    )

    const result = await createAction(
      formData,
      {
        id: user?.id || '',
        full_name: user?.full_name || '',
        email: user?.email || '',
        role: user?.role || 'user',
      },
      selectedSite!,
      selectedAssignees,
    )
    if (result && !result.error) {
      toast.success('Action created successfully')
      onCancel()
    } else {
      toast.error(result?.error || 'Failed to create action')
    }
  }

  const userOptions = users.map((user) => ({
    value: user.user.id,
    label: user.user.full_name,
  }))

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          placeholder="e.g. Fix leaky faucet"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="site">Site *</Label>
        <Select
          value={selectedSite?.id ? String(selectedSite.id) : ''}
          onValueChange={(value) => {
            const site = sites.find((s) => String(s.id) === value)
            setSelectedSite(site || null)
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a site" />
          </SelectTrigger>
          <SelectContent>
            {sites.map((site) => (
              <SelectItem key={site.id} value={String(site.id)}>
                {site.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="e.g. The faucet in the main kitchen is dripping."
          required
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
        <Label>Frequency</Label>
        <Select
          value={selectedFrequency}
          onValueChange={(value) =>
            setSelectedFrequency(value as ActionFrequency)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(ActionFrequency).map((frequency) => (
              <SelectItem key={frequency} value={frequency}>
                {frequency.replace('_', ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Assignees *</Label>
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
        <Label htmlFor="dueDate">Due Date</Label>
        <Input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
        />
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
