"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Upload, X, ImageIcon } from "lucide-react"

interface ImageUploadProps {
  currentImageUrl?: string
  onImageSelected: (imageUrl: string) => void
  className?: string
  placeholderText?: string
}

export function ImageUpload({
  currentImageUrl,
  onImageSelected,
  className = "",
  placeholderText = "Upload an image",
}: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl ?? null)

  // In a real app, this would upload the file to storage
  // For this demo, we'll just create a data URL
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Create a URL for the file
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    onImageSelected(url)
  }

  const clearImage = () => {
    setPreviewUrl(null)
    onImageSelected("")
  }

  // For demo purposes, if no image is selected, generate a placeholder
  const handleGeneratePlaceholder = () => {
    // Generate a random placeholder image URL
    const imageTypes = ["abstract", "building", "technology", "business", "nature"]
    const randomType = imageTypes[Math.floor(Math.random() * imageTypes.length)]
    const placeholderUrl = `/placeholder.svg?height=300&width=500&query=${randomType}`

    setPreviewUrl(placeholderUrl)
    onImageSelected(placeholderUrl)
  }

  return (
    <div className={`border rounded-md p-4 ${className}`}>
      {previewUrl ? (
        <div className="space-y-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-md">
            <Image src={previewUrl || "/placeholder.svg"} alt="Selected image" className="object-cover" fill />
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={clearImage}>
              <X className="mr-2 h-4 w-4" /> Remove
            </Button>
            <div className="relative">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="relative"
                onClick={() => document.getElementById("imageInput")?.click()}
              >
                <Upload className="mr-2 h-4 w-4" /> Change
              </Button>
              <input
                id="imageInput"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 py-8">
          <ImageIcon className="h-16 w-16 text-muted-foreground" />
          <p className="text-center text-muted-foreground">{placeholderText}</p>
          <div className="flex gap-2">
            <div className="relative">
              <Button type="button" variant="outline" onClick={() => document.getElementById("imageInput")?.click()}>
                <Upload className="mr-2 h-4 w-4" /> Upload
              </Button>
              <input
                id="imageInput"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </div>
            <Button type="button" variant="outline" onClick={handleGeneratePlaceholder}>
              <ImageIcon className="mr-2 h-4 w-4" /> Generate Placeholder
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
