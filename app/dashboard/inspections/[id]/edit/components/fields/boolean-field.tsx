'use client'

import { Label } from '@/components/ui/label'
import type { Question, Response } from '@/lib/types/inspection-types'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface BooleanFieldProps {
  question: Question
  response?: Response
  onResponse: (value: string) => void
  isDisabled?: boolean
}

export function BooleanField({
  question,
  response,
  onResponse,
  isDisabled,
}: BooleanFieldProps) {
  const selectedValue = response?.response_value || ''

  return (
    <div className="space-y-2">
      <Label>{question.text}</Label>
      <RadioGroup
        value={selectedValue}
        onValueChange={onResponse}
        className="flex space-x-4"
        disabled={isDisabled}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Yes" id={`${question.id}-yes`} />
          <Label htmlFor={`${question.id}-yes`}>Yes</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="No" id={`${question.id}-no`} />
          <Label htmlFor={`${question.id}-no`}>No</Label>
        </div>
      </RadioGroup>
    </div>
  )
}
