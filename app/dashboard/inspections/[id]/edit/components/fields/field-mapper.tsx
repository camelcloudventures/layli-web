'use client'

import { Badge } from '@/components/ui/badge'
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
import { User } from '@/types/types'

interface ExtendedFile {
  questionId?: number
  fileName?: string
  file_path?: string
  file_size?: number
  mime_type?: string
}

interface FieldMapperProps {
  question: Question
  response?: Response
  onResponse: (
    value: string | string[] | LocationResponse,
    files?: File[],
  ) => void
  hasUnsavedChanges?: boolean
  isDisabled?: boolean
  fileAttachments: ExtendedFile[]
  setFileAttachments: (files: ExtendedFile[]) => void
  users?: User[]
}

export function FieldMapper({
  question,
  response,
  onResponse,
  hasUnsavedChanges,
  isDisabled,
  fileAttachments,
  setFileAttachments,
  users = [],
}: FieldMapperProps) {
  const handleNumberResponse = (value: number) => {
    onResponse(value.toString())
  }

  const handleSelectResponse = (value: string | string[]) => {
    // Pass the array directly to onResponse for SELECT fields
    onResponse(value)
  }

  const handlePersonResponse = (value: string | string[]) => {
    // Pass the array directly to onResponse for PERSON fields
    onResponse(value)
  }

  const renderField = () => {
    switch (question.field_type) {
      case 'TEXT':
        return (
          <TextField
            question={question}
            response={response}
            onResponse={onResponse}
            isDisabled={isDisabled}
          />
        )
      case 'NUMBER':
        return (
          <NumberField
            question={question}
            response={response}
            onResponse={handleNumberResponse}
            isDisabled={isDisabled}
          />
        )
      case 'BOOLEAN':
        return (
          <BooleanField
            question={question}
            response={response}
            onResponse={onResponse}
            isDisabled={isDisabled}
          />
        )
      case 'DATE':
        return (
          <DateField
            question={question}
            response={response}
            onResponse={onResponse}
            isDisabled={isDisabled}
          />
        )
      case 'LOCATION':
        return (
          <LocationField
            question={question}
            response={response}
            onResponse={onResponse}
            isDisabled={isDisabled}
          />
        )
      case 'PERSON':
        return (
          <PersonField
            question={question}
            response={response}
            onResponse={handlePersonResponse}
            isDisabled={isDisabled}
            users={users}
          />
        )
      case 'SELECT':
      case 'MULTI_SELECT':
        return (
          <SelectField
            question={question}
            response={response}
            onResponse={handleSelectResponse}
            isDisabled={isDisabled}
          />
        )
      case 'SIGNATURE':
        return (
          <SignatureField
            question={question}
            response={response}
            onResponse={onResponse}
            isDisabled={isDisabled}
          />
        )
      case 'SLIDER':
        return (
          <SliderField
            question={question}
            response={response}
            onResponse={onResponse}
            isDisabled={isDisabled}
          />
        )
      case 'PHOTO':
      case 'ASSET':
        return (
          <FileField
            question={question}
            onResponse={onResponse}
            isDisabled={isDisabled}
            fileAttachments={fileAttachments}
            setFileAttachments={setFileAttachments}
          />
        )
      default:
        return (
          <TextField
            question={question}
            response={response}
            onResponse={onResponse}
            isDisabled={isDisabled}
          />
        )
    }
  }

  return (
    <div className="space-y-4 ">
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
          </div>
        )}
      </div>
    </div>
  )
}
