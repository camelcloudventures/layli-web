"use client"

import type React from "react"

import { type Dispatch, type SetStateAction, useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import type { AuditTemplate } from "@/lib/types/audit-types"
import { ImageUpload } from "@/app/dashboard/templates/components/image-upload"

interface TemplateDetailsFormProps {
  template: AuditTemplate
  setTemplate: Dispatch<SetStateAction<AuditTemplate>>
  onContinue: () => void
}

export function TemplateDetailsForm({ template, setTemplate, onContinue }: TemplateDetailsFormProps) {
  const [title, setTitle] = useState(template.title)
  const [description, setDescription] = useState(template.description)
  const [photoUrl, setPhotoUrl] = useState(template.photo)
  const [errors, setErrors] = useState({ title: false })

  // Update the parent template state when form values change
  useEffect(() => {
    setTemplate((prev) => ({
      ...prev,
      title,
      description,
      photo: photoUrl,
    }))
  }, [title, description, photoUrl, setTemplate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate
    if (!title.trim()) {
      setErrors({ ...errors, title: true })
      return
    }

    onContinue()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">
            Template Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            placeholder="e.g., Workplace Safety Audit"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              if (e.target.value.trim()) {
                setErrors({ ...errors, title: false })
              }
            }}
            className={errors.title ? "border-red-500" : ""}
          />
          {errors.title && <p className="text-sm text-red-500">Title is required</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Provide a brief description of this audit template's purpose"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[120px]"
          />
        </div>

        <div className="space-y-2">
          <Label>Cover Image</Label>
          <ImageUpload
            value={photoUrl}
            onChange={(url: string) => setPhotoUrl(url)}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit">Continue to Pages</Button>
      </div>
    </form>
  )
}