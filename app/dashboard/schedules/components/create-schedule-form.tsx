'use client'

import type React from 'react'

import { Button } from '@/components/ui/button'
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
import { useState } from 'react'
import { MultiSelect } from '@/components/ui/multi-select'

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
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([])
  const [selectedTemplateId, setSelectedTemplateId] = useState<
    string | undefined
  >(undefined)

  async function handleCreate(formData: FormData) {
    // Add selected assignees to form data
    formData.delete('assignee_ids')
    selectedAssignees.forEach((id) => {
      formData.append('assignee_ids', id)
    })

    // Set the title from the selected template
    const selectedTemplate = templates.find(
      (t) => String(t.id) === selectedTemplateId,
    )
    if (selectedTemplate) {
      formData.set('title', selectedTemplate.title)
    }

    const res = await createSchedule(formData)
    if (res?.error) toast.error(res.error)
    else {
      toast.success(res?.success)
      onSubmit(formData)
    }
  }

  return (
    <form action={handleCreate} className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <div className="">
          <Label htmlFor="template_id">
            Audit Template <span className="text-red-500">*</span>
          </Label>
          <Select
            name="template_id"
            required
            onValueChange={setSelectedTemplateId}
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
        <div className="">
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
        <div className="">
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
        </div>
        <div className="">
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
