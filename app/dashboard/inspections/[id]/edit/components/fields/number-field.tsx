'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Question, Response } from '@/lib/types/inspection-types'
import { Minus, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'

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

  const handleIncrement = () => {
    const currentValue = Number.parseFloat(inputValue) || 0
    const newValue = currentValue + 1
    setInputValue(newValue.toString())
    onResponse(newValue)
  }

  const handleDecrement = () => {
    const currentValue = Number.parseFloat(inputValue) || 0
    const newValue = currentValue - 1
    setInputValue(newValue.toString())
    onResponse(newValue)
  }

  return (
    <div className="space-y-2 w-44">
      <Label>{question.text}</Label>
      <div className="flex items-center border rounded-md bg-background">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-10 w-10 p-0 border-0 hover:bg-muted rounded-r-none"
          onClick={handleDecrement}
          disabled={isDisabled}
          tabIndex={-1}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          id={question.id.toString()}
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          placeholder="0"
          disabled={isDisabled}
          className="border-0 text-center focus-visible:ring-0 focus-visible:ring-offset-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none rounded-none"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-10 w-10 p-0 border-0 hover:bg-muted rounded-l-none"
          onClick={handleIncrement}
          disabled={isDisabled}
          tabIndex={-1}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
