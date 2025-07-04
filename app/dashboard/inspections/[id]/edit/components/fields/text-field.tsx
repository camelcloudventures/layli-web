'use client'

import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import type { Question, Response } from '@/lib/types/inspection-types'

interface TextFieldProps {
  question: Question
  response?: Response
  onResponse: (value: string) => void
}

export function TextField({ question, response, onResponse }: TextFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={`question-${question.id}`}>
        {question.text}
        {question.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Textarea
        id={`question-${question.id}`}
        name="response_value"
        value={response?.response_value || ''}
        onChange={(e) => onResponse(e.target.value)}
        placeholder="Enter your response..."
        className="min-h-[100px]"
      />
    </div>
  )
}
