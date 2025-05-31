'use client'

import type React from 'react'

import { useRef } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

interface ImageUploadProps {
  value: string
  onChange: (value: string) => void
  label?: string
}

export function ImageUpload({ value, onChange, label }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      onChange((event.target?.result ?? '') as string)
    }
    reader.readAsDataURL(file)
  }

  function handleRemove() {
    onChange('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function handleTriggerInput() {
    fileInputRef.current?.click()
  }

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      {label && <span className="font-medium mb-2">{label}</span>}
      {value ? (
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
              aria-label="Remove image"
            >
              Remove
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleTriggerInput}
              aria-label="Change image"
            >
              Change
            </Button>
          </div>
        </>
      ) : (
        <div
          className="border rounded-xl p-6 flex flex-col items-center justify-center min-h-[120px] w-full cursor-pointer"
          tabIndex={0}
          aria-label="Upload image"
          onClick={handleTriggerInput}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleTriggerInput()
          }}
        >
          <span className="text-muted-foreground mb-2">
            Click to upload or drag and drop
          </span>
          <span className="text-xs text-muted-foreground">
            PNG, JPG or JPEG (max. 5MB)
          </span>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        tabIndex={-1}
        aria-label="Upload image"
      />
    </div>
  )
}
