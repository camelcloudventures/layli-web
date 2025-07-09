'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'
import type { Question, Response } from '@/lib/types/inspection-types'

interface SelectFieldProps {
  question: Question
  response?: Response
  onResponse: (value: string | string[]) => void
}

export function SelectField({
  question,
  response,
  onResponse,
}: SelectFieldProps) {
  const selectedOptions = response?.selected_options || []
  const isMultiple = question.multiple_selection

  const handleSelect = (value: string) => {
    if (isMultiple) {
      const optionId = parseInt(value)
      const newSelected = selectedOptions.includes(optionId)
        ? selectedOptions.filter((id) => id !== optionId)
        : [...selectedOptions, optionId]

      onResponse(newSelected.map(String))
    } else {
      onResponse(value)
    }
  }

  if (isMultiple) {
    return (
      <div className="space-y-2">
        <Label>
          {question.text}
          {question.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <div className="space-y-2">
          {question.response_options.map((option) => (
            <div
              // @ts-expect-error - option.id is not typed
              key={option.id}
              className={`
                flex items-center justify-between p-2 rounded-md cursor-pointer
                ${
                  // @ts-expect-error - option.id is not typed
                  selectedOptions.includes(option.id)
                    ? 'bg-primary/10 border border-primary/20'
                    : 'bg-muted/50 border border-muted hover:bg-muted'
                }
              `}
              // @ts-expect-error - option.id is not typed
              onClick={() => handleSelect(option.id.toString())}
            >
              <span className="flex items-center space-x-2">
                <Badge
                  variant="outline"
                  className={option.color ? `border-${option.color}-500` : ''}
                >
                  {option.code}
                </Badge>
                <span>{option.label}</span>
              </span>
              {/* @ts-expect-error - option.id is not typed */}
              {selectedOptions.includes(option.id ?? 0) && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={`question-${question.id}`}>
        {question.text}
        {question.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Select
        name="response_value"
        value={response?.response_value || ''}
        onValueChange={handleSelect}
      >
        <SelectTrigger id={`question-${question.id}`}>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          {question.response_options.map((option) => (
            // @ts-expect-error - option.id is not typed
            <SelectItem key={option.id} value={option.id.toString()}>
              <div className="flex items-center space-x-2">
                <Badge
                  variant="outline"
                  className={option.color ? `border-${option.color}-500` : ''}
                >
                  {option.code}
                </Badge>
                <span>{option.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
