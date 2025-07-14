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

interface FileAttachmentDialogProps {
  isOpen: boolean
  onClose: () => void
  onAttach: (files: FileWithPreview[]) => void
}

export function FileAttachmentDialog({
  isOpen,
  onClose,
  onAttach,
}: FileAttachmentDialogProps) {
  const [selectedFile, setSelectedFile] = useState<FileWithPreview | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  async function handleUpload(file: File) {
    try {
      setIsUploading(true)
      const result = await attachInspectionFile(file, 'inspection-attachments')

      if (result.success && result.fileData) {
        const fileWithPreview = file as FileWithPreview
        fileWithPreview.file_path = result.fileData.file_path
        fileWithPreview.fileName = result.fileData.fileName
        fileWithPreview.file_size = result.fileData.file_size
        fileWithPreview.mime_type = result.fileData.mime_type

        setSelectedFile(fileWithPreview)
        toast.success('File uploaded successfully')
      } else if (result.error) {
        toast.error(result.error)
      }
    } catch {
      toast.error('Failed to upload file')
    } finally {
      setIsUploading(false)
    }
  }

  function handleAttach() {
    if (selectedFile) {
      onAttach([selectedFile])
      onClose()
      setSelectedFile(null)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Attach File</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <FileUploader
            label="Choose file or drag and drop"
            isDisabled={isUploading}
            onFileSelect={handleUpload}
            initialFile={selectedFile || undefined}
          />
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleAttach}
            disabled={!selectedFile || isUploading}
          >
            Attach
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
