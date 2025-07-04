'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { FileImage, FileUp, X } from 'lucide-react'
import Image from 'next/image'
import type { Question, Response } from '@/lib/types/inspection-types'

interface FileFieldProps {
  question: Question
  response?: Response
  onResponse: (value: string, files?: File[]) => void
}

export function FileField({ question, onResponse }: FileFieldProps) {
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const isPhoto = question.field_type === 'PHOTO'

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    if (selectedFiles.length === 0) return

    // Create object URLs for previews
    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file))
    setPreviews((prev) => [...prev, ...newPreviews])
    setFiles((prev) => [...prev, ...selectedFiles])

    // Pass files to parent component
    onResponse('files_attached', selectedFiles)
  }

  const removeFile = (index: number) => {
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(previews[index])

    const newFiles = files.filter((_, i) => i !== index)
    const newPreviews = previews.filter((_, i) => i !== index)

    setFiles(newFiles)
    setPreviews(newPreviews)

    if (newFiles.length === 0) {
      onResponse('')
    } else {
      onResponse('files_attached', newFiles)
    }
  }

  return (
    <div className="space-y-2">
      <Label>
        {question.text}
        {question.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="space-y-4">
        {/* File Input */}
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor={`question-${question.id}`}
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 border-muted hover:bg-muted"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {isPhoto ? (
                <FileImage className="w-8 h-8 mb-3 text-muted-foreground" />
              ) : (
                <FileUp className="w-8 h-8 mb-3 text-muted-foreground" />
              )}
              <p className="mb-2 text-sm text-muted-foreground">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-muted-foreground">
                {isPhoto ? 'PNG, JPG or WEBP' : 'PDF, DOC, or other files'}
              </p>
            </div>
            <input
              id={`question-${question.id}`}
              name="response_value"
              type="file"
              className="hidden"
              accept={isPhoto ? 'image/*' : undefined}
              multiple
              onChange={handleFileChange}
            />
          </label>
        </div>

        {/* Preview Area */}
        {files.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {files.map((file, index) => (
              <div key={index} className="relative group">
                {isPhoto && previews[index] ? (
                  <div className="relative aspect-square">
                    <Image
                      src={previews[index]}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="flex items-center p-3 bg-muted rounded-lg">
                    <FileUp className="h-4 w-4 mr-2" />
                    <span className="text-sm truncate">{file.name}</span>
                  </div>
                )}
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
