'use client'

import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
    <div className="w-full ">
      <Select
        name="template"
        value={selectedTemplate?.id}
        onValueChange={(value) => {
          const template = templates.find((t) => t.id === value)
          setSelectedTemplate(template || null)
        }}
        required={required}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select template" />
        </SelectTrigger>
        <SelectContent className="">
          {templates.map((template) => (
            <SelectItem key={template.id} value={template.id}>
              {template.photo && (
                <Image
                  src={template.photo}
                  alt={template.title}
                  width={100}
                  className="rounded-3xl h-20 w-20 object-cover"
                  height={100}
                />
              )}
              <div className="flex flex-col">
                <p className="text-sm font-medium">{template.title}</p>
                <p className="text-xs text-gray-500">{template.description}</p>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
