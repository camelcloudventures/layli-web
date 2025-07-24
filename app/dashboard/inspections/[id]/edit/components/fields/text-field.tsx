'use client'

import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import type { Question, Response } from '@/lib/types/inspection-types'
import { useState, useEffect } from 'react'

interface TextFieldProps {
  question: Question
  response?: Response
  onResponse: (value: string, files?: File[]) => void
  isDisabled?: boolean
}

export function TextField({
  question,
  response,
  onResponse,
  isDisabled,
}: TextFieldProps) {
  const [value, setValue] = useState(response?.response_value || '')

  const handleBlur = () => {
    onResponse(value)
  }

  useEffect(() => {
    setValue(response?.response_value || '')
  }, [response?.response_value])

  return (
    <div className="space-y-2">
      <Label htmlFor={question.id.toString()}>{question.text}</Label>
      <Textarea
        id={question.id.toString()}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        placeholder="Enter your response"
        disabled={isDisabled}
      />
    </div>
  )
}
