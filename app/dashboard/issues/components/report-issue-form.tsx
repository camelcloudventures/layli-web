'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { IssueCategory, IssuePriority } from '@/lib/types/issue-types'
import SelectIssueCategory from './select-issue-category'
import ReportIssue from './report-issue'
import { Assignee, User } from '@/lib/types'
import SubmitBtn from '@/components/custom/submit-btn'
import { createIssue } from '../actions/actions'
import { toast } from 'sonner'
import { useAuth } from '@/lib/context/auth-provider'

interface ReportIssueFormProps {
  users: User[]
  onCancel: () => void
}

export function ReportIssueForm({ users, onCancel }: ReportIssueFormProps) {
  const { user: currentUser } = useAuth()
  const [category, setCategory] = useState<IssueCategory>('safety')
  const [priority, setPriority] = useState<IssuePriority>('medium')
  const [title, setTitle] = useState('')
  const [selectedAssignees, setSelectedAssignees] = useState<Assignee[]>([])
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [uploadedImages, setUploadedImages] = useState<
    { uploadedUrl: string; originalFileName: string }[]
  >([])

  const [step, setStep] = useState(1)

  function handleDateSelect(selectedDate: Date | undefined) {
    setDate(selectedDate)
  }

  const handleNextStep = () => {
    //Validate step 1
    if (step === 1) {
      if (!title.trim()) {
        toast.error('Please enter a title for this issue')
        return
      }
      if (!category) {
        toast.error('Please select a category for this issue')
        return
      }
      setStep(2)
    }
  }

  const handlePrevStep = () => {
    if (step === 2) {
      setStep(1)
    }
  }
  console.log('selectedAssignees', selectedAssignees)

  console.log('selectedDate', date)
  console.log('uploadedImages', uploadedImages)
  console.log('currentUser', currentUser)

  const handleSubmit = async (formData: FormData) => {
    formData.append('category', category)
    formData.append('priority', priority)
    formData.append('title', title)
    formData.append('date', date?.toISOString() || '')

    // Add uploaded images to form data
    if (uploadedImages.length > 0) {
      formData.append('images', JSON.stringify(uploadedImages))
    }

    const reporter = {
      id: currentUser?.id || '',
      full_name: currentUser?.full_name || '',
      email: currentUser?.email || '',
      role: currentUser?.role || '',
    }

    const response = await createIssue(formData, selectedAssignees, reporter)
    if (response.success) {
      toast.success(response.success)
      onCancel()
    } else {
      toast.error(response.error)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {step === 1 && (
        <SelectIssueCategory
          category={category}
          setCategory={setCategory}
          title={title}
          setTitle={setTitle}
        />
      )}

      {step === 2 && (
        <ReportIssue
          priority={priority}
          setPriority={setPriority}
          users={users}
          selectedAssignees={selectedAssignees}
          setSelectedAssignees={setSelectedAssignees}
          date={date}
          setDate={handleDateSelect}
          onImagesChange={setUploadedImages}
        />
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
            <Button type="button" variant="outline" onClick={handlePrevStep}>
              Back
            </Button>
            <SubmitBtn label="Submit Issue" variant="default" className="" />
          </>
        )}
      </div>
    </form>
  )
}
