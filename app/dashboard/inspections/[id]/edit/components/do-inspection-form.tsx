'use client'

import { useState, useCallback, useMemo } from 'react'
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
import {
  completeInspection,
  pauseInspection,
  saveResponse,
} from '../../../actions/actions'
import type {
  Inspection,
  Response,
  Question,
  LocationResponse,
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
  location_data?: {
    address: string
    latitude: number
    longitude: number
    place_id?: string
  } | null
  file_attachments?: {
    filename: string
    file_path: string
    file_size: number
    mime_type: string
  }[]
  inspector_notes?: string
}

export function DoInspectionForm({ inspection }: Props) {
  const router = useRouter()
  const [currentInspection, setCurrentInspection] = useState<Inspection>(
    inspection,
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pause, setPausing] = useState<boolean>(false)
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false)
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false)
  const [activeQuestionId, setActiveQuestionId] = useState<number | null>(null)
  const [note, setNote] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const responses = useMemo(
    () =>
      currentInspection.responses.reduce((acc, response) => {
        acc[response.question_id] = response
        return acc
      }, {} as Record<number, Response>),
    [currentInspection.responses],
  )

  // Keep track of unsaved changes
  const [unsavedChanges, setUnsavedChanges] = useState<
    Record<number, ResponseData>
  >({})
  const [savingFields, setSavingFields] = useState<Record<number, boolean>>({})

  // Handle response changes
  const handleResponse = useCallback(
    (question: Question, value: string | LocationResponse, files?: File[]) => {
      let responseData: ResponseData

      if (
        typeof value === 'object' &&
        value !== null &&
        'location_data' in value
      ) {
        // This is a LocationResponse object
        responseData = {
          question_id: question.id,
          value: value.response_value, // Use the address string for value
          response_value: value.response_value,
          selected_options: value.selected_options || [],
          location_data: value.location_data,
        }
      } else if (typeof value === 'string') {
        // This is a string value from another field type
        responseData = {
          question_id: question.id,
          value: value,
          response_value: value,
          selected_options: [],
        }
      } else {
        // Exit if the value is not of a recognized type
        return
      }

      // Add file attachments if they exist
      if (files && files.length > 0) {
        responseData.file_attachments = files.map((file) => ({
          filename: file.name,
          file_path: '', // file_path can be updated after upload
          file_size: file.size,
          mime_type: file.type,
        }))
      }

      // Update local state for an optimistic UI
      setCurrentInspection((prevInspection) => {
        const newResponses = [...prevInspection.responses]
        const responseIndex = newResponses.findIndex(
          (r) => r.question_id === question.id,
        )

        const optimisticResponse: Response = {
          ...(responseIndex !== -1 ? newResponses[responseIndex] : {}),
          ...responseData,
          id: responseIndex !== -1 ? newResponses[responseIndex].id : undefined,
          created_at:
            responseIndex !== -1
              ? newResponses[responseIndex].created_at
              : new Date().toISOString(),
          updated_at: new Date().toISOString(),
          inspection_id: currentInspection.id,
          points_earned: 0,
          points_possible: 0,
          manual_score: false,
          inspector_notes:
            typeof value === 'object' && 'location_data' in value
              ? value.inspector_notes ||
                (responseIndex !== -1
                  ? newResponses[responseIndex].inspector_notes
                  : '') ||
                ''
              : (responseIndex !== -1
                  ? newResponses[responseIndex].inspector_notes
                  : '') || '',
          file_attachments:
            responseData.file_attachments ||
            (responseIndex !== -1
              ? newResponses[responseIndex].file_attachments
              : []) ||
            [],
          location_data: responseData.location_data || null,
        }

        if (responseIndex !== -1) {
          newResponses[responseIndex] = optimisticResponse
        } else {
          newResponses.push(optimisticResponse)
        }

        return { ...prevInspection, responses: newResponses }
      })

      // Add to unsaved changes
      setUnsavedChanges((prev) => ({
        ...prev,
        [question.id]: responseData,
      }))
    },
    [currentInspection.id],
  )

  // Handle individual field save
  const handleFieldSave = async (questionId: number) => {
    if (!unsavedChanges[questionId]) return

    setSavingFields((prev) => ({ ...prev, [questionId]: true }))
    try {
      const result = await saveResponse(
        currentInspection.id,
        String(questionId),
        unsavedChanges[questionId],
      )

      console.log('result after save', result)

      if (typeof result === 'object' && result !== null && 'data' in result) {
        const updatedInspection = result.data as Inspection
        setCurrentInspection(updatedInspection)

        // Remove from unsaved changes
        setUnsavedChanges((prev) => {
          const next = { ...prev }
          delete next[questionId]
          return next
        })

        toast.success('Response saved')
      } else {
        // Handle cases where the response might be a simple message
        console.warn('Received unexpected response format:', result)
        toast.error('Failed to save response: unexpected format')
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

  async function handlePauseInspection(inspection_id: string) {
    setPausing(true)
    try {
      const res = await pauseInspection(inspection_id)
      if (res?.success) {
        toast.success(res.success)
        router.push(`/dashboard/inspections/`)
      } else {
        toast.error(res?.message || 'Failed to pause inspection')
      }
    } catch (error) {
      toast.error(
        (error as Error)?.message || 'An error occurred, please try again',
      )
    } finally {
      setPausing(false)
    }
  }

  const handleComplete = async () => {
    setIsSubmitting(true)
    try {
      const res = await completeInspection(currentInspection.id)
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
    setCurrentInspection((prev) => ({
      ...prev,
      responses: prev.responses.map((response) =>
        response.question_id === activeQuestionId
          ? ({ ...response, inspector_notes: note } as Response)
          : response,
      ),
    }))

    // Add to unsaved changes
    setUnsavedChanges((prev) => ({
      ...prev,
      [activeQuestionId]: responseData,
    }))

    // Save immediately for notes
    await saveResponse(
      currentInspection.id,
      String(activeQuestionId),
      responseData,
    )
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
    setCurrentInspection((prev) => ({
      ...prev,
      responses: prev.responses.map((response) =>
        response.question_id === activeQuestionId
          ? ({
              ...response,
              file_attachments: responseData.file_attachments,
            } as Response)
          : response,
      ),
    }))

    // Add to unsaved changes
    setUnsavedChanges((prev) => ({
      ...prev,
      [activeQuestionId]: responseData,
    }))

    // Save immediately for files
    await saveResponse(
      currentInspection.id,
      String(activeQuestionId),
      responseData,
    )
    setIsFileDialogOpen(false)
    setSelectedFile(null)
  }

  // Calculate completion percentage
  const totalQuestions = currentInspection.pages.reduce(
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
  if (!currentInspection.pages || currentInspection.pages.length === 0) {
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
            <CardTitle>{currentInspection.title}</CardTitle>
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
            <h1 className="text-2xl font-semibold">
              {currentInspection.title}
            </h1>
            <p className="text-muted-foreground">
              {currentInspection.site?.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => handlePauseInspection(currentInspection.id)}
            disabled={pause}
          >
            <Save className="mr-2 h-4 w-4" />
            {pause ? 'Pausing...' : 'Pause Inspection'}
          </Button>

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
          <Tabs defaultValue={currentInspection.pages[0].id.toString()}>
            <TabsList className="flex justify-center p-4 gap-2">
              {currentInspection.pages.map((page) => (
                <TabsTrigger
                  key={page.id}
                  value={page.id.toString()}
                  className="mx-2  p-4 text-sm font-medium  transition-colors data-[state=active]:bg-green-800 data-[state=active]:text-white data-[state=inactive]:bg-muted data-[state=inactive]:text-muted-foreground "
                >
                  {page.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {currentInspection.pages.map((page) => (
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
                        const isAnswered = !!response?.id

                        return (
                          <Card key={question.id}>
                            <CardContent className="pt-6">
                              <div className="space-y-4">
                                <FieldMapper
                                  question={question}
                                  response={response}
                                  onResponse={(value, files) =>
                                    handleResponse(
                                      question,
                                      value as string | LocationResponse,
                                      files,
                                    )
                                  }
                                  onSave={handleFieldSave}
                                  hasUnsavedChanges={hasUnsavedChange}
                                  isSaving={isSaving}
                                  isDisabled={isAnswered}
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
                                    disabled={isAnswered}
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
                                    disabled={isAnswered}
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
