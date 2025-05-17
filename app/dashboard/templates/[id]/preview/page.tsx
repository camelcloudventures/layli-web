'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit } from 'lucide-react'
import type { AuditTemplate } from '@/types/audit-types'
import { toast } from '@/hooks/use-toast'
import { TemplatePreview } from '@/app/dashboard/templates/components/template-preview'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { mockTemplates } from '@/lib/data/mock-templates'

export default function TemplatePreviewPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const [template, setTemplate] = useState<AuditTemplate | null>(null)
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
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push('/dashboard/templates')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {template.title}
            </h1>
            <p className="text-muted-foreground">Template Preview</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              router.push(`/dashboard/templates/${template.id}/edit`)
            }
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Template
          </Button>
          <Button
            onClick={() => {
              // In a real app, this would start a new audit based on this template
              toast({
                title: 'Starting new audit',
                description:
                  'This would create a new audit based on this template',
              })
            }}
          >
            Start New Audit
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Template Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <TemplatePreview template={template} />
        </CardContent>
      </Card>
    </div>
  )
}
