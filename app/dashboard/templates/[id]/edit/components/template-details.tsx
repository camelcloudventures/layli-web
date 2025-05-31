'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { ImageUpload } from '@/app/dashboard/templates/components/image-upload'
import { Label } from '@/components/ui/label'

interface TemplateDetailsProps {
  template: {
    title: string
    description: string
    photo?: string
  }
  onUpdate: (updates: {
    title?: string
    description?: string
    photo?: string
  }) => void
}

export function TemplateDetails({ template, onUpdate }: TemplateDetailsProps) {
  console.log('template', template)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Template Details</CardTitle>
        <CardDescription>
          Edit the basic information about your audit template
        </CardDescription>
      </CardHeader>
      <CardContent>
        <input
          className="mb-4 w-full rounded border p-2"
          value={template.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="Template Title"
        />
        <textarea
          className="mb-4 min-h-[80px] w-full rounded border p-2"
          value={template.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="Description"
        />
        <div className="space-y-2">
          <Label>Cover Image</Label>
          <ImageUpload
            value={template.photo || ''}
            onChange={(url) => onUpdate({ photo: url })}
            label="Cover Image"
          />
        </div>
      </CardContent>
    </Card>
  )
}
