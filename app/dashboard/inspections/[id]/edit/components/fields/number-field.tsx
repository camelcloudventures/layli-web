'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Question, Response } from '@/lib/types/inspection-types'
import { useState, useEffect } from 'react'

interface NumberFieldProps {
  question: Question
  response?: Response
  onResponse: (value: number) => void
  isDisabled?: boolean
}

export function NumberField({
  question,
  response,
  onResponse,
  isDisabled,
}: NumberFieldProps) {
  // Use local state to manage the input value as a string
  const [inputValue, setInputValue] = useState(
    response?.response_value?.toString() || '',
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleInputBlur = () => {
    const numericValue = parseFloat(inputValue)
    if (!isNaN(numericValue)) {
      onResponse(numericValue)
    }
  }

  // Effect to update local state if the response prop changes from the parent
  useEffect(() => {
    setInputValue(response?.response_value?.toString() || '')
  }, [response?.response_value])

  return (
    <div className="space-y-2">
      <Label htmlFor={question.id.toString()}>{question.text}</Label>
      <Input
        id={question.id.toString()}
        type="number"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        placeholder="Enter a number"
        disabled={isDisabled}
      />
    </div>
  )
}
