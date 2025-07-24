'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DeleteDialog } from '@/components/ui/delete-dialog'
import { deletePage } from '@/app/dashboard/templates/actions/actions'
import { toast } from 'sonner'

interface DeletePageButtonProps {
  pageId: string
  templateId: string
}

export function DeletePageButton({
  pageId,
  templateId,
}: DeletePageButtonProps) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    const result = await deletePage(pageId, templateId)

    // @ts-expect-error --need to fix this
    if (result && result.success) {
      // @ts-expect-error --need to fix this
      toast.success(result.success)
      // @ts-expect-error --need to fix this
    } else if (result && result.error) {
      // @ts-expect-error --need to fix this
      toast.error(result.error)
    }

    setLoading(false)
  }

  return (
    <DeleteDialog
      title="Delete Page"
      description="Are you sure you want to delete this page? This action cannot be undone."
      onDelete={handleDelete}
      trigger={
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Delete Page"
          disabled={loading}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      }
    />
  )
}
