'use client'

import { useState, useEffect } from 'react'
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
import { ArrowLeft, Save } from 'lucide-react'
import type { AuditTemplate } from '@/lib/types/audit-types'
import { TemplateDetailsForm } from '@/app/dashboard/templates/components/template-details-form'
import { PagesManager } from '@/app/dashboard/templates/components/pages-manager'
import { TemplatePreview } from '@/app/dashboard/templates/components/template-preview'
import { toast } from '@/hooks/use-toast'
import { mockTemplates } from '@/lib/data/mock-templates'
import Link from 'next/link'

export default function EditTemplatePage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('details')
  const [template, setTemplate] = useState<AuditTemplate | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load template from localStorage or mock templates
    const loadTemplate = () => {
      setIsLoading(true)

      // Try to find the template in mock templates first
      const mockTemplate = mockTemplates.find((t) => t.id === params.id)

      if (mockTemplate) {
        setTemplate(mockTemplate)
        setIsLoading(false)
        return
      }

      // If not found in mock templates, check localStorage
      const savedTemplates = localStorage.getItem('auditTemplates')
      if (savedTemplates) {
        try {
          const parsedTemplates = JSON.parse(savedTemplates)
          const foundTemplate = parsedTemplates.find(
            (template: AuditTemplate) => template.id === params.id,
          )

          if (foundTemplate) {
            setTemplate(foundTemplate)
          } else {
            // Template not found
            toast({
              title: 'Error',
              description: 'Template not found',
              variant: 'destructive',
            })
            router.push('/dashboard/templates')
          }
        } catch (e) {
          console.error('Error parsing saved templates:', e)
          toast({
            title: 'Error',
            description: 'Failed to load template',
            variant: 'destructive',
          })
          router.push('/dashboard/templates')
        }
      } else if (!mockTemplate) {
        // No saved templates and not a mock template
        toast({
          title: 'Error',
          description: 'Template not found',
          variant: 'destructive',
        })
        router.push('/dashboard/templates')
      }

      setIsLoading(false)
    }

    loadTemplate()
  }, [params.id, router])

  const handleSaveTemplate = () => {
    if (!template) return

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
      // Check if it's a mock template
      const isMockTemplate = mockTemplates.some((t) => t.id === params.id)

      if (isMockTemplate) {
        // For mock templates, create a new template instead of editing
        const newTemplate = {
          ...template,
          id: uuidv4(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        // Get existing templates from localStorage
        const existingTemplatesJson = localStorage.getItem('auditTemplates')
        const existingTemplates = existingTemplatesJson
          ? JSON.parse(existingTemplatesJson)
          : []

        // Add the new template
        existingTemplates.push(newTemplate)

        // Save back to localStorage
        localStorage.setItem(
          'auditTemplates',
          JSON.stringify(existingTemplates),
        )

        toast({
          title: 'Success',
          description: 'Template copied and saved successfully',
        })
      } else {
        // For regular templates, update the existing one
        const savedTemplates = localStorage.getItem('auditTemplates')
        if (savedTemplates) {
          const parsedTemplates = JSON.parse(savedTemplates)

          const updatedTemplates = parsedTemplates.map((t: AuditTemplate) =>
            t.id === template.id
              ? {
                  ...template,
                  updated_at: new Date().toISOString(),
                }
              : t,
          )

          localStorage.setItem(
            'auditTemplates',
            JSON.stringify(updatedTemplates),
          )

          toast({
            title: 'Success',
            description: 'Template updated successfully',
          })
        }
      }

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

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <p>Loading template...</p>
      </div>
    )
  }

  if (!template) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <p>Template not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="icon">
            <Link href="/dashboard/templates" aria-label="Back to templates">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Template</h1>
            <p className="text-muted-foreground">{template.title}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSaveTemplate} disabled={isSaving}>
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
                Edit the basic information about your audit template
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
