import React, { useState, useRef, useCallback } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Upload, X } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

export interface FileWithPreview extends File {
  preview?: string
  id: string
  file_path?: string // for uploaded files
  fileName?: string
  file_size?: number
  mime_type?: string
}

interface FileUploaderProps {
  label?: string
  acceptedTypes?: string[]
  maxSizeMB?: number
  isDisabled?: boolean
  initialFile?: FileWithPreview
  onFileSelect?: (file: File) => void
}

export function FileUploader({
  label = '',
  acceptedTypes = ['image/*', 'application/pdf', '.doc', '.docx', '.txt'],
  maxSizeMB = 10,
  isDisabled = false,
  initialFile,
  onFileSelect,
}: FileUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [file, setFile] = useState<FileWithPreview | null>(initialFile || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = useCallback(
    (selectedFile: File) => {
      // Check file size
      if (selectedFile.size > maxSizeMB * 1024 * 1024) {
        alert(`File size must be less than ${maxSizeMB}MB`)
        return
      }

      // Create a preview for images
      const fileWithPreview = selectedFile as FileWithPreview
      fileWithPreview.id = crypto.randomUUID()

      if (selectedFile.type.startsWith('image/')) {
        fileWithPreview.preview = URL.createObjectURL(selectedFile)
      }

      setFile(fileWithPreview)
      onFileSelect?.(selectedFile)
    },
    [maxSizeMB, onFileSelect],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      if (isDisabled) return
      const droppedFile = e.dataTransfer.files[0] // Only take the first file
      if (droppedFile) {
        handleFileUpload(droppedFile)
      }
    },
    [isDisabled, handleFileUpload],
  )

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      if (!isDisabled) setIsDragOver(true)
    },
    [isDisabled],
  )

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0] // Only take the first file
      if (selectedFile) {
        handleFileUpload(selectedFile)
      }
    },
    [handleFileUpload],
  )

  const removeFile = useCallback(() => {
    if (file?.preview) {
      URL.revokeObjectURL(file.preview)
    }
    setFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [file])

  return (
    <div className="space-y-4">
      {label && <Label>{label}</Label>}
      {/* Current File Display */}
      {file && (
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30">
            {file.preview ? (
              <Image
                src={file.preview}
                alt={file.name || file.fileName || 'file'}
                className="h-10 w-10 object-cover rounded"
                width={40}
                height={40}
              />
            ) : file.file_path && file.mime_type?.startsWith('image/') ? (
              <Image
                src={file.file_path}
                alt={file.fileName || 'file'}
                className="h-10 w-10 object-cover rounded"
                width={40}
                height={40}
              />
            ) : null}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {file.name || file.fileName}
              </p>
              <p className="text-xs text-muted-foreground">
                {file.size || file.file_size} bytes
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={removeFile}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      {/* Drop Zone */}
      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
          isDragOver
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50',
          isDisabled && 'opacity-50 cursor-not-allowed',
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !isDisabled && fileInputRef.current?.click()}
      >
        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">
          {isDragOver ? 'Drop file here' : 'Choose file or drag and drop'}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">Max {maxSizeMB}MB</p>
        <div className="flex flex-wrap gap-1 justify-center">
          {acceptedTypes.map((type, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {type}
            </Badge>
          ))}
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleFileSelect}
        className="hidden"
        disabled={isDisabled}
      />
    </div>
  )
}
