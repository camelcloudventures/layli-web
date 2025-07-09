'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Minus, Plus } from 'lucide-react'
import type { Question, Response } from '@/lib/types/inspection-types'

interface NumberFieldProps {
  question: Question
  response?: Response
  onResponse: (value: number) => void
}

export function NumberField({
  question,
  response,
  onResponse,
}: NumberFieldProps) {
  const currentValue = response?.response_value
    ? parseFloat(response.response_value)
    : 0
  const step = question.step_value || 1

  const handleIncrement = () => {
    const newValue = currentValue + step
    if (question.max_value === undefined || newValue <= question.max_value) {
      onResponse(newValue)
    }
  }

  const handleDecrement = () => {
    const newValue = currentValue - step
    if (question.min_value === undefined || newValue >= question.min_value) {
      onResponse(newValue)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    if (isNaN(value)) return

    if (
      (question.min_value === undefined || value >= question.min_value) &&
      (question.max_value === undefined || value <= question.max_value)
    ) {
      onResponse(value)
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={`question-${question.id}`}>
        {question.text}
        {question.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="flex items-center space-x-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleDecrement}
          disabled={
            question.min_value !== undefined &&
            currentValue <= question.min_value
          }
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          id={`question-${question.id}`}
          name="response_value"
          type="number"
          value={currentValue}
          onChange={handleChange}
          min={question.min_value}
          max={question.max_value}
          step={step}
          className="w-24 text-center"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleIncrement}
          disabled={
            question.max_value !== undefined &&
            currentValue >= question.max_value
          }
        >
          <Plus className="h-4 w-4" />
        </Button>
        {(question.min_value !== undefined ||
          question.max_value !== undefined) && (
          <span className="text-sm text-muted-foreground">
            {question.min_value !== undefined && `Min: ${question.min_value}`}
            {question.min_value !== undefined &&
              question.max_value !== undefined &&
              ' | '}
            {question.max_value !== undefined && `Max: ${question.max_value}`}
          </span>
        )}
      </div>
    </div>
  )
}
