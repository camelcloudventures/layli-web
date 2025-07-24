'use client'

import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import type { Question, Response } from '@/lib/types/inspection-types'
import { useState, useEffect } from 'react'

interface DateFieldProps {
  question: Question
  response?: Response
  onResponse: (value: string) => void
  isDisabled?: boolean
}

export function DateField({
  question,
  response,
  onResponse,
  isDisabled,
}: DateFieldProps) {
  const [date, setDate] = useState<Date | undefined>(
    response?.response_value ? new Date(response.response_value) : undefined,
  )

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    if (selectedDate) {
      onResponse(selectedDate.toISOString())
    }
  }

  useEffect(() => {
    setDate(
      response?.response_value ? new Date(response.response_value) : undefined,
    )
  }, [response?.response_value])

  return (
    <div className="space-y-2 ">
      <Label>{question.text}</Label>
      <div className="border rounded-lg w-fit p-3">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          disabled={isDisabled}
          className="rounded-md w-fit"
        />
      </div>
    </div>
  )
}
