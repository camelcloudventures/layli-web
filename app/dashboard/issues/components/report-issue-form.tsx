'use client'

import type React from 'react'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Upload, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { mockUsers } from '@/lib/data/mock-issues'
import type {
  Issue,
  IssueCategory,
  IssuePriority,
} from '@/lib/types/issue-types'

interface ReportIssueFormProps {
  onSubmit: (issue: Issue) => void
  onCancel: () => void
}

export function ReportIssueForm({ onSubmit, onCancel }: ReportIssueFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '' as IssueCategory,
    priority: 'medium' as IssuePriority,
    assignee_id: '',
    due_date: '' as string, // Changed to string for date input
  })
  const [errors, setErrors] = useState({
    title: false,
    description: false,
    category: false,
    assignee_id: false,
    due_date: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState(1)

  const handleChange = (field: string, value: any) => {
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

  const validateStep1 = () => {
    const newErrors = {
      ...errors,
      title: !formData.title.trim(),
      category: !formData.category,
    }

    setErrors(newErrors)
    return !newErrors.title && !newErrors.category
  }

  const validateStep2 = () => {
    const newErrors = {
      ...errors,
      description: !formData.description.trim(),
      assignee_id: !formData.assignee_id,
      due_date: !formData.due_date,
    }

    setErrors(newErrors)
    return (
      !newErrors.description && !newErrors.assignee_id && !newErrors.due_date
    )
  }

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
    }
  }

  const handlePrevStep = () => {
    if (step === 2) {
      setStep(1)
    }
  }

  const getPriorityColor = (priority: IssuePriority) => {
    switch (priority) {
      case 'critical':
        return 'text-red-600'
      case 'high':
        return 'text-orange-600'
      case 'medium':
        return 'text-yellow-600'
      case 'low':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate final step
    if (!validateStep2()) {
      toast.error('Missing required fields')
      return
    }

    setIsSubmitting(true)

    try {
      // Find assignee data if selected
      const assignee = formData.assignee_id
        ? mockUsers.find((user) => user.id === formData.assignee_id)
        : null

      // Create issue object
      const newIssue: Issue = {
        id: `issue-${Date.now()}`,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        status: 'open',
        reporter_id: 'user-1', // Currently logged in user
        reporter_name: 'Demo User', // Currently logged in user
        assignee_id: formData.assignee_id,
        assignee_name: assignee ? assignee.name : '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        due_date: formData.due_date
          ? new Date(formData.due_date).toISOString()
          : undefined,
        files: [],
        comments: [],
      }

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Submit the issue only when explicitly clicked
      onSubmit(newIssue)
    } catch (error) {
      console.error('Error submitting issue:', error)
      toast.error('Failed to submit issue. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-4">
              Select Issue Category <span className="text-red-500">*</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant={formData.category === 'safety' ? 'default' : 'outline'}
                className="flex flex-col h-auto py-4 px-3"
                onClick={() => handleChange('category', 'safety')}
              >
                <span className="text-lg mb-1">🚨</span>
                <span className="font-medium">Safety</span>
                <span className="text-xs text-muted-foreground mt-1">
                  Issues related to workplace safety
                </span>
              </Button>

              <Button
                type="button"
                variant={
                  formData.category === 'compliance' ? 'default' : 'outline'
                }
                className="flex flex-col h-auto py-4 px-3"
                onClick={() => handleChange('category', 'compliance')}
              >
                <span className="text-lg mb-1">📝</span>
                <span className="font-medium">Compliance</span>
                <span className="text-xs text-muted-foreground mt-1">
                  Regulatory or compliance issues
                </span>
              </Button>

              <Button
                type="button"
                variant={
                  formData.category === 'operational' ? 'default' : 'outline'
                }
                className="flex flex-col h-auto py-4 px-3"
                onClick={() => handleChange('category', 'operational')}
              >
                <span className="text-lg mb-1">⚙️</span>
                <span className="font-medium">Operational</span>
                <span className="text-xs text-muted-foreground mt-1">
                  Day-to-day operations issues
                </span>
              </Button>

              <Button
                type="button"
                variant={
                  formData.category === 'environmental' ? 'default' : 'outline'
                }
                className="flex flex-col h-auto py-4 px-3"
                onClick={() => handleChange('category', 'environmental')}
              >
                <span className="text-lg mb-1">🌱</span>
                <span className="font-medium">Environmental</span>
                <span className="text-xs text-muted-foreground mt-1">
                  Environmental impact concerns
                </span>
              </Button>

              <Button
                type="button"
                variant={
                  formData.category === 'quality' ? 'default' : 'outline'
                }
                className="flex flex-col h-auto py-4 px-3"
                onClick={() => handleChange('category', 'quality')}
              >
                <span className="text-lg mb-1">✅</span>
                <span className="font-medium">Quality</span>
                <span className="text-xs text-muted-foreground mt-1">
                  Product or service quality issues
                </span>
              </Button>

              <Button
                type="button"
                variant={formData.category === 'other' ? 'default' : 'outline'}
                className="flex flex-col h-auto py-4 px-3"
                onClick={() => handleChange('category', 'other')}
              >
                <span className="text-lg mb-1">❓</span>
                <span className="font-medium">Other</span>
                <span className="text-xs text-muted-foreground mt-1">
                  Other types of issues
                </span>
              </Button>
            </div>
            {errors.category && (
              <p className="text-sm text-red-500 mt-2">
                Please select a category
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="title"
              className={errors.title ? 'text-red-500' : ''}
            >
              Issue Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter a clear and concise title"
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-sm text-red-500">Title is required</p>
            )}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="description"
              className={errors.description ? 'text-red-500' : ''}
            >
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Provide detailed information about the issue"
              className={cn(
                'min-h-[150px]',
                errors.description ? 'border-red-500' : '',
              )}
            />
            {errors.description && (
              <p className="text-sm text-red-500">Description is required</p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="priority">
                Priority <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleChange('priority', value)}
                required
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority">
                    {formData.priority && (
                      <span className={getPriorityColor(formData.priority)}>
                        {formData.priority.charAt(0).toUpperCase() +
                          formData.priority.slice(1)}
                      </span>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low" className={getPriorityColor('low')}>
                    Low
                  </SelectItem>
                  <SelectItem
                    value="medium"
                    className={getPriorityColor('medium')}
                  >
                    Medium
                  </SelectItem>
                  <SelectItem value="high" className={getPriorityColor('high')}>
                    High
                  </SelectItem>
                  <SelectItem
                    value="critical"
                    className={getPriorityColor('critical')}
                  >
                    Critical
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="assignee"
                className={errors.assignee_id ? 'text-red-500' : ''}
              >
                Assignee <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.assignee_id}
                onValueChange={(value) => handleChange('assignee_id', value)}
                required
              >
                <SelectTrigger
                  id="assignee"
                  className={errors.assignee_id ? 'border-red-500' : ''}
                >
                  <SelectValue placeholder="Assign to someone" />
                </SelectTrigger>
                <SelectContent>
                  {mockUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.assignee_id && (
                <p className="text-sm text-red-500">Assignee is required</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="due-date"
              className={errors.due_date ? 'text-red-500' : ''}
            >
              Due Date <span className="text-red-500">*</span>
            </Label>
            <Input
              id="due-date"
              type="date"
              value={formData.due_date}
              onChange={(e) => handleChange('due_date', e.target.value)}
              className={errors.due_date ? 'border-red-500' : ''}
            />
            {errors.due_date && (
              <p className="text-sm text-red-500">Due date is required</p>
            )}
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
      )}

      <div className="flex justify-end gap-2">
        {step === 1 ? (
          <>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="button" onClick={handleNextStep}>
              Next
            </Button>
          </>
        ) : (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevStep}
              disabled={isSubmitting}
            >
              Back
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Issue'
              )}
            </Button>
          </>
        )}
      </div>
    </form>
  )
}
