'use client'

import { Label } from '@/components/ui/label'
import { useState } from 'react'
import type { Question, Response } from '@/lib/types/inspection-types'
import { getTextColor } from '../../utils/utils'

interface SelectFieldProps {
  question: Question
  response?: Response
  onResponse: (value: string | string[]) => void
  isDisabled?: boolean
}

export function SelectField({
  question,
  response,
  onResponse,
  isDisabled,
}: SelectFieldProps) {
  // Local state to track selected options for immediate UI updates
  const [localSelectedOptions, setLocalSelectedOptions] = useState<number[]>(
    response?.selected_options || [],
  )
  const isMultiple = question.field_type === 'MULTI_SELECT'

  const handleSelect = (value: string) => {
    if (isDisabled) return // Don't allow selection if disabled

    const optionId = parseInt(value)

    if (isMultiple) {
      const newSelected = localSelectedOptions.includes(optionId)
        ? localSelectedOptions.filter((id) => id !== optionId)
        : [...localSelectedOptions, optionId]

      setLocalSelectedOptions(newSelected)
      onResponse(newSelected.map(String))
    } else {
      // For single select, replace the selection
      const newSelected = [optionId]
      setLocalSelectedOptions(newSelected)
      onResponse(newSelected.map(String))
    }
  }

  if (isMultiple) {
    return (
      <div className="space-y-2">
        <Label>
          {question.text}
          {question.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <div className="flex flex-wrap gap-2">
          {question.response_options.map((option) => {
            const isSelected = localSelectedOptions.includes(option.id)

            return (
              <button
                key={option.id}
                type="button"
                disabled={isDisabled}
                className={`
                  px-4 py-2 rounded-md border transition-all duration-200 font-medium
                  ${
                    isDisabled
                      ? 'opacity-50 cursor-not-allowed'
                      : isSelected
                      ? 'border-transparent'
                      : 'text-black border-gray-300 bg-white hover:bg-gray-50'
                  }
                `}
                style={{
                  backgroundColor: isSelected ? option.color : undefined,
                  borderColor: isSelected ? option.color : undefined,
                  color: isSelected ? getTextColor(option.color) : undefined,
                }}
                onClick={() => handleSelect(option.id.toString())}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // Single select - display as horizontal buttons
  return (
    <div className="space-y-2">
      <Label>
        {question.text}
        {question.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="flex flex-wrap gap-2">
        {question.response_options.map((option) => {
          const isSelected = localSelectedOptions.includes(option.id)

          return (
            <button
              key={option.id}
              type="button"
              disabled={isDisabled}
              className={`
                px-4 py-2 rounded-md border transition-all duration-200 font-medium
                ${
                  isDisabled
                    ? 'opacity-50 cursor-not-allowed'
                    : isSelected
                    ? 'border-transparent'
                    : 'text-black border-gray-300 bg-white hover:bg-gray-50'
                }
              `}
              style={{
                backgroundColor: isSelected ? option.color : undefined,
                borderColor: isSelected ? option.color : undefined,
                color: isSelected ? getTextColor(option.color) : undefined,
              }}
              onClick={() => handleSelect(option.id.toString())}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
