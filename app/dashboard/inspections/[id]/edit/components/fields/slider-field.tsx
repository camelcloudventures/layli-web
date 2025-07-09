'use client'

import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import type { Question, Response } from '@/lib/types/inspection-types'

interface SliderFieldProps {
  question: Question
  response?: Response
  onResponse: (value: string) => void
}

export function SliderField({
  question,
  response,
  onResponse,
}: SliderFieldProps) {
  const value = response?.response_value
    ? parseFloat(response.response_value)
    : 0
  const min = question.min_value ?? 0
  const max = question.max_value ?? 100
  const step = question.step_value ?? 1

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor={`question-${question.id}`}>
          {question.text}
          {question.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <span className="text-sm font-medium">
          {value}
          {/* @ts-expect-error - unit is not typed */}
          {question.unit && ` ${question.unit}`}
        </span>
      </div>
      <Slider
        id={`question-${question.id}`}
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={([newValue]) => onResponse(String(newValue))}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>
          {min}
          {/* @ts-expect-error - unit is not typed */}
          {question.unit && ` ${question.unit}`}
        </span>
        <span>
          {max}
          {/* @ts-expect-error - unit is not typed */}
          {question.unit && ` ${question.unit}`}
        </span>
      </div>
    </div>
  )
}
