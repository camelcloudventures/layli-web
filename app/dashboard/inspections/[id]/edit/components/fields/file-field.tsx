'use client'

import { Label } from '@/components/ui/label'
import type { Question, Response } from '@/lib/types/inspection-types'
import { Input } from '@/components/ui/input'

interface FileFieldProps {
  question: Question
  response?: Response
  onResponse: (value: string, files?: File[]) => void
  isDisabled?: boolean
}

export function FileField({
  question,
  response,
  onResponse,
  isDisabled,
}: FileFieldProps) {
  const attachments = response?.file_attachments || []

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      onResponse('', [selectedFile])
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={question.id.toString()}>{question.text}</Label>
      {attachments.length > 0 && (
        <div className="text-sm">
          <p>Current file: {attachments[0].filename}</p>
        </div>
      )}
      <Input
        id={question.id.toString()}
        type="file"
        onChange={handleFileChange}
        disabled={isDisabled}
      />
    </div>
  )
}
