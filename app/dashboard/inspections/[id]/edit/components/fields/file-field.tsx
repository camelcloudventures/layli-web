'use client'

import { Label } from '@/components/ui/label'
import { FileUploader } from '@/components/custom/file-uploader'
import type { Question, LocationResponse } from '@/lib/types/inspection-types'
import { toast } from 'sonner'
import { attachInspectionFile, deleteInspectionFile } from '@/utils/common'
import { Button } from '@/components/ui/button'
import { LucideTrash2, Paperclip, PencilIcon } from 'lucide-react'
import { useState } from 'react'
import { Progress } from '@/components/ui/progress'

interface FileMetadata {
  fileName: string
  file_path: string
  file_size: number
  mime_type: string
  questionId: number
}

interface ExtendedFile extends File {
  questionId?: number
  fileName?: string
  file_path?: string
  file_size?: number
  mime_type?: string
}

interface FileFieldProps {
  question: Question
  onResponse: (value: string | LocationResponse, files?: FileMetadata[]) => void
  isDisabled?: boolean
  fileAttachments: ExtendedFile[]
  setFileAttachments: (files: ExtendedFile[]) => void
}

export function FileField({
  question,
  onResponse,
  isDisabled,
  fileAttachments,
  setFileAttachments,
}: FileFieldProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showUploader, setShowUploader] = useState(false)

  // Find file metadata for this question
  const questionFile = fileAttachments.find(
    (file) => file.questionId === question.id,
  )

  async function handleUpload(selectedFile: File) {
    try {
      setIsUploading(true)
      setUploadProgress(0)

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => (prev >= 90 ? 90 : prev + 10))
      }, 200)
      const result = await attachInspectionFile(
        selectedFile,
        'inspection-attachments',
      )

      clearInterval(progressInterval)

      if (result.success && result.fileData) {
        setUploadProgress(100)

        const fileWithQuestion: ExtendedFile = Object.assign(selectedFile, {
          ...result.fileData,
          questionId: question.id,
        })

        // Remove any existing file for this question and add the new one
        setFileAttachments([
          ...fileAttachments.filter((file) => file.questionId !== question.id),
          fileWithQuestion,
        ])

        onResponse(result.fileData.file_path, [result.fileData as FileMetadata])
        toast.success('File uploaded successfully')
        setShowUploader(false)
      } else if (result.error) {
        toast.error(result.error)
      }
    } catch {
      toast.error('Failed to upload file')
    } finally {
      setTimeout(() => {
        setIsUploading(false)
        setUploadProgress(0)
      }, 500)
    }
  }

  async function handleRemoveFile() {
    if (!questionFile?.file_path) return

    const result = await deleteInspectionFile(
      questionFile.file_path,
      'inspection-attachments',
    )
    if (result.success) {
      setFileAttachments(
        fileAttachments.filter((file) => file.questionId !== question.id),
      )
      onResponse('', [])
      toast.success('File deleted successfully')
      setShowUploader(false)
    } else if (result.error) {
      toast.error(result.error)
    }
  }

  function handleEditClick() {
    setShowUploader(true)
  }

  return (
    <div className="space-y-4">
      <Label htmlFor={question.id.toString()}>{question.text}</Label>
      {isUploading ? (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Uploading file...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="w-full" />
        </div>
      ) : questionFile && !showUploader ? (
        <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Paperclip className="h-4 w-4" />
              <span className="text-sm font-medium truncate">
                {questionFile.fileName || questionFile.name}
              </span>
            </div>
          </div>
          {!isDisabled && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEditClick}
                className="h-8 w-8 p-0"
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveFile}
                className="h-8 w-8 p-0"
              >
                <LucideTrash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          )}
        </div>
      ) : (
        <FileUploader
          label="Choose file or drag and drop"
          isDisabled={isDisabled}
          onFileSelect={handleUpload}
        />
      )}
    </div>
  )
}
