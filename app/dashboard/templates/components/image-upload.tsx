'use client'

import type React from 'react'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

interface ImageUploadProps {
  value: string
  onChange: (value: string) => void
  label?: string
  accept?: string
}

export function ImageUpload({
  value,
  onChange,
  label,
  accept = 'image/*',
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setError('File must be 5MB or less.')
      onChange('')
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }
    setError(null)
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (event) => {
      onChange((event.target?.result ?? '') as string)
    }
    reader.readAsDataURL(file)
  }

  function handleRemove() {
    onChange('')
    setFileName(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function handleTriggerInput() {
    fileInputRef.current?.click()
  }

  // Helper: is the value an image data URL?
  function isImage(val: string) {
    return val.startsWith('data:image')
  }

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      {label && <span className="font-medium mb-2">{label}</span>}
      {error && (
        <span className="text-red-600 text-sm font-semibold mb-2">{error}</span>
      )}
      {value ? (
        isImage(value) ? (
          <>
            <Image
              src={value}
              alt="Uploaded preview"
              width={1200}
              height={400}
              className="rounded border w-full h-72 object-cover mb-4"
            />
            <div className="flex gap-2 justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={handleRemove}
                aria-label="Remove file"
              >
                Remove
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleTriggerInput}
                aria-label="Change file"
              >
                Change
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center w-full mb-4">
              <div className="flex items-center gap-2">
                <svg
                  width="32"
                  height="32"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-gray-400"
                  viewBox="0 0 24 24"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                <span className="text-base">{fileName || 'Uploaded file'}</span>
              </div>
            </div>
            <div className="flex gap-2 justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={handleRemove}
                aria-label="Remove file"
              >
                Remove
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleTriggerInput}
                aria-label="Change file"
              >
                Change
              </Button>
            </div>
          </>
        )
      ) : (
        <div
          className="border rounded-xl p-6 flex flex-col items-center justify-center min-h-[120px] w-full cursor-pointer"
          tabIndex={0}
          aria-label="Upload file"
          onClick={handleTriggerInput}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleTriggerInput()
          }}
        >
          <span className="text-muted-foreground mb-2">
            Click to upload or drag and drop
          </span>
          <span className="text-xs text-muted-foreground">
            Any file type (max. 5MB)
          </span>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
        tabIndex={-1}
        aria-label="Upload file"
      />
    </div>
  )
}
