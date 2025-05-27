'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
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
import { mockTemplates } from '@/lib/data/mock-templates'
import { mockUsers, mockSites } from '@/lib/data/mock-schedules'
import type { Frequency, Schedule } from '@/lib/types/schedule-types'

interface EditScheduleFormProps {
  schedule: Schedule
  onSubmit: (formData: {
    id: string
    title: string
    template_id: string
    site_id: string
    assignee_id: string
    frequency: Frequency
  }) => void
  onCancel: () => void
}

export function EditScheduleForm({
  schedule,
  onSubmit,
  onCancel,
}: EditScheduleFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    id: schedule.id,
    title: schedule.title || '',
    template_id: schedule.template_id || '',
    site_id: schedule.site_id || '',
    assignee_id: schedule.assignee_id || '',
    frequency: schedule.frequency || ('' as Frequency),
  })
  const [errors, setErrors] = useState({
    title: false,
    template_id: false,
    site_id: false,
    assignee_id: false,
    frequency: false,
  })

  // Update form data when schedule changes
  useEffect(() => {
    setFormData({
      id: schedule.id,
      title: schedule.title || '',
      template_id: schedule.template_id || '',
      site_id: schedule.site_id || '',
      assignee_id: schedule.assignee_id || '',
      frequency: schedule.frequency || ('' as Frequency),
    })
  }, [schedule])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear error for this field
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: false,
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {
      title: !formData.title.trim(),
      template_id: !formData.template_id,
      site_id: !formData.site_id,
      assignee_id: !formData.assignee_id,
      frequency: !formData.frequency,
    }

    setErrors(newErrors)

    return !Object.values(newErrors).some(Boolean)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!validateForm()) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)

    try {
      // Submit the form data
      onSubmit(formData)
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('Failed to update schedule')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label
            htmlFor="edit-title"
            className={errors.title ? 'text-red-500' : ''}
          >
            Schedule Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="edit-title"
            placeholder="e.g., Weekly Safety Inspection"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            disabled={isSubmitting}
            className={errors.title ? 'border-red-500' : ''}
          />
          {errors.title && (
            <p className="text-xs text-red-500">Title is required</p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="edit-template"
            className={errors.template_id ? 'text-red-500' : ''}
          >
            Audit Template <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.template_id}
            onValueChange={(value) => handleChange('template_id', value)}
            disabled={isSubmitting}
          >
            <SelectTrigger
              id="edit-template"
              className={errors.template_id ? 'border-red-500' : ''}
            >
              <SelectValue placeholder="Select an audit template" />
            </SelectTrigger>
            <SelectContent>
              {mockTemplates.map((template) => (
                <SelectItem key={template.id} value={template.id.toString()}>
                  {template.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.template_id && (
            <p className="text-xs text-red-500">Template is required</p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="edit-site"
            className={errors.site_id ? 'text-red-500' : ''}
          >
            Site <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.site_id}
            onValueChange={(value) => handleChange('site_id', value)}
            disabled={isSubmitting}
          >
            <SelectTrigger
              id="edit-site"
              className={errors.site_id ? 'border-red-500' : ''}
            >
              <SelectValue placeholder="Select a site" />
            </SelectTrigger>
            <SelectContent>
              {mockSites.map((site) => (
                <SelectItem key={site.id} value={site.id}>
                  {site.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.site_id && (
            <p className="text-xs text-red-500">Site is required</p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="edit-assignee"
            className={errors.assignee_id ? 'text-red-500' : ''}
          >
            Assignee <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.assignee_id}
            onValueChange={(value) => handleChange('assignee_id', value)}
            disabled={isSubmitting}
          >
            <SelectTrigger
              id="edit-assignee"
              className={errors.assignee_id ? 'border-red-500' : ''}
            >
              <SelectValue placeholder="Select an assignee" />
            </SelectTrigger>
            <SelectContent>
              {mockUsers.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name} ({user.role})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.assignee_id && (
            <p className="text-xs text-red-500">Assignee is required</p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="edit-frequency"
            className={errors.frequency ? 'text-red-500' : ''}
          >
            Frequency <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.frequency}
            onValueChange={(value) =>
              handleChange('frequency', value as Frequency)
            }
            disabled={isSubmitting}
          >
            <SelectTrigger
              id="edit-frequency"
              className={errors.frequency ? 'border-red-500' : ''}
            >
              <SelectValue placeholder="Select a frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          {errors.frequency && (
            <p className="text-xs text-red-500">Frequency is required</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}
