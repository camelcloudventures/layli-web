'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { DeleteDialog } from '@/components/ui/delete-dialog'

interface TemplateHeaderProps {
  title: string
  isSaving: boolean
  onSave: () => void
  onDelete: () => Promise<void>
}

export function TemplateHeader({
  title,
  isSaving,
  onSave,
  onDelete,
}: TemplateHeaderProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <Button asChild variant="outline" size="icon">
          <Link href="/dashboard/templates" aria-label="Back to templates">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Template</h1>
          <p className="text-muted-foreground">{title}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={onSave} disabled={isSaving}>
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
        <DeleteDialog
          triggerText="Delete Template"
          title="Delete Template"
          description="Are you sure you want to delete this template? This action cannot be undone."
          onDelete={onDelete}
        />
      </div>
    </div>
  )
}
