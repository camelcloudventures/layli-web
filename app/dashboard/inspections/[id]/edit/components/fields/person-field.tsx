'use client'

import { Label } from '@/components/ui/label'
import type { Question, Response } from '@/lib/types/inspection-types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface PersonFieldProps {
  question: Question
  response?: Response
  onResponse: (value: string) => void
  options?: { value: string; label: string }[]
  isDisabled?: boolean
}

export function PersonField({
  question,
  response,
  onResponse,
  options = [],
  isDisabled,
}: PersonFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={question.id.toString()}>{question.text}</Label>
      <Select
        value={response?.response_value || ''}
        onValueChange={onResponse}
        disabled={isDisabled}
      >
        <SelectTrigger id={question.id.toString()}>
          <SelectValue placeholder="Select a person" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
