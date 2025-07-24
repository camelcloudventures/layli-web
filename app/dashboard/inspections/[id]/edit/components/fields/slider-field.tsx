'use client'

import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import type { Question, Response } from '@/lib/types/inspection-types'

interface SliderFieldProps {
  question: Question
  response?: Response
  onResponse: (value: string) => void
  isDisabled?: boolean
}

export function SliderField({
  question,
  response,
  onResponse,
  isDisabled,
}: SliderFieldProps) {
  const value = response?.response_value
    ? parseFloat(response.response_value)
    : question.min_value || 0
  const min = question.min_value || 0
  const max = question.max_value || 100
  const step = question.step_value || 1

  const handleValueChange = (values: number[]) => {
    onResponse(values[0].toString())
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={question.id.toString()}>{question.text}</Label>
      <div className="flex items-center space-x-4">
        <Slider
          id={question.id.toString()}
          min={min}
          max={max}
          step={step}
          value={[value]}
          onValueChange={handleValueChange}
          disabled={isDisabled}
        />
        <span className="font-semibold w-12 text-center">{value}</span>
      </div>
    </div>
  )
}
