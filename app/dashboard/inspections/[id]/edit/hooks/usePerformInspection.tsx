'use client'

import { useCallback, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Inspection,
  LocationResponse,
  Question,
  Response,
} from '@/lib/types/inspection-types'
import { toast } from 'sonner'
import {
  completeInspection,
  pauseInspection,
  saveResponse,
} from '../../../actions/actions'
import { ResponseData } from '@/app/dashboard/inspections/types/types'

export function usePerformInspection(inspection: Inspection) {
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
  const [unsavedChanges, setUnsavedChanges] = useState<
    Record<number, ResponseData>
  >({})
  const [savingFields, setSavingFields] = useState<Record<number, boolean>>({})

  const [fileAttachments, setFileAttachments] = useState<File[]>([])
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

      if (typeof result === 'object' && result !== null && 'data' in result) {
        const updatedInspection = result.data as Inspection
        setCurrentInspection(updatedInspection)

        // Remove from unsaved changes
        setUnsavedChanges((prev) => {
          const next = { ...prev }
          delete next[questionId]
          return next
        })

        toast.success(result.success)
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

  const responses = useMemo(
    () =>
      currentInspection.responses.reduce((acc, response) => {
        acc[response.question_id] = response
        return acc
      }, {} as Record<number, Response>),
    [currentInspection.responses],
  )
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

  const hasUnsavedChanges = Object.keys(unsavedChanges).length > 0

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

      // Merge any existing note from unsavedChanges
      setUnsavedChanges((prev) => {
        const existing = prev[question.id] || {}
        return {
          ...prev,
          [question.id]: {
            ...responseData,
            inspector_notes:
              existing.inspector_notes || responseData.inspector_notes,
          },
        }
      })

      // Update local state for an optimistic UI
      setCurrentInspection((prevInspection) => {
        const newResponses = [...prevInspection.responses]
        const responseIndex = newResponses.findIndex(
          (r) => r.question_id === question.id,
        )
        // Determine the note to use:
        let preservedNote = ''
        if (
          typeof value === 'object' &&
          value !== null &&
          'inspector_notes' in value &&
          value.inspector_notes
        ) {
          preservedNote = value.inspector_notes
        } else if (
          responseIndex !== -1 &&
          newResponses[responseIndex].inspector_notes
        ) {
          preservedNote = newResponses[responseIndex].inspector_notes
        } else if (
          prevInspection &&
          unsavedChanges &&
          unsavedChanges[question.id] &&
          unsavedChanges[question.id].inspector_notes
        ) {
          preservedNote =
            unsavedChanges[question.id].inspector_notes ||
            (responseIndex !== -1
              ? newResponses[responseIndex].inspector_notes
              : '') ||
            ''
        }

        const optimisticResponse: Response = {
          ...(responseIndex !== -1 ? newResponses[responseIndex] : {}),
          ...responseData,
          id: responseIndex !== -1 ? newResponses[responseIndex].id : undefined,
          created_at:
            responseIndex !== -1
              ? newResponses[responseIndex].created_at
              : new Date().toISOString(),
          updated_at: new Date().toISOString(),
          inspection_id: prevInspection.id,
          points_earned: 0,
          points_possible: 0,
          manual_score: false,
          inspector_notes: preservedNote,
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
    },
    [currentInspection.id],
  )

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
      toast.success(res.success)
      router.push('/dashboard/inspections')
    } catch (error) {
      console.error('Error completing inspection:', error)
      toast.error((error as Error)?.message || 'Failed to complete inspection')
    } finally {
      setIsSubmitting(false)
    }
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
    // await saveResponse(
    //   currentInspection.id,
    //   String(activeQuestionId),
    //   responseData,
    // )
    setIsFileDialogOpen(false)
    setSelectedFile(null)
  }

  async function handleAttachFile1() {
    if (!activeQuestionId || !selectedFile) return
  }

  async function handleAddANote() {
    if (!activeQuestionId) return

    // Merge note into unsavedChanges for this question
    setUnsavedChanges((prev) => {
      const existing = prev[activeQuestionId] || {}
      return {
        ...prev,
        [activeQuestionId]: {
          ...existing,
          inspector_notes: note,
          question_id: activeQuestionId,
        },
      }
    })

    // Also update local state for immediate UI feedback
    setCurrentInspection((prev) => {
      const exists = prev.responses.some(
        (res) => res.question_id === activeQuestionId,
      )
      if (exists) {
        return {
          ...prev,
          responses: prev.responses.map((res) =>
            res.question_id === activeQuestionId
              ? { ...res, inspector_notes: note }
              : res,
          ),
        }
      } else {
        // Create a new response object with just the note
        const newResponse = {
          question_id: activeQuestionId,
          value: '',
          selected_options: [],
          response_value: '',
          inspector_notes: note,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          inspection_id: prev.id,
          points_earned: 0,
          points_possible: 0,
          manual_score: false,
          file_attachments: [],
          location_data: null,
        }
        return {
          ...prev,
          responses: [...prev.responses, newResponse],
        }
      }
    })

    setIsNoteDialogOpen(false)
    setNote('')
  }

  return {
    currentInspection,
    handleAttachFile,
    setCurrentInspection,
    isSubmitting,
    setIsSubmitting,
    pause,
    setPausing,
    isNoteDialogOpen,
    setIsNoteDialogOpen,
    isFileDialogOpen,
    setIsFileDialogOpen,
    activeQuestionId,
    setActiveQuestionId,
    note,
    setNote,
    selectedFile,
    setSelectedFile,
    router,
    handleFieldSave,
    unsavedChanges,
    setUnsavedChanges,
    savingFields,
    handleAddANote,
    setSavingFields,
    handleComplete,
    handleResponse,
    completionPercentage,
    hasUnsavedChanges,
    responses,
    handlePauseInspection,
    fileAttachments,
    setFileAttachments,
  }
}
