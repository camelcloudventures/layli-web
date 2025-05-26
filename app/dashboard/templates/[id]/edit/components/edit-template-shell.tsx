'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { PagesManager } from '@/app/dashboard/templates/components/pages-manager'
import { TemplatePreview } from '@/app/dashboard/templates/components/template-preview'
import { useTemplate } from '../hooks/useTemplate'
import { TemplateDetails } from './template-details'
import { TemplateHeader } from './template-header'
import { Template } from '@/types/audit-types'

interface EditTemplateShellProps {
  template: Template
}

export default function EditTemplateShell({
  template: initialTemplate,
}: EditTemplateShellProps) {
  const [activeTab, setActiveTab] = useState('details')
  const {
    template,
    setTemplate,
    isSaving,
    handleSaveTemplate,
    handleDeleteTemplate,
  } = useTemplate(initialTemplate)

  function handleTemplateUpdate(updates: {
    title?: string
    description?: string
  }) {
    setTemplate((prev) => ({ ...prev, ...updates }))
  }

  return (
    <div className="space-y-6">
      <TemplateHeader
        title={template.title}
        isSaving={isSaving}
        onSave={handleSaveTemplate}
        onDelete={handleDeleteTemplate}
      />
      <Tabs
        defaultValue="details"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Template Details</TabsTrigger>
          <TabsTrigger value="pages">Pages & Questions</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <TemplateDetails
            template={template}
            onUpdate={handleTemplateUpdate}
          />
        </TabsContent>
        <TabsContent value="pages">
          <Card>
            <CardHeader>
              <CardTitle>Pages & Questions</CardTitle>
              <CardDescription>
                Edit the structure of your audit template
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PagesManager template={template} setTemplate={setTemplate} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Template Preview</CardTitle>
              <CardDescription>
                Preview how your audit template will appear to users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TemplatePreview template={template} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
