'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ArrowLeft, Save, Plus, FileText } from 'lucide-react'
import type { AuditTemplate } from '@/lib/types/audit-types'
import { TemplateDetailsForm } from '@/app/dashboard/templates/components/template-details-form'
import { PagesManager } from '@/app/dashboard/templates/components/pages-manager'
import { TemplatePreview } from '@/app/dashboard/templates/components/template-preview'
import { toast } from '@/hooks/use-toast'

export default function CreateTemplatePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('details')
  const [template, setTemplate] = useState<AuditTemplate>({
    id: uuidv4(),
    title: '',
    description: '',
    pages: [],
    created_at: new Date(),
    updated_at: new Date(),
  })
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveTemplate = () => {
    if (!template.title) {
      toast({
        title: 'Error',
        description: 'Template title is required',
        variant: 'destructive',
      })
      setActiveTab('details')
      return
    }

    if (template.pages.length === 0) {
      toast({
        title: 'Error',
        description: 'At least one page is required',
        variant: 'destructive',
      })
      setActiveTab('pages')
      return
    }

    setIsSaving(true)

    try {
      // Get existing templates from localStorage
      const existingTemplatesJson = localStorage.getItem('auditTemplates')
      const existingTemplates = existingTemplatesJson
        ? JSON.parse(existingTemplatesJson)
        : []

      // Add the new template
      existingTemplates.push({
        ...template,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      // Save back to localStorage
      localStorage.setItem('auditTemplates', JSON.stringify(existingTemplates))

      toast({
        title: 'Success',
        description: 'Template saved successfully',
      })

      // Navigate back to templates page
      router.push('/dashboard/templates')
    } catch (error) {
      console.error('Error saving template:', error)
      toast({
        title: 'Error',
        description: 'Failed to save template',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const hasUnsavedChanges =
    template.title !== '' ||
    template.description !== '' ||
    template.pages.length > 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push('/dashboard/templates')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Create Audit Template
            </h1>
            <p className="text-muted-foreground">
              Build a new audit template from scratch
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            disabled={!hasUnsavedChanges || isSaving}
            onClick={handleSaveTemplate}
          >
            {isSaving ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Template
              </>
            )}
          </Button>
        </div>
      </div>

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
          <Card>
            <CardHeader>
              <CardTitle>Template Details</CardTitle>
              <CardDescription>
                Define the basic information about your audit template
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TemplateDetailsForm
                template={template}
                setTemplate={setTemplate}
                onContinue={() => setActiveTab('pages')}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pages">
          <Card>
            <CardHeader>
              <CardTitle>Pages & Questions</CardTitle>
              <CardDescription>
                Build the structure of your audit template
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

      {template.pages.length === 0 && activeTab === 'pages' && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <FileText className="h-16 w-16 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No Pages Added</h3>
            <p className="mt-2 text-center text-muted-foreground">
              Start building your template by adding pages, sections, and
              questions
            </p>
            <Button
              className="mt-4"
              onClick={() => {
                const newTemplate = { ...template }
                newTemplate.pages.push({
                  id: uuidv4(),
                  template_id: template.id,
                  title: 'New Page',
                  description: '',
                  ordinal: newTemplate.pages.length + 1,
                  sections: [],
                })
                setTemplate(newTemplate)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add First Page
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
