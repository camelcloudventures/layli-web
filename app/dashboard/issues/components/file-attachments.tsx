'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Download, Loader2, Upload, X } from 'lucide-react'
import React, { useRef } from 'react'
import { Issue } from '@/lib/types'
import Image from 'next/image'

interface UploadedImage {
  id: string
  file: File
  preview: string
  uploadedUrl?: string
  isUploading?: boolean
}

interface FileAttachmentsProps {
  issue: Issue
  uploadedImages: UploadedImage[]
  pending: boolean
  handleFileUpload: (file: File) => void
  removeImage: (id: string) => void
}
export default function FileAttachments({
  issue,
  uploadedImages,
  pending,
  handleFileUpload,
  removeImage,
}: FileAttachmentsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Files & Attachments</h3>
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={pending}
        >
          {pending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload File
            </>
          )}
        </Button>
        <Input
          ref={fileInputRef}
          type="file"
          name="attachments"
          className="hidden"
          onChange={(e) =>
            e.target.files && handleFileUpload(e.target.files[0])
          }
        />
      </div>

      <div className="space-y-2">
        {issue.attachments?.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between rounded-md border p-3"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                <span className="text-xl">{'📁'}</span>
              </div>
              <div>
                <p className="font-medium">
                  {file.file_url.split('/').pop()?.slice(0, -2) || ''}
                </p>
                <p className="text-xs text-muted-foreground">
                  Uploaded {new Date(file.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <Button type="button" variant="ghost" size="icon" asChild>
              <a href={file.file_url} download>
                <Download className="h-4 w-4" />
              </a>
            </Button>
          </div>
        ))}
        {uploadedImages.map((image) => (
          <div key={image.id} className="relative group">
            <div className="aspect-square rounded-lg overflow-hidden border bg-muted">
              {image.isUploading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <Image
                  src={image.preview}
                  alt={image.file.name}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <button
              type="button"
              onClick={() => removeImage(image.id)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remove image"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </>
  )
}
