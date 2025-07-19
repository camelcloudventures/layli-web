'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { IssueCategory, IssuePriority } from '@/lib/types/issue-types'
import SelectIssueCategory from './select-issue-category'
import ReportIssue from './report-issue'
import { Assignee, User } from '@/types/types'
import SubmitBtn from '@/components/custom/submit-btn'
import { createIssue } from '../actions/actions'

interface ReportIssueFormProps {
  users: User[]
  onCancel: () => void
}

export function ReportIssueForm({ users, onCancel }: ReportIssueFormProps) {
  const [category, setCategory] = useState<IssueCategory>('safety')
  const [priority, setPriority] = useState<IssuePriority>('medium')
  const [selectedAssignees, setSelectedAssignees] = useState<Assignee[]>([])
  const [date, setDate] = useState<Date | undefined>(undefined)

  const [step, setStep] = useState(1)

  function handleDateSelect(selectedDate: Date | undefined) {
    setDate(selectedDate)
  }

  const handleNextStep = () => {
    //Validate step 1
    if (step === 1) {
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

  const handleSubmit = async (formData: FormData) => {
    formData.append('category', category)
    formData.append('priority', priority)

    formData.append('date', date?.toISOString() || '')

    await createIssue(formData, selectedAssignees)
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {step === 1 && (
        <SelectIssueCategory category={category} setCategory={setCategory} />
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
