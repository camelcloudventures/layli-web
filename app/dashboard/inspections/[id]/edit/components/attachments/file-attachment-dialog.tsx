'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import {
  FileUploader,
  FileWithPreview,
} from '@/components/custom/file-uploader'
import { attachInspectionFile } from '@/utils/common'
import { toast } from 'sonner'
import { Paperclip, LucideTrash2, PencilIcon } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

interface FileMetaType {
  filename: string
  file_path: string
  file_size: number
  mime_type: string
}

interface FileAttachmentDialogProps {
  isFileDialogOpen: boolean
  setIsFileDialogOpen: (isOpen: boolean) => void
  selectedFile: File | null
  setSelectedFile: (file: File | null) => void
  handleAttachFile1: (fileMeta: FileMetaType) => void
}

export function FileAttachmentDialog({
  isFileDialogOpen,
  setIsFileDialogOpen,
  selectedFile,
  setSelectedFile,
  handleAttachFile1,
}: FileAttachmentDialogProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showUploader, setShowUploader] = useState(true)
  const [uploadedFileMeta, setUploadedFileMeta] = useState<FileMetaType | null>(
    null,
  )

  async function handleUpload(file: File) {
    try {
      setIsUploading(true)
      setUploadProgress(0)
      setShowUploader(false)
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => (prev >= 90 ? 90 : prev + 10))
      }, 200)
      const result = await attachInspectionFile(file, 'inspection-attachments')
      clearInterval(progressInterval)
      setUploadProgress(100)
      if (result.success && result.fileData) {
        const fileWithPreview = file as FileWithPreview
        fileWithPreview.id = crypto.randomUUID()
        fileWithPreview.file_path = result.fileData.file_path
        fileWithPreview.fileName = result.fileData.fileName
        fileWithPreview.file_size = result.fileData.file_size
        fileWithPreview.mime_type = result.fileData.mime_type
        setSelectedFile(fileWithPreview)
        setUploadedFileMeta({
          filename: result.fileData.fileName,
          file_path: result.fileData.file_path,
          file_size: result.fileData.file_size,
          mime_type: result.fileData.mime_type,
        })
        toast.success('File uploaded successfully')
      } else if (result.error) {
        toast.error(result.error)
        setShowUploader(true)
      }
    } catch {
      toast.error('Failed to upload file')
      setShowUploader(true)
    } finally {
      setTimeout(() => {
        setIsUploading(false)
        setUploadProgress(0)
      }, 500)
    }
  }

  function handleAttach() {
    if (uploadedFileMeta) {
      handleAttachFile1(uploadedFileMeta)
    }
  }

  function handleClose() {
    setIsFileDialogOpen(false)
    setSelectedFile(null)
    setShowUploader(true)
    setUploadProgress(0)
    setIsUploading(false)
    setUploadedFileMeta(null)
  }

  function handleRemoveFile() {
    setSelectedFile(null)
    setShowUploader(true)
    setUploadProgress(0)
    setUploadedFileMeta(null)
  }

  function handleEditClick() {
    setShowUploader(true)
  }

  // Convert selectedFile to FileWithPreview for the FileUploader
  const fileWithPreview = selectedFile
    ? (selectedFile as FileWithPreview)
    : undefined

  return (
    <Dialog open={isFileDialogOpen} onOpenChange={handleClose}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Attach File</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {isUploading ? (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading file...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          ) : selectedFile && !showUploader ? (
            <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Paperclip className="h-4 w-4" />
                  <span className="text-sm font-medium truncate">
                    {fileWithPreview?.fileName || fileWithPreview?.name}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEditClick}
                  className="h-8 w-8 p-0"
                  aria-label="Edit file"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleEditClick()
                  }}
                >
                  <PencilIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveFile}
                  className="h-8 w-8 p-0"
                  aria-label="Remove file"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleRemoveFile()
                  }}
                >
                  <LucideTrash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ) : showUploader ? (
            <FileUploader
              label="Choose file or drag and drop"
              isDisabled={isUploading}
              onFileSelect={handleUpload}
              initialFile={fileWithPreview}
            />
          ) : null}
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleAttach}
            disabled={!uploadedFileMeta || isUploading || showUploader}
          >
            Attach
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
