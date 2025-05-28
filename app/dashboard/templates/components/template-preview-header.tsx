'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit } from 'lucide-react'
import type { AuditTemplate } from '@/lib/types/audit-types'
import Link from 'next/link'
import { toast } from 'sonner'

interface TemplatePreviewHeaderProps {
  template: AuditTemplate
}

export function TemplatePreviewHeader({
  template,
}: TemplatePreviewHeaderProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <Button asChild variant="outline" size="icon">
          <Link href="/dashboard/templates" aria-label="Back to templates">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {template.title}
          </h1>
          <p className="text-muted-foreground">Template Preview</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button asChild variant="outline">
          <Link
            href={`/dashboard/templates/${template.id}/edit`}
            aria-label="Edit Template"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Template
          </Link>
        </Button>
        <Button
          onClick={() => {
            // In a real app, this would start a new audit based on this template
            toast.success('Starting new audit')
          }}
        >
          Start New Audit
        </Button>
      </div>
    </div>
  )
}
