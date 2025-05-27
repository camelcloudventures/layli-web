'use client'

import type React from 'react'

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
import { createSchedule } from '../actions/actions'
import type {
  UserOption,
  TemplateOption,
  SiteOption,
} from '../types/schedule-form-types'

interface CreateScheduleFormProps {
  users: UserOption[]
  templates: TemplateOption[]
  sites: SiteOption[]
  onSubmit: (formData: FormData) => void
  onCancel: () => void
}

export function CreateScheduleForm({
  users,
  templates,
  sites,
  onSubmit,
  onCancel,
}: CreateScheduleFormProps) {
  async function handleCreate(formData: FormData) {
    const res = await createSchedule(formData)
    if (res?.error) toast.error(res.error)
    else {
      toast.success(res?.success)
      onSubmit(formData)
    }
  }

  return (
    <form action={handleCreate} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">
            Schedule Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            name="title"
            placeholder="e.g., Weekly Safety Inspection"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="template_id">
            Audit Template <span className="text-red-500">*</span>
          </Label>
          <Select name="template_id" required>
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
          <Select name="site_id" required>
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
          <Label htmlFor="assignee_id">
            Assignee <span className="text-red-500">*</span>
          </Label>
          <Select name="assignee_id" required>
            <SelectTrigger id="assignee_id" className="w-full">
              <SelectValue placeholder="Select an assignee" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem
                  key={user.user.id}
                  value={user.user.id}
                  className="hover:bg-gray-100 cursor-pointer"
                >
                  {user.user.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="frequency">
            Frequency <span className="text-red-500">*</span>
          </Label>
          <Select name="frequency" required>
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
          <Label htmlFor="priority">
            Priority <span className="text-red-500">*</span>
          </Label>
          <Select name="priority" required>
            <SelectTrigger id="priority" className="w-full">
              <SelectValue placeholder="Select a priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                value="low"
                className="hover:bg-gray-100 cursor-pointer"
              >
                Low
              </SelectItem>
              <SelectItem
                value="medium"
                className="hover:bg-gray-100 cursor-pointer"
              >
                Medium
              </SelectItem>
              <SelectItem
                value="high"
                className="hover:bg-gray-100 cursor-pointer"
              >
                High
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <SubmitBtn label="Create Schedule" variant="default" className="" />
      </div>
    </form>
  )
}

export type { UserOption, TemplateOption, SiteOption }
