'use client'

import type React from 'react'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  CheckCircle2,
  XCircle,
  FileText,
  Paperclip,
  AlertCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import { CreateActionDialog } from './create-action-dialog'
import type {
  InspectionQuestion,
  InspectionAction,
} from '@/lib/types/inspection-types'

interface InspectionQuestionFormProps {
  question: InspectionQuestion
  onChange: (updatedQuestion: InspectionQuestion) => void
  sectionIndex: number
  questionIndex: number
}

export function InspectionQuestionForm({
  question,
  onChange,
  sectionIndex,
  questionIndex,
}: InspectionQuestionFormProps) {
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false)
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false)
  const [isAttachmentDialogOpen, setIsAttachmentDialogOpen] = useState(false)
  const [note, setNote] = useState(question.note || '')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleResponseChange = (value: boolean) => {
    onChange({
      ...question,
      response: value,
    })
  }

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(e.target.value)
  }

  const handleSaveNote = () => {
    onChange({
      ...question,
      note: note,
    })
    setIsNoteDialogOpen(false)
    toast.success('Note saved')
  }

  const handleCreateAction = (newAction: InspectionAction) => {
    onChange({
      ...question,
      action: newAction,
    })

    toast.success('Action created')
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleAttachFile = () => {
    if (selectedFile) {
      // In a real app, you would upload the file to your storage
      // and get back a URL to store in the attachment field
      onChange({
        ...question,
        attachment: selectedFile.name,
      })

      setIsAttachmentDialogOpen(false)
      setSelectedFile(null)

      toast.success(`${selectedFile.name} has been attached successfully.`)
    }
  }

  return (
    <Card className="border rounded-lg shadow-sm">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <h4 className="font-medium">
              {sectionIndex + 1}.{questionIndex + 1} {question.name}
            </h4>

            <div className="flex space-x-4 mt-2">
              <Button
                type="button"
                variant={question.response === true ? 'default' : 'outline'}
                className={
                  question.response === true
                    ? 'bg-green-600 hover:bg-green-700'
                    : ''
                }
                onClick={() => handleResponseChange(true)}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Yes
              </Button>
              <Button
                type="button"
                variant={question.response === false ? 'default' : 'outline'}
                className={
                  question.response === false
                    ? 'bg-red-600 hover:bg-red-700'
                    : ''
                }
                onClick={() => handleResponseChange(false)}
              >
                <XCircle className="mr-2 h-4 w-4" />
                No
              </Button>
            </div>
          </div>

          {question.note && (
            <div className="space-y-2">
              <Label>Notes</Label>
              <div className="p-3 bg-gray-50 rounded-md">{question.note}</div>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsNoteDialogOpen(true)}
            >
              <FileText className="mr-2 h-4 w-4" />
              {question.note ? 'Edit Note' : 'Add Note'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsActionDialogOpen(true)}
            >
              <AlertCircle className="mr-2 h-4 w-4" />
              {question.action ? 'Edit Action' : 'Create Action'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAttachmentDialogOpen(true)}
            >
              <Paperclip className="mr-2 h-4 w-4" />
              {question.attachment ? 'Change Attachment' : 'Attach File'}
            </Button>

            {question.attachment && (
              <Button variant="outline" size="sm">
                <FileText className="mr-2 h-4 w-4" />
                View {question.attachment}
              </Button>
            )}
          </div>

          {question.action && (
            <div className="mt-2 p-3 bg-muted rounded-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertCircle className="mr-2 h-4 w-4 text-amber-500" />
                  <span className="font-medium">{question.action.title}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      question.action.priority === 'high'
                        ? 'bg-red-100 text-red-800'
                        : question.action.priority === 'medium'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {question.action.priority.charAt(0).toUpperCase() +
                      question.action.priority.slice(1)}
                  </span>
                </div>
              </div>
              {question.action.assignee && (
                <div className="text-xs text-muted-foreground mt-1">
                  Assigned to: {question.action.assignee}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>

      {/* Note Dialog */}
      <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {question.note ? 'Edit Note' : 'Add Note'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="note-text">Note</Label>
              <Textarea
                id="note-text"
                placeholder="Add notes here..."
                value={note}
                onChange={handleNoteChange}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsNoteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveNote}>Save Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Attachment Dialog */}
      <Dialog
        open={isAttachmentDialogOpen}
        onOpenChange={setIsAttachmentDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Attach File</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="file-upload">Select File</Label>
              <Input id="file-upload" type="file" onChange={handleFileChange} />
            </div>

            {selectedFile && (
              <div className="text-sm">
                Selected file: {selectedFile.name} (
                {Math.round(selectedFile.size / 1024)} KB)
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAttachmentDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAttachFile} disabled={!selectedFile}>
              Attach
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Action Dialog */}
      <CreateActionDialog
        open={isActionDialogOpen}
        onOpenChange={setIsActionDialogOpen}
        questionName={question.name}
        onCreateAction={handleCreateAction}
      />
    </Card>
  )
}
