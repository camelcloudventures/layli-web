'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DeleteConfirmationDialog } from './delete-confirmation-dialog'
import { deletePage, deleteSection, deleteQuestion } from '../actions/actions'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { MoreVertical } from 'lucide-react'

interface TemplatePreviewActionsProps {
  templateId: string
  pageId?: string
  sectionId?: string
  questionId?: string
  type: 'page' | 'section' | 'question'
  onDelete?: () => void
}

export function TemplatePreviewActions({
  templateId,
  pageId,
  sectionId,
  questionId,
  type,
  onDelete,
}: TemplatePreviewActionsProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      switch (type) {
        case 'page':
          if (pageId) {
            await deletePage(pageId, templateId)
          }
          break
        case 'section':
          if (sectionId && pageId) {
            await deleteSection(sectionId, pageId)
          }
          break
        case 'question':
          if (questionId && sectionId) {
            await deleteQuestion(questionId, sectionId)
          }
          break
      }
      onDelete?.()
      toast.success(
        `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`,
      )
      router.refresh()
    } catch (error) {
      console.error('Error deleting:', error)
      toast.error(`Failed to delete ${type}. Please try again.`)
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
    }
  }

  const getDialogContent = () => {
    switch (type) {
      case 'page':
        return {
          title: 'Delete Page',
          description:
            'Are you sure you want to delete this page? This action cannot be undone.',
        }
      case 'section':
        return {
          title: 'Delete Section',
          description:
            'Are you sure you want to delete this section? This action cannot be undone.',
        }
      case 'question':
        return {
          title: 'Delete Question',
          description:
            'Are you sure you want to delete this question? This action cannot be undone.',
        }
    }
  }

  const dialogContent = getDialogContent()
  const label = `Delete ${type}`

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Actions"
            className="text-muted-foreground hover:text-foreground"
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-destructive focus:text-destructive"
            disabled={isDeleting}
            aria-label={label}
          >
            {label}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title={dialogContent.title}
        description={dialogContent.description}
        isLoading={isDeleting}
      />
    </>
  )
}
