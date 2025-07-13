'use client'

import { useState, useRef, useCallback } from 'react'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Upload,
  X,
  File,
  ImageIcon,
  FileText,
  Music,
  Video,
  Archive,
} from 'lucide-react'
import type { Question, Response } from '@/lib/types/inspection-types'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface FileFieldProps {
  question: Question
  response?: Response
  onResponse: (value: string, files?: File[]) => void
  isDisabled?: boolean
}

interface FileWithPreview extends File {
  preview?: string
  id: string
}

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return ImageIcon
  if (type.startsWith('video/')) return Video
  if (type.startsWith('audio/')) return Music
  if (
    type.includes('pdf') ||
    type.includes('document') ||
    type.includes('text')
  )
    return FileText
  if (type.includes('zip') || type.includes('rar') || type.includes('tar'))
    return Archive
  return File
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function FileField({
  question,
  response,
  onResponse,
  isDisabled,
}: FileFieldProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const attachments = response?.file_attachments || []
  const maxFiles = 1 // Since the current system handles single file
  const maxSize = 10 // 10MB max size
  const acceptedTypes = ['image/*', 'application/pdf', '.doc', '.docx', '.txt']

  const processFiles = useCallback(
    (fileList: FileList) => {
      const newFiles: FileWithPreview[] = []

      Array.from(fileList).forEach((file) => {
        if (file.size > maxSize * 1024 * 1024) {
          toast.error(
            `File ${file.name} is too large. Maximum size is ${maxSize}MB.`,
          )
          return
        }

        const fileWithPreview: FileWithPreview = {
          ...file,
          id: Math.random().toString(36).substr(2, 9),
        }

        if (file.type.startsWith('image/')) {
          fileWithPreview.preview = URL.createObjectURL(file)
        }

        newFiles.push(fileWithPreview)
      })

      setFiles(newFiles.slice(0, maxFiles))
    },
    [maxFiles, maxSize],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      if (isDisabled) return

      const droppedFiles = e.dataTransfer.files
      if (droppedFiles.length > 0) {
        processFiles(droppedFiles)
      }
    },
    [processFiles, isDisabled],
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
      const selectedFiles = e.target.files
      if (selectedFiles && selectedFiles.length > 0) {
        processFiles(selectedFiles)
      }
    },
    [processFiles],
  )

  const removeFile = useCallback((fileId: string) => {
    setFiles((prev) => {
      const updated = prev.filter((f) => f.id !== fileId)
      const fileToRemove = prev.find((f) => f.id === fileId)
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview)
      }
      return updated
    })
  }, [])

  const handleUpload = async () => {
    if (files.length === 0) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Simulate upload progress while actually sending the file
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + 10
        })
      }, 200)

      // Send the file to the parent component
      onResponse('', files)

      // Clean up
      toast.success('File uploaded successfully')

      // Reset after successful upload
      setTimeout(() => {
        setFiles([])
        setUploadProgress(0)
        setIsUploading(false)
      }, 1000)
    } catch (error) {
      toast.error('Failed to upload file')
      console.error('Upload error:', error)
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Label htmlFor={question.id.toString()}>{question.text}</Label>

      {/* Current File Display */}
      {attachments.length > 0 && (
        <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/30">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {attachments[0].filename}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(attachments[0].file_size || 0)}
            </p>
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
        <p className="text-sm text-muted-foreground mb-4">Max {maxSize}MB</p>
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
      />

      {/* File Preview */}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Selected File</h4>
            {!isUploading && (
              <Button size="sm" onClick={handleUpload} className="h-8">
                Upload File
              </Button>
            )}
          </div>
          {files.map((file) => {
            const FileIcon = getFileIcon(file.type)
            return (
              <div
                key={file.id}
                className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30"
              >
                {file.preview ? (
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="h-10 w-10 object-cover rounded"
                  />
                ) : (
                  <FileIcon className="h-10 w-10 text-muted-foreground" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                {!isUploading && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Uploading file...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="w-full" />
        </div>
      )}
    </div>
  )
}
