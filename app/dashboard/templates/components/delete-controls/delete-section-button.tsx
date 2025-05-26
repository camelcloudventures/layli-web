'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DeleteDialog } from '@/components/ui/delete-dialog'
import { deleteSection } from '@/app/dashboard/templates/actions/actions'
import { useRouter } from 'next/navigation'

interface DeleteSectionButtonProps {
  sectionId: string
  pageId: string
}

export function DeleteSectionButton({
  sectionId,
  pageId,
}: DeleteSectionButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    setLoading(true)
    await deleteSection(sectionId, pageId)
    setLoading(false)
    router.refresh()
  }

  return (
    <DeleteDialog
      title="Delete Section"
      description="Are you sure you want to delete this section? This action cannot be undone."
      onDelete={handleDelete}
      trigger={
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Delete Section"
          disabled={loading}
          onClick={(e) => e.stopPropagation()}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      }
    />
  )
}
