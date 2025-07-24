'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import TabsSwitcher from '@/components/custom/tab-switcher'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Download, Share2, Trash2, Loader2 } from 'lucide-react'
import type { Issue, IssuePriority } from '@/lib/types/issue-types'
import Chip from '@/components/custom/chip'
import { Category, Priority, Status } from '@/lib/types'
import { addComment, updateIssue } from '../actions/actions'
import SubmitBtn from '@/components/custom/submit-btn'
import { useFormStatus } from 'react-dom'
import { deleteInspectionFile, uploadImage } from '@/utils/common'
import { generatePDF } from '@/utils/utils'
import { IssueStatus } from '@/lib/types/issue-types'
import { useAuth } from '@/lib/context/auth-provider'
import FileAttachments from './file-attachments'
import DetailsTab from './details-tab'
import ShareIssueDialog from './share-issue-dialog'

interface IssueDetailsProps {
  issue: Issue
  onClose: () => void
  assignees: Array<{
    id: string
    full_name: string
    email: string
    role: string
  }>
}

interface UploadedImage {
  id: string
  file: File
  preview: string
  uploadedUrl?: string
  isUploading?: boolean
}

function IssueDetailsForm({ issue, onClose, assignees }: IssueDetailsProps) {
  const [currentTab, setCurrentTab] = useState('details')
  const [isDownloading, setIsDownloading] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [comment, setComment] = useState('')
  const [isSendingComment, setIsSendingComment] = useState(false)
  const [status, setStatus] = useState<IssueStatus>(issue.status)
  const [priority, setPriority] = useState<IssuePriority>(issue.priority)
  const [assigneeIds, setAssigneeIds] = useState(
    issue.assignees.map((a) => a.id),
  )

  const { pending } = useFormStatus()
  const { user: currentUser } = useAuth()

  const handleAddComment = async () => {
    setIsSendingComment(true)
    const formData = new FormData()
    formData.append('comment', comment)

    const commenter = {
      id: currentUser?.id || '',
      full_name: currentUser?.full_name || '',
      email: currentUser?.email || '',
      role: currentUser?.role || '',
    }
    const res = await addComment(issue.id, formData, commenter)
    if (res.success) {
      toast.success('Comment added successfully')
      setComment('')
    } else {
      toast.error(res.error)
    }
    setIsSendingComment(false)
  }

  const handleDownloadPdf = () => {
    setIsDownloading(true)
    try {
      const doc = generatePDF(issue)
      setTimeout(() => {
        // Create a safe filename from the issue title
        const safeTitle = issue.title
          ? issue.title
              .replace(/[^a-zA-Z0-9\s-]/g, '')
              .replace(/\s+/g, '-')
              .toLowerCase()
          : 'untitled-issue'
        doc.save(`${safeTitle}.pdf`)
        toast.success('PDF downloaded successfully')
        setIsDownloading(false)
      }, 800)
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast.error('Failed to generate PDF')
      setIsDownloading(false)
    }
  }

  function handleShare() {
    setShowShareDialog(true)
  }

  const handleFileUpload = useCallback(async (file: File) => {
    const imageId = crypto.randomUUID()
    const newImage: UploadedImage = {
      id: imageId,
      file,
      preview: URL.createObjectURL(file),
      isUploading: true,
    }
    setUploadedImages((prev) => [...prev, newImage])

    try {
      const result = await uploadImage({ file }, 'issues-image')
      if (result.success && result.fileUrl) {
        setUploadedImages((prev) =>
          prev.map((img) =>
            img.id === imageId
              ? { ...img, uploadedUrl: result.fileUrl, isUploading: false }
              : img,
          ),
        )
        toast.success('Image uploaded successfully')
      } else {
        setUploadedImages((prev) => prev.filter((img) => img.id !== imageId))
        toast.error(result.error || 'Failed to upload image')
      }
    } catch {
      setUploadedImages((prev) => prev.filter((img) => img.id !== imageId))
      toast.error('Failed to upload image')
    }
  }, [])

  const removeImage = useCallback(
    async (imageId: string) => {
      const imageToRemove = uploadedImages.find((img) => img.id === imageId)
      if (imageToRemove?.uploadedUrl) {
        const fileName = imageToRemove.uploadedUrl.split('/').pop()
        if (fileName) {
          await deleteInspectionFile(fileName, 'issues-image')
        }
      }
      setUploadedImages((prev) => prev.filter((img) => img.id !== imageId))
    },
    [uploadedImages],
  )

  console.log('issue', issue)
  console.log('assignees', assignees)
  return (
    <>
      <div className="flex flex-col space-y-1.5">
        <div className="flex items-center gap-2">
          <Chip type="category" value={issue.category as Category} />
          <Chip type="priority" value={issue.priority as Priority} />
          <Chip type="status" value={issue.status as Status} />
        </div>
        <div className="space-y-2">
          <label htmlFor="issue-title" className="text-sm font-medium">
            Title
          </label>
          <Input
            id="issue-title"
            name="title"
            defaultValue={issue.title}
            className="text-xl font-semibold"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            Reported by {issue.reporter?.full_name} on{' '}
            {new Date(issue.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      <TabsSwitcher
        defaultValue="details"
        value={currentTab}
        onValueChange={setCurrentTab}
        tabs={[
          {
            value: 'details',
            label: 'Details',
            content: (
              <DetailsTab
                issue={issue}
                status={status}
                priority={priority}
                assigneeIds={assigneeIds}
                setStatus={setStatus}
                setPriority={setPriority}
                setAssigneeIds={setAssigneeIds}
                comment={comment}
                setComment={setComment}
                pending={pending}
                isSendingComment={isSendingComment}
                addComment={handleAddComment}
              />
            ),
          },
          {
            value: 'files',
            label: 'Files & Attachments',
            content: (
              <FileAttachments
                issue={issue}
                uploadedImages={uploadedImages}
                pending={pending}
                handleFileUpload={handleFileUpload}
                removeImage={removeImage}
              />
            ),
          },
        ]}
      />

      <div className="flex justify-between pt-2">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {}}
            disabled={pending}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleShare}
            disabled={pending}
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleDownloadPdf}
            disabled={pending}
          >
            {isDownloading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </>
            )}
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={pending}
          >
            Close
          </Button>
          <SubmitBtn
            label={pending ? 'Updating...' : 'Update Issue'}
            isDisabled={pending}
            variant="default"
            className="w-fit"
          />
        </div>
      </div>

      <ShareIssueDialog
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        issueId={issue.id}
        assignees={assignees}
        currentAssignees={issue.assignees}
      />
    </>
  )
}

export function IssueDetails({ issue, onClose, assignees }: IssueDetailsProps) {
  const handleUpdateIssue = async (formData: FormData) => {
    const res = await updateIssue(issue.id, formData)

    if (res) {
      toast.success('Issue updated successfully')
      onClose()
    } else {
      toast.error('Failed to update issue')
    }
  }

  return (
    <form action={handleUpdateIssue} className="space-y-6">
      <IssueDetailsForm issue={issue} onClose={onClose} assignees={assignees} />
    </form>
  )
}
