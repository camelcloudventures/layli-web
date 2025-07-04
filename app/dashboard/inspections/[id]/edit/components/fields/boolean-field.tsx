'use client'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Check, X } from 'lucide-react'
import type { Question, Response } from '@/lib/types/inspection-types'

interface BooleanFieldProps {
  question: Question
  response?: Response
  onResponse: (value: string) => void
}

export function BooleanField({
  question,
  response,
  onResponse,
}: BooleanFieldProps) {
  const value = response?.response_value

  return (
    <div className="space-y-2">
      <Label>
        {question.text}
        {question.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="flex items-center space-x-2">
        <Button
          name="response_value"
          type="button"
          variant={value === 'true' ? 'default' : 'outline'}
          className="flex-1"
          onClick={() => onResponse('true')}
        >
          <Check className="h-4 w-4 mr-2" />
          Yes
        </Button>
        <Button
          name="response_value"
          type="button"
          variant={value === 'false' ? 'default' : 'outline'}
          className="flex-1"
          onClick={() => onResponse('false')}
        >
          <X className="h-4 w-4 mr-2" />
          No
        </Button>
      </div>
    </div>
  )
}
