'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { saveResponse } from '@/app/dashboard/inspections/actions/actions'
import type { Question } from '@/lib/types/inspection-types'

interface Props {
  inspectionId: string
  question: Question
}

export function QuestionForm({ inspectionId, question }: Props) {
  const [textValue, setTextValue] = useState('')
  const [dateValue, setDateValue] = useState<Date | null>(null)
  const [personValue, setPersonValue] = useState('')
  const [locationValue, setLocationValue] = useState('')

  const handleSaveResponse = async (value: string) => {
    try {
      const response = {
        question_id: question.id,
        value: value,
        selected_options: [],
        response_value: value,
      }

      await saveResponse(inspectionId, question.id.toString(), response)
      toast.success('Response saved')
    } catch (error) {
      console.error('Error saving response:', error)
      toast.error('Failed to save response')
    }
  }

  const renderFieldByType = () => {
    // All fields will be rendered as text input for now
    // since we need to update the field_type enum in the types
    return (
      <div className="space-y-2">
        <Label htmlFor={`question-${question.id}`}>{question.text}</Label>
        {question.field_type === 'DATE' ? (
          <Input
            id={`question-${question.id}`}
            type="date"
            value={dateValue ? format(dateValue, 'yyyy-MM-dd') : ''}
            onChange={(e) => {
              const date = e.target.value ? new Date(e.target.value) : null
              setDateValue(date)
              if (date) {
                handleSaveResponse(date.toISOString())
              }
            }}
          />
        ) : (
          <Input
            id={`question-${question.id}`}
            value={
              question.field_type === 'PERSON'
                ? personValue
                : question.field_type === 'LOCATION'
                ? locationValue
                : textValue
            }
            onChange={(e) => {
              const value = e.target.value
              if (question.field_type === 'PERSON') {
                setPersonValue(value)
              } else if (question.field_type === 'LOCATION') {
                setLocationValue(value)
              } else {
                setTextValue(value)
              }
            }}
            onBlur={(e) => handleSaveResponse(e.target.value)}
            placeholder={`Enter ${question.field_type.toLowerCase()}...`}
          />
        )}
      </div>
    )
  }

  return (
    <Card className="border rounded-lg shadow-sm">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {renderFieldByType()}
          {question.required && (
            <p className="text-sm text-red-500">* Required</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
