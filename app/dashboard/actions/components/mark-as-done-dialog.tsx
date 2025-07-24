import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { markActionAsCompleted } from '../actions/actions'
import type { Action, Site } from '@/lib/types'
import { X, Image as ImageIcon, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { uploadImage } from '@/utils/common'
import { cn } from '@/lib/utils'

interface MarkAsDoneDialogProps {
  action: Action
  sites: Site[]
  onComplete: () => void
}

export function MarkAsDoneDialog({
  action,
  sites,
  onComplete,
}: MarkAsDoneDialogProps) {
  console.log('MarkAsDoneDialog rendered with action:', action.id, action.title)

  // Prefer action.site?.id, fallback to action.site_id, fallback to first site
  const initialSiteId =
    (action.site?.id
      ? action.site.id.toString()
      : action.site_id?.toString()) ||
    (sites[0]?.id?.toString() ?? '')
  const [siteId, setSiteId] = useState<string>(initialSiteId)
  const [comment, setComment] = useState('')
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB

  const handleFileUpload = useCallback(async (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size must be less than 2MB')
      return
    }
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }
    setIsUploading(true)
    try {
      const result = await uploadImage({ file }, 'inspection-attachments')
      if (result.success && result.fileUrl) {
        setUploadedUrl(result.fileUrl)
        toast.success('Image uploaded successfully')
      } else {
        toast.error(result.error || 'Failed to upload image')
      }
    } catch {
      toast.error('Failed to upload image')
    }
    setIsUploading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0]
      if (selectedFile) {
        handleFileUpload(selectedFile)
      }
    },
    [handleFileUpload],
  )

  const removeImage = useCallback(() => {
    setUploadedUrl(null)
  }, [])

  const handleUploadAreaClick = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) {
      toast.error('Comment is required')
      return
    }
    setIsSubmitting(true)
    const payload = {
      comments: comment,
      file: uploadedUrl || '',
      site_id: siteId,
    }
    await toast.promise(markActionAsCompleted(action.id, payload), {
      loading: 'Marking as done...',
      success: 'Action marked as done',
      error: 'Failed to mark as done',
    })
    setIsSubmitting(false)
    onComplete()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Site</Label>
        <Select value={siteId} onValueChange={setSiteId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select site" />
          </SelectTrigger>
          <SelectContent>
            {sites.map((site) => (
              <SelectItem key={site.id} value={site.id.toString()}>
                {site.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Comment</Label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment"
          required
        />
      </div>
      <div className="space-y-2">
        <Label>File (optional)</Label>
        {uploadedUrl ? (
          <div className="relative group w-32 h-32">
            <Image
              src={uploadedUrl}
              alt="Uploaded"
              fill
              className="object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remove image"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <div
            className={cn(
              'border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer',
              isUploading
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50',
            )}
            onClick={handleUploadAreaClick}
            tabIndex={0}
            aria-label="Upload image"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                fileInputRef.current?.click()
              }
            }}
          >
            {isUploading ? (
              <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-muted-foreground" />
            ) : (
              <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            )}
            <h3 className="text-lg font-semibold mb-2">
              {isUploading ? 'Uploading...' : 'Choose image or drag and drop'}
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              PNG, JPG, GIF up to 2MB
            </p>
            <p className="text-xs text-muted-foreground">
              Click to browse or drag and drop your image here
            </p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onComplete}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="default"
          disabled={isSubmitting || isUploading}
        >
          {isSubmitting ? 'Submitting...' : 'Mark as Done'}
        </Button>
      </div>
    </form>
  )
}
