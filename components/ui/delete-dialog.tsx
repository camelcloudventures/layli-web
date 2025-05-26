'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

interface DeleteDialogProps {
  triggerText?: string
  title?: string
  description?: string
  onDelete: () => Promise<void>
  onSuccess?: () => void
  className?: string
  variant?: 'default' | 'destructive'
}

export function DeleteDialog({
  triggerText = 'Delete',
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  onDelete,
  onSuccess,
  className,
  variant = 'destructive',
}: DeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault()
    setIsDeleting(true)
    await onDelete()
    setIsOpen(false)
    onSuccess?.()
    setIsDeleting(false)
  }

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!isDeleting) {
          setIsOpen(open)
        }
      }}
    >
      <AlertDialogTrigger asChild>
        <Button variant={variant} className={className}>
          {triggerText}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={
              variant === 'destructive' ? 'bg-red-500 hover:bg-red-600' : ''
            }
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
