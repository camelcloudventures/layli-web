import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getTemplate } from '@/app/dashboard/templates/actions/actions'
import { TemplatePreviewClient } from '@/app/dashboard/templates/components/template-preview-client'
import { TemplatePreviewHeader } from '@/app/dashboard/templates/components/template-preview-header'
import type { AuditTemplate } from '@/lib/types/audit-types'

function isWrappedTemplate(obj: unknown): obj is { data: AuditTemplate } {
  return !!obj && typeof obj === 'object' && 'data' in obj
}

export default async function TemplatePreviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const rawTemplate = await getTemplate(id)
  const template = isWrappedTemplate(rawTemplate)
    ? rawTemplate.data
    : rawTemplate

  if (!template) {
    redirect('/dashboard/templates')
  }

  console.log(template)

  return (
    <div className="space-y-6">
      <TemplatePreviewHeader template={template} />

      <Card>
        <CardHeader>
          <CardTitle>Template Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <TemplatePreviewClient template={template} />
        </CardContent>
      </Card>
    </div>
  )
}
