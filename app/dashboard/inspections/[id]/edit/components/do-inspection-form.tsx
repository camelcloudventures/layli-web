'use client'

import { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  ArrowLeft,
  ClipboardCheck,
  FileText,
  Paperclip,
  Save,
} from 'lucide-react'
import { toast } from 'sonner'
import { completeInspection, saveResponse } from '../../../actions/actions'
import type {
  Inspection,
  Response,
  Question,
} from '@/lib/types/inspection-types'
import { FieldMapper } from './fields/field-mapper'

interface Props {
  inspection: Inspection
}

interface ResponseData {
  question_id: number
  value: string
  selected_options: number[]
  response_value: string
  file_attachments?: {
    filename: string
    file_path: string
    file_size: number
    mime_type: string
  }[]
  inspector_notes?: string
}

interface SaveResponseResult {
  data: Response
}

export function DoInspectionForm({ inspection }: Props) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false)
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false)
  const [activeQuestionId, setActiveQuestionId] = useState<number | null>(null)
  const [note, setNote] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [responses, setResponses] = useState<Record<number, Response>>(
    inspection.responses.reduce((acc, response) => {
      acc[response.question_id] = response
      return acc
    }, {} as Record<number, Response>),
  )

  // Keep track of unsaved changes
  const [unsavedChanges, setUnsavedChanges] = useState<
    Record<number, ResponseData>
  >({})
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [savingFields, setSavingFields] = useState<Record<number, boolean>>({})

  // Debounced save function
  const debouncedSave = useCallback(
    async (questionId: number, responseData: ResponseData) => {
      try {
        setIsSaving(true)
        const result = (await saveResponse(
          inspection.id,
          String(questionId),
          responseData,
        )) as SaveResponseResult

        // Update responses with server data
        if (result?.data) {
          setResponses((prev) => ({
            ...prev,
            [questionId]: result.data,
          }))

          // Remove from unsaved changes
          setUnsavedChanges((prev) => {
            const next = { ...prev }
            delete next[questionId]
            return next
          })

          toast.success('Response saved')
        }
      } catch (error) {
        console.error('Error saving response:', error)
        toast.error(
          'Failed to save response. Changes will be saved when you click "Save Progress"',
        )
      } finally {
        setIsSaving(false)
      }
    },
    [inspection.id],
  )

  // Handle response changes
  const handleResponse = useCallback(
    (question: Question, value: string, files?: File[]) => {
      // Prepare response data
      const responseData: ResponseData = {
        question_id: question.id,
        value: value,
        selected_options: [],
        response_value: value,
        ...(files &&
          files.length > 0 && {
            file_attachments: files.map((file) => ({
              filename: file.name,
              file_path: '',
              file_size: file.size,
              mime_type: file.type,
            })),
          }),
      }

      // Update local state immediately
      setResponses((prev) => ({
        ...prev,
        [question.id]: {
          ...prev[question.id],
          ...responseData,
        } as Response,
      }))

      // Add to unsaved changes
      setUnsavedChanges((prev) => ({
        ...prev,
        [question.id]: responseData,
      }))

      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }

      // Set new timeout for debounced save
      saveTimeoutRef.current = setTimeout(() => {
        debouncedSave(question.id, responseData)
      }, 1000) // 1 second debounce
    },
    [debouncedSave],
  )

  // Handle individual field save
  const handleFieldSave = async (questionId: number) => {
    if (!unsavedChanges[questionId]) return

    setSavingFields((prev) => ({ ...prev, [questionId]: true }))
    try {
      const result = (await saveResponse(
        inspection.id,
        String(questionId),
        unsavedChanges[questionId],
      )) as SaveResponseResult

      if (result?.data) {
        setResponses((prev) => ({
          ...prev,
          [questionId]: result.data,
        }))

        // Remove from unsaved changes
        setUnsavedChanges((prev) => {
          const next = { ...prev }
          delete next[questionId]
          return next
        })

        toast.success('Response saved')
      }
    } catch (error) {
      console.error('Error saving response:', error)
      toast.error('Failed to save response')
    } finally {
      setSavingFields((prev) => {
        const next = { ...prev }
        delete next[questionId]
        return next
      })
    }
  }

  // Save all unsaved changes
  const saveAllChanges = async () => {
    setIsSaving(true)
    try {
      const unsavedQuestionIds = Object.keys(unsavedChanges)
      if (unsavedQuestionIds.length === 0) {
        toast.success('All changes are saved')
        return
      }

      await Promise.all(
        unsavedQuestionIds.map((questionId) => {
          const id = parseInt(questionId, 10)
          if (isNaN(id)) {
            throw new Error(`Invalid question ID: ${questionId}`)
          }
          return debouncedSave(id, unsavedChanges[id])
        }),
      )

      toast.success('All changes saved successfully')
    } catch (error) {
      console.error('Error saving changes:', error)
      toast.error('Failed to save some changes')
    } finally {
      setIsSaving(false)
    }
  }

  const handleComplete = async () => {
    setIsSubmitting(true)
    try {
      // First save any unsaved changes
      await saveAllChanges()

      const res = await completeInspection(inspection.id)
      console.log('completed res', res)
      toast.success(res.success)
      router.push('/dashboard/inspections')
    } catch (error) {
      console.error('Error completing inspection:', error)
      toast.error((error as Error)?.message || 'Failed to complete inspection')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddNote = async () => {
    if (!activeQuestionId) return

    const currentResponse = responses[activeQuestionId]
    const responseData: ResponseData = {
      question_id: activeQuestionId,
      value: currentResponse?.value?.toString() ?? '',
      selected_options: currentResponse?.selected_options ?? [],
      response_value: currentResponse?.response_value ?? '',
      inspector_notes: note,
    }

    // Update local state immediately
    setResponses((prev) => ({
      ...prev,
      [activeQuestionId]: {
        ...prev[activeQuestionId],
        inspector_notes: note,
      } as Response,
    }))

    // Add to unsaved changes
    setUnsavedChanges((prev) => ({
      ...prev,
      [activeQuestionId]: responseData,
    }))

    // Save immediately for notes
    await debouncedSave(activeQuestionId, responseData)
    setIsNoteDialogOpen(false)
    setNote('')
  }

  const handleAttachFile = async () => {
    if (!activeQuestionId || !selectedFile) return

    const currentResponse = responses[activeQuestionId]
    const responseData: ResponseData = {
      question_id: activeQuestionId,
      value: currentResponse?.value?.toString() ?? '',
      selected_options: currentResponse?.selected_options ?? [],
      response_value: currentResponse?.response_value ?? '',
      file_attachments: [
        {
          filename: selectedFile.name,
          file_path: '',
          file_size: selectedFile.size,
          mime_type: selectedFile.type,
        },
      ],
    }

    // Update local state immediately
    setResponses((prev) => ({
      ...prev,
      [activeQuestionId]: {
        ...prev[activeQuestionId],
        file_attachments: responseData.file_attachments,
      } as Response,
    }))

    // Add to unsaved changes
    setUnsavedChanges((prev) => ({
      ...prev,
      [activeQuestionId]: responseData,
    }))

    // Save immediately for files
    await debouncedSave(activeQuestionId, responseData)
    setIsFileDialogOpen(false)
    setSelectedFile(null)
  }

  // Calculate completion percentage
  const totalQuestions = inspection.pages.reduce(
    (acc, page) =>
      acc +
      page.sections.reduce(
        (sAcc, section) => sAcc + section.questions.length,
        0,
      ),
    0,
  )
  const answeredQuestions = Object.keys(responses).length
  const completionPercentage = Math.round(
    (answeredQuestions / totalQuestions) * 100,
  )

  // If there are no pages in the inspection, show a message
  if (!inspection.pages || inspection.pages.length === 0) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/inspections')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Inspections
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{inspection.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              No pages found in this inspection.
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const hasUnsavedChanges = Object.keys(unsavedChanges).length > 0

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/inspections')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">{inspection.title}</h1>
            <p className="text-muted-foreground">{inspection.site?.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <Button
              variant="outline"
              onClick={saveAllChanges}
              disabled={isSaving}
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          )}
          <Button
            onClick={handleComplete}
            disabled={isSubmitting || hasUnsavedChanges}
          >
            <ClipboardCheck className="mr-2 h-4 w-4" />
            Complete Inspection
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inspection Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Completion: {completionPercentage}%</span>
              {hasUnsavedChanges && (
                <span className="text-yellow-500">
                  {Object.keys(unsavedChanges).length} unsaved{' '}
                  {Object.keys(unsavedChanges).length === 1
                    ? 'change'
                    : 'changes'}
                </span>
              )}
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue={inspection.pages[0].id.toString()}>
            <TabsList className="grid grid-cols-2 lg:grid-cols-4 mb-4">
              {inspection.pages.map((page) => (
                <TabsTrigger
                  key={page.id}
                  value={page.id.toString()}
                  className="text-sm"
                >
                  {page.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {inspection.pages.map((page) => (
              <TabsContent key={page.id} value={page.id.toString()}>
                <div className="space-y-6">
                  {page.sections.map((section) => (
                    <div key={section.id} className="space-y-4">
                      <h3 className="text-lg font-semibold">{section.title}</h3>
                      {section.questions.map((question) => {
                        const response = responses[question.id]
                        const hasUnsavedChange =
                          unsavedChanges[question.id] !== undefined
                        const isSaving = savingFields[question.id]

                        return (
                          <Card key={question.id}>
                            <CardContent className="pt-6">
                              <div className="space-y-4">
                                <FieldMapper
                                  question={question}
                                  response={response}
                                  onResponse={(value, files) =>
                                    handleResponse(question, value, files)
                                  }
                                  onSave={handleFieldSave}
                                  hasUnsavedChanges={hasUnsavedChange}
                                  isSaving={isSaving}
                                />

                                <div className="flex flex-wrap gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setActiveQuestionId(question.id)
                                      setNote(response?.inspector_notes || '')
                                      setIsNoteDialogOpen(true)
                                    }}
                                  >
                                    <FileText className="mr-2 h-4 w-4" />
                                    {response?.inspector_notes
                                      ? 'Edit Note'
                                      : 'Add Note'}
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setActiveQuestionId(question.id)
                                      setIsFileDialogOpen(true)
                                    }}
                                  >
                                    <Paperclip className="mr-2 h-4 w-4" />
                                    {response?.file_attachments?.length
                                      ? 'Edit Attachment'
                                      : 'Attach File'}
                                  </Button>
                                </div>

                                {response?.inspector_notes && (
                                  <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                                    {response.inspector_notes}
                                  </div>
                                )}

                                {response?.file_attachments &&
                                  response.file_attachments.length > 0 && (
                                    <div className="text-sm text-muted-foreground">
                                      Attached:{' '}
                                      {response.file_attachments[0].filename}
                                    </div>
                                  )}
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Note Dialog */}
      <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="note">Note</Label>
              <Textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add your note here..."
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
            <Button onClick={handleAddNote}>Save Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* File Dialog */}
      <Dialog open={isFileDialogOpen} onOpenChange={setIsFileDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Attach File</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="file">Select File</Label>
              <Input
                id="file"
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setSelectedFile(file)
                  }
                }}
              />
            </div>
            {selectedFile && (
              <p className="text-sm text-muted-foreground">
                Selected file: {selectedFile.name} (
                {Math.round(selectedFile.size / 1024)} KB)
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsFileDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAttachFile} disabled={!selectedFile}>
              Attach
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
