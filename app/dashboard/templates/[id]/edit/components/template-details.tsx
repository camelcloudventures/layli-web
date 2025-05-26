'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'

interface TemplateDetailsProps {
  template: {
    title: string
    description: string
  }
  onUpdate: (updates: { title?: string; description?: string }) => void
}

export function TemplateDetails({ template, onUpdate }: TemplateDetailsProps) {
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
      </CardContent>
    </Card>
  )
}
