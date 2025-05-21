'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { PagesManager } from '@/app/dashboard/templates/components/pages-manager'
import { TemplatePreview } from '@/app/dashboard/templates/components/template-preview'
import { toast } from 'sonner'
import Link from 'next/link'
import {
  updateTemplate,
  deleteTemplate,
} from '@/app/dashboard/templates/actions/actions'

interface EditTemplateShellProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  template: any
}

export default function EditTemplateShell({
  template: initialTemplate,
}: EditTemplateShellProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('details')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [template, setTemplate] = useState<any>(initialTemplate)
  const [isSaving, setIsSaving] = useState(false)

  async function handleSaveTemplate() {
    if (!template.title) {
      toast.error('Template title is required')
      setActiveTab('details')
      return
    }
    if (template.pages.length === 0) {
      toast.error('At least one page is required')
      setActiveTab('pages')
      return
    }
    setIsSaving(true)
    try {
      const result = await updateTemplate(template)
      if (result && result.error) {
        toast.error(result.error)
        return
      }
      toast.success('Template updated successfully!')
      router.push('/dashboard/templates')
    } catch {
      toast.error('Failed to update template')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDeleteTemplate() {
    if (
      !window.confirm(
        'Are you sure you want to delete this template? This action cannot be undone.',
      )
    )
      return
    try {
      await deleteTemplate(template.id)
      toast.success('Template deleted successfully!')
      router.push('/dashboard/templates')
    } catch {
      toast.error('Failed to delete template')
    }
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
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Save Template
              </>
            )}
          </Button>
          <Button onClick={handleDeleteTemplate} variant="destructive">
            Delete Template
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
              {/* You can break this out into its own component if needed */}
              <input
                className="mb-4 w-full border rounded p-2"
                value={template.title}
                onChange={(e) =>
                  setTemplate({ ...template, title: e.target.value })
                }
                placeholder="Template Title"
              />
              <textarea
                className="mb-4 w-full border rounded p-2 min-h-[80px]"
                value={template.description}
                onChange={(e) =>
                  setTemplate({ ...template, description: e.target.value })
                }
                placeholder="Description"
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
