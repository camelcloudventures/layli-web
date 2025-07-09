'use client'

import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { Template } from '@/lib/types/audit-types'
import Image from 'next/image'

interface TemplateSelectorProps {
  templates: Template[]
  selectedTemplate: Template | null
  setSelectedTemplate: (template: Template | null) => void
  required?: boolean
}

export default function TemplateSelector({
  templates,
  selectedTemplate,
  setSelectedTemplate,
  required = true,
}: TemplateSelectorProps) {
  return (
    <div className="w-full">
      <Select
        name="template"
        value={selectedTemplate?.id?.toString()}
        onValueChange={(value) => {
          const template = templates.find((t) => t.id.toString() === value)
          setSelectedTemplate(template || null)
        }}
        required={required}
      >
        <SelectTrigger className="w-full">
          {selectedTemplate ? (
            <span>{selectedTemplate.title}</span>
          ) : (
            <span className="text-muted-foreground">Select template</span>
          )}
        </SelectTrigger>
        <SelectContent>
          {templates.map((template) => (
            <SelectItem
              key={template.id}
              value={template.id.toString()}
              className="flex items-center gap-3 py-2"
            >
              <div className="flex items-center gap-3">
                {template.photo && (
                  <div className="relative h-20 w-20 flex-shrink-0">
                    <Image
                      src={template.photo}
                      alt={template.title}
                      fill
                      className="rounded-md object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-col">
                  <p className="text-sm font-medium">{template.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {template.description}
                  </p>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
