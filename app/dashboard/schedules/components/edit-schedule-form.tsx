'use client'

import type React from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import SubmitBtn from '@/components/custom/submit-btn'
import { updateSchedule } from '../actions/actions'
import type {
  UserOption,
  TemplateOption,
  SiteOption,
} from '../types/schedule-form-types'
import type { Schedule } from '@/lib/types/schedule-types'
import { MultiSelect } from '@/components/ui/multi-select'

interface EditScheduleFormProps {
  schedule: Schedule
  users: UserOption[]
  templates: TemplateOption[]
  sites: SiteOption[]
  onSubmit: (formData: FormData) => void
  onCancel: () => void
}

export function EditScheduleForm({
  schedule,
  users,
  templates,
  sites,
  onSubmit,
  onCancel,
}: EditScheduleFormProps) {
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>(
    schedule.assignees?.map((a) => a.assignee.id) || [],
  )

  const normalizeTime = (t?: string) => (t ? t.slice(0, 5) : undefined)
  const [startTime, setStartTime] = useState(
    normalizeTime(schedule.start_time) || '09:00',
  )
  const [endTime, setEndTime] = useState(
    normalizeTime(schedule.end_time) || '17:00',
  )

  // Helper to generate time options in 30-minute intervals
  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2)
    const minute = i % 2 === 0 ? '00' : '30'
    const ampm = hour < 12 ? 'AM' : 'PM'
    const displayHour = hour % 12 === 0 ? 12 : hour % 12
    return {
      value: `${hour.toString().padStart(2, '0')}:${minute}`,
      label: `${displayHour}:${minute} ${ampm}`,
    }
  })

  async function handleEdit(formData: FormData) {
    // Add selected assignees to form data
    formData.delete('assignee_ids')
    selectedAssignees.forEach((id) => {
      formData.append('assignee_ids', id)
    })
    // Set start and end time
    formData.set('start_time', startTime)
    formData.set('end_time', endTime)

    const res = (await updateSchedule(formData)) as {
      error?: string
      success?: string
    }
    if (res?.error) toast.error(res.error)
    else {
      toast.success(res?.success)
      onSubmit(formData)
    }
  }

  return (
    <form action={handleEdit} className="space-y-6">
      <input type="hidden" name="id" value={schedule.id} />
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">
            Schedule Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            name="title"
            defaultValue={schedule.title}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="template_id">
            Audit Template <span className="text-red-500">*</span>
          </Label>
          <Select
            name="template_id"
            required
            defaultValue={String(schedule.template_id)}
          >
            <SelectTrigger id="template_id" className="w-full">
              <SelectValue placeholder="Select an audit template" />
            </SelectTrigger>
            <SelectContent>
              {templates.map((template) => (
                <SelectItem
                  key={template.id}
                  value={String(template.id)}
                  className="hover:bg-gray-100 cursor-pointer"
                >
                  {template.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="site_id">
            Site <span className="text-red-500">*</span>
          </Label>
          <Select
            name="site_id"
            required
            defaultValue={String(schedule.site_id)}
          >
            <SelectTrigger id="site_id" className="w-full">
              <SelectValue placeholder="Select a site" />
            </SelectTrigger>
            <SelectContent>
              {sites.map((site) => (
                <SelectItem
                  key={site.id}
                  value={String(site.id)}
                  className="hover:bg-gray-100 cursor-pointer"
                >
                  {site.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="assignee_ids">
            Assignees <span className="text-red-500">*</span>
          </Label>
          <MultiSelect
            name="assignee_ids"
            required
            value={selectedAssignees}
            onValueChange={setSelectedAssignees}
            placeholder="Select assignees"
            options={users.map((user) => ({
              value: user.user.id,
              label: user.user.full_name,
            }))}
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedAssignees.map((id) => {
              const user = users.find((u) => u.user.id === id)
              return user ? (
                <span
                  key={id}
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                >
                  {user.user.full_name}
                </span>
              ) : null
            })}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="frequency">
            Frequency <span className="text-red-500">*</span>
          </Label>
          <Select name="frequency" required defaultValue={schedule.frequency}>
            <SelectTrigger id="frequency" className="w-full">
              <SelectValue placeholder="Select a frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                value="daily"
                className="hover:bg-gray-100 cursor-pointer"
              >
                Daily
              </SelectItem>
              <SelectItem
                value="weekly"
                className="hover:bg-gray-100 cursor-pointer"
              >
                Weekly
              </SelectItem>
              <SelectItem
                value="monthly"
                className="hover:bg-gray-100 cursor-pointer"
              >
                Monthly
              </SelectItem>
              <SelectItem
                value="yearly"
                className="hover:bg-gray-100 cursor-pointer"
              >
                Yearly
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">
            Status <span className="text-red-500">*</span>
          </Label>
          <Select name="status" required defaultValue={schedule.status}>
            <SelectTrigger id="status" className="w-full">
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                value="active"
                className="hover:bg-gray-100 cursor-pointer"
              >
                Active
              </SelectItem>
              <SelectItem
                value="completed"
                className="hover:bg-gray-100 cursor-pointer"
              >
                Completed
              </SelectItem>
              <SelectItem
                value="paused"
                className="hover:bg-gray-100 cursor-pointer"
              >
                Paused
              </SelectItem>
              <SelectItem
                value="cancelled"
                className="hover:bg-gray-100 cursor-pointer"
              >
                Cancelled
              </SelectItem>
              <SelectItem
                value="inactive"
                className="hover:bg-gray-100 cursor-pointer"
              >
                Inactive
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-row gap-4 items-center">
          <div className="flex-1 flex flex-col">
            <Label htmlFor="start_time">
              Start Time <span className="text-red-500">*</span>
            </Label>
            <select
              id="start_time"
              name="start_time"
              required
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {timeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <span className="mx-2 text-lg font-medium">~</span>
          <div className="flex-1 flex flex-col">
            <Label htmlFor="end_time">
              End Time <span className="text-red-500">*</span>
            </Label>
            <select
              id="end_time"
              name="end_time"
              required
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {timeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <SubmitBtn label="Save Changes" variant="default" className="" />
      </div>
    </form>
  )
}
