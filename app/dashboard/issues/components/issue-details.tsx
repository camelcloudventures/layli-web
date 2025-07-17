'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Download,
  Paperclip,
  Share2,
  Trash2,
  Upload,
  Loader2,
  Send,
} from 'lucide-react'
import type { Issue, IssueStatus, IssuePriority } from '@/lib/types/issue-types'
import { mockUsers } from '@/lib/data/mock-schedules'
import jsPDF from 'jspdf'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface IssueDetailsProps {
  issue: Issue
  onUpdate: (updatedIssue: Issue) => void
  onDelete: () => void
  onShare: () => void
  onClose: () => void
}

export function IssueDetails({
  issue,
  onUpdate,
  onDelete,
  onShare,
  onClose,
}: IssueDetailsProps) {
  const [currentTab, setCurrentTab] = useState('details')
  const [title, setTitle] = useState(issue.title)
  const [status, setStatus] = useState<IssueStatus>(issue.status)
  const [priority, setPriority] = useState<IssuePriority>(issue.priority)
  const [assigneeId, setAssigneeId] = useState<string>(issue.assignee_id || '')
  const [comment, setComment] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [isAddingComment, setIsAddingComment] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [localComments, setLocalComments] = useState(issue.comments || [])
  const [dueDate, setDueDate] = useState('')

  // Format the date for the input field when component mounts
  useEffect(() => {
    if (issue.due_date) {
      const date = new Date(issue.due_date)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      setDueDate(`${year}-${month}-${day}`)
    }
  }, [issue.due_date])

  const getStatusBadgeColor = (status: IssueStatus) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100'
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
      case 'resolved':
        return 'bg-green-100 text-green-800 hover:bg-green-100'
      case 'closed':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100'
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100'
    }
  }

  const getPriorityTextColor = (priority: IssuePriority) => {
    switch (priority) {
      case 'critical':
        return 'text-red-600'
      case 'high':
        return 'text-orange-600'
      case 'medium':
        return 'text-yellow-600'
      case 'low':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  const getCategoryBadgeColor = (category: Issue['category']) => {
    return 'bg-gray-100 text-gray-800 hover:bg-gray-100'
  }

  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
    return `${(size / (1024 * 1024)).toFixed(1)} MB`
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return '🖼️'
    if (fileType.includes('pdf')) return '📄'
    if (fileType.includes('excel') || fileType.includes('sheet')) return '📊'
    if (fileType.includes('word') || fileType.includes('document')) return '📝'
    return '📁'
  }

  const handleUpdateIssue = () => {
    setIsUpdating(true)
    try {
      // Find assignee data
      const assignee = mockUsers.find((user) => user.id === assigneeId)

      const updatedIssue: Issue = {
        ...issue,
        title,
        status,
        priority,
        assignee_id: assigneeId,
        assignee_name: assignee ? assignee.name : undefined,
        due_date: dueDate ? new Date(dueDate).toISOString() : undefined,
        updated_at: new Date().toISOString(),
        comments: localComments,
      }

      // Simulate a network delay
      setTimeout(() => {
        onUpdate(updatedIssue)

        toast.success('Issue updated successfully')

        // Close the dialog after successful update
        onClose()
      }, 600)
    } catch (error) {
      console.error('Error updating issue:', error)
      toast.error('Failed to update issue')
      setIsUpdating(false)
    }
  }

  const handleAddComment = () => {
    if (!comment.trim()) return

    setIsAddingComment(true)

    try {
      const newComment = {
        id: `comment-${Date.now()}`,
        issue_id: issue.id,
        user_id: 'user-1', // Currently logged in user
        user_name: 'Demo User', // Currently logged in user
        text: comment,
        created_at: new Date().toISOString(),
      }

      // Update local state immediately for better UX
      setLocalComments((prev) => [...prev, newComment])

      // Update the issue with the new comment
      const updatedIssue = {
        ...issue,
        comments: [...(issue.comments || []), newComment],
      }

      // Simulate a network delay
      setTimeout(() => {
        onUpdate(updatedIssue)

        // Clear comment field after adding
        setComment('')

        toast.success('Comment added successfully')
        setIsAddingComment(false)
      }, 500)
    } catch (error) {
      console.error('Error adding comment:', error)
      toast.error('Failed to add comment')
      setIsAddingComment(false)
    }
  }

  const handleDelete = () => {
    setIsDeleting(true)
    // Simulate a network delay
    setTimeout(() => {
      onDelete()
      setIsDeleting(false)
    }, 600)
  }

  const handleShare = () => {
    setIsSharing(true)
    // Simulate a network delay
    setTimeout(() => {
      onShare()
      setIsSharing(false)
    }, 600)
  }

  const generatePDF = () => {
    const doc = new jsPDF()

    // Add title
    doc.setFontSize(20)
    doc.text(`Issue: ${title}`, 20, 20)

    // Add metadata
    doc.setFontSize(12)
    doc.text(`ID: ${issue.id}`, 20, 30)
    doc.text(`Status: ${status}`, 20, 40)
    doc.text(`Priority: ${priority}`, 20, 50)
    doc.text(`Category: ${issue.category}`, 20, 60)

    // Add reporter info
    doc.text(`Reported by: ${issue.reporter_name}`, 20, 70)
    doc.text(
      `Created on: ${new Date(issue.created_at).toLocaleDateString()}`,
      20,
      80,
    )

    // Add assignee if available
    if (assigneeId) {
      const assignee = mockUsers.find((user) => user.id === assigneeId)
      if (assignee) {
        doc.text(`Assigned to: ${assignee.name}`, 20, 90)
      }
    }

    // Add description
    doc.text('Description:', 20, 110)

    // Split description into multiple lines if needed
    const splitDescription = doc.splitTextToSize(issue.description, 170)
    doc.text(splitDescription, 20, 120)

    // Add comments section if there are comments
    if (localComments.length > 0) {
      let yPosition = 120 + splitDescription.length * 10 + 20

      doc.text('Comments:', 20, yPosition)
      yPosition += 10

      localComments.forEach((comment, index) => {
        doc.text(
          `${comment.user_name} (${new Date(
            comment.created_at,
          ).toLocaleDateString()}):`,
          20,
          yPosition,
        )
        yPosition += 10

        const splitComment = doc.splitTextToSize(comment.text, 170)
        doc.text(splitComment, 20, yPosition)
        yPosition += splitComment.length * 10 + 10

        // Add a new page if we're running out of space
        if (yPosition > 270 && index < localComments.length - 1) {
          doc.addPage()
          yPosition = 20
        }
      })
    }

    return doc
  }

  const handleDownloadPdf = () => {
    setIsDownloading(true)

    try {
      // Generate the PDF
      const doc = generatePDF()

      // Save the PDF
      setTimeout(() => {
        doc.save(`issue-${issue.id}.pdf`)

        toast.success('PDF downloaded successfully')
        setIsDownloading(false)
      }, 800)
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast.error('Failed to generate PDF')
      setIsDownloading(false)
    }
  }

  const handleUploadFile = () => {
    setIsUploading(true)
    // Simulate a network delay
    setTimeout(() => {
      // In a real app, this would handle file uploads
      toast.info('File upload would be implemented in production')
      setIsUploading(false)
    }, 700)
  }

  const getPriorityColor = (priority: IssuePriority) => {
    switch (priority) {
      case 'critical':
        return 'text-red-600'
      case 'high':
        return 'text-orange-600'
      case 'medium':
        return 'text-yellow-600'
      case 'low':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1.5">
        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className={getCategoryBadgeColor(issue.category)}
          >
            {issue.category}
          </Badge>
          <Badge
            variant="outline"
            className={getPriorityTextColor(issue.priority)}
          >
            {issue.priority}
          </Badge>
          <Badge
            variant="secondary"
            className={getStatusBadgeColor(issue.status)}
          >
            {issue.status}
          </Badge>
        </div>
        <div className="space-y-2">
          <label htmlFor="issue-title" className="text-sm font-medium">
            Title
          </label>
          <Input
            id="issue-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl font-semibold"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            Reported by {issue.reporter_name} on{' '}
            {new Date(issue.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      <Tabs
        defaultValue="details"
        value={currentTab}
        onValueChange={setCurrentTab}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="files">Files & Attachments</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4 pt-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Description</h3>
              <p className="text-muted-foreground">{issue.description}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Status</h3>
                <Select
                  value={status}
                  onValueChange={(value) => setStatus(value as IssueStatus)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Priority</h3>
                <Select
                  value={priority}
                  onValueChange={(value) => setPriority(value as IssuePriority)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority">
                      {priority && (
                        <div className="flex items-center">
                          <span className={getPriorityColor(priority)}>
                            {priority.charAt(0).toUpperCase() +
                              priority.slice(1)}
                          </span>
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low" className={getPriorityColor('low')}>
                      Low
                    </SelectItem>
                    <SelectItem
                      value="medium"
                      className={getPriorityColor('medium')}
                    >
                      Medium
                    </SelectItem>
                    <SelectItem
                      value="high"
                      className={getPriorityColor('high')}
                    >
                      High
                    </SelectItem>
                    <SelectItem
                      value="critical"
                      className={getPriorityColor('critical')}
                    >
                      Critical
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Assignee</h3>
                <Select value={assigneeId} onValueChange={setAssigneeId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="due-date">Due Date</Label>
                <Input
                  id="due-date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>

            {localComments && localComments.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Comments</h3>
                <div className="space-y-4">
                  {localComments.map((comment) => (
                    <div
                      key={comment.id}
                      className="flex gap-4 rounded-md border p-4"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={comment.user_image || '/placeholder.svg'}
                          alt={comment.user_name}
                        />
                        <AvatarFallback>{comment.user_name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {comment.user_name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Add Comment</h3>
              <div className="flex gap-2">
                <Textarea
                  placeholder="Type your comment here..."
                  className="min-h-[100px] flex-1"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handleAddComment}
                  disabled={!comment.trim() || isAddingComment}
                  size="sm"
                >
                  {isAddingComment ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Comment
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="files" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Files & Attachments</h3>
            <Button
              variant="outline"
              onClick={handleUploadFile}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload File
                </>
              )}
            </Button>
          </div>

          {!issue.files || issue.files.length === 0 ? (
            <div className="flex items-center justify-center rounded-md border border-dashed p-8">
              <div className="flex flex-col items-center gap-1 text-center">
                <Paperclip className="h-8 w-8 text-muted-foreground" />
                <h3 className="font-medium">No files attached</h3>
                <p className="text-sm text-muted-foreground">
                  Upload files to attach them to this issue
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {issue.files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between rounded-md border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                      <span className="text-xl">{getFileIcon(file.type)}</span>
                    </div>
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)} • Uploaded{' '}
                        {new Date(file.uploaded_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" asChild>
                    <a href={file.url} download>
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="flex justify-between pt-2">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleDelete}
            disabled={isDeleting || isUpdating || isSharing || isDownloading}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleShare}
            disabled={isSharing || isUpdating || isDeleting || isDownloading}
          >
            {isSharing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sharing...
              </>
            ) : (
              <>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleDownloadPdf}
            disabled={isDownloading || isUpdating || isDeleting || isSharing}
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
            variant="outline"
            onClick={onClose}
            disabled={isUpdating || isDeleting || isSharing || isDownloading}
          >
            Close
          </Button>
          <Button
            onClick={handleUpdateIssue}
            disabled={isUpdating || isDeleting || isSharing || isDownloading}
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Issue'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
