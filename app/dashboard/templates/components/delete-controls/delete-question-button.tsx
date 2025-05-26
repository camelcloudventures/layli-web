'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DeleteDialog } from '@/components/ui/delete-dialog'
import { deleteQuestion } from '@/app/dashboard/templates/actions/actions'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface DeleteQuestionButtonProps {
  questionId: string
  sectionId: string
}

export function DeleteQuestionButton({
  questionId,
  sectionId,
}: DeleteQuestionButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    setLoading(true)
    const result = await deleteQuestion(questionId, sectionId)
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
    router.refresh()
  }

  return (
    <DeleteDialog
      title="Delete Question"
      description="Are you sure you want to delete this question? This action cannot be undone."
      onDelete={handleDelete}
      trigger={
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Delete Question"
          disabled={loading}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      }
    />
  )
}
