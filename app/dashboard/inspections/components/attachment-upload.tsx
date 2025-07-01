'use client'

import type React from 'react'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Paperclip, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface AttachmentUploadProps {
  onAttach: (filename: string) => void
  value?: string
  onRemove: () => void
}

export function AttachmentUpload({
  onAttach,
  value,
  onRemove,
}: AttachmentUploadProps) {
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Simulate file upload
    try {
      setIsUploading(true)

      // In a real app, you would upload the file to your storage here
      await new Promise((resolve) => setTimeout(resolve, 1500))

      onAttach(file.name)
      toast.success(`${file.name} has been uploaded successfully.`)
    } catch (error) {
      console.error('Error uploading file:', error)
      toast.error('There was an error uploading your file.')
    } finally {
      setIsUploading(false)
    }
  }

  if (value) {
    return (
      <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
        <Paperclip size={16} />
        <span className="text-sm flex-grow truncate">{value}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="h-6 w-6 p-0"
        >
          <X size={14} />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isUploading}
        onClick={() => document.getElementById('file-upload')?.click()}
        className="w-full"
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Paperclip className="mr-2 h-4 w-4" />
            Attach File
          </>
        )}
      </Button>
    </div>
  )
}
