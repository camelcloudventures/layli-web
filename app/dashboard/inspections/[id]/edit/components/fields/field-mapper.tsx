'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Save } from 'lucide-react'
import { BooleanField } from './boolean-field'
import { DateField } from './date-field'
import { LocationField } from './location-field'
import { NumberField } from './number-field'
import { PersonField } from './person-field'
import { SelectField } from './select-field'
import { SignatureField } from './signature-field'
import { SliderField } from './slider-field'
import { TextField } from './text-field'
import { FileField } from './file-field'
import type {
  Question,
  Response,
  LocationResponse,
} from '@/lib/types/inspection-types'

interface FieldMapperProps {
  question: Question
  response?: Response
  onResponse: (value: string | LocationResponse, files?: File[]) => void
  onSave?: (questionId: number) => Promise<void>
  hasUnsavedChanges?: boolean
  isSaving?: boolean
}

export function FieldMapper({
  question,
  response,
  onResponse,
  onSave,
  hasUnsavedChanges,
  isSaving,
}: FieldMapperProps) {
  const handleNumberResponse = (value: number) => {
    onResponse(value.toString())
  }

  const handleSelectResponse = (value: string | string[]) => {
    if (Array.isArray(value)) {
      onResponse(value.join(','))
    } else {
      onResponse(value)
    }
  }

  const renderField = () => {
    switch (question.field_type) {
      case 'TEXT':
        return (
          <TextField
            question={question}
            response={response}
            onResponse={onResponse}
          />
        )
      case 'NUMBER':
        return (
          <NumberField
            question={question}
            response={response}
            onResponse={handleNumberResponse}
          />
        )
      case 'BOOLEAN':
        return (
          <BooleanField
            question={question}
            response={response}
            onResponse={onResponse}
          />
        )
      case 'DATE':
        return (
          <DateField
            question={question}
            response={response}
            onResponse={onResponse}
          />
        )
      case 'LOCATION':
        return (
          <LocationField
            question={question}
            response={response}
            onResponse={onResponse}
          />
        )
      case 'PERSON':
        return (
          <PersonField
            question={question}
            response={response}
            onResponse={onResponse}
          />
        )
      case 'SELECT':
      case 'MULTI_SELECT':
        return (
          <SelectField
            question={question}
            response={response}
            onResponse={handleSelectResponse}
          />
        )
      case 'SIGNATURE':
        return (
          <SignatureField
            question={question}
            response={response}
            onResponse={onResponse}
          />
        )
      case 'SLIDER':
        return (
          <SliderField
            question={question}
            response={response}
            onResponse={onResponse}
          />
        )
      case 'PHOTO':
      case 'ASSET':
        return (
          <FileField
            question={question}
            response={response}
            onResponse={onResponse}
          />
        )
      default:
        return (
          <TextField
            question={question}
            response={response}
            onResponse={onResponse}
          />
        )
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">{renderField()}</div>
        {hasUnsavedChanges && (
          <div className="flex items-center gap-2 pt-2">
            <Badge
              variant="outline"
              className="bg-yellow-50 text-yellow-700 border-yellow-200"
            >
              Unsaved
            </Badge>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onSave?.(question.id)}
              disabled={isSaving}
              className="h-7 px-2 text-xs"
            >
              <Save className="mr-1 h-3 w-3" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
