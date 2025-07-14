'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, ClipboardCheck, Save } from 'lucide-react'
import { type Inspection } from '@/lib/types/inspection-types'
import { FileAttachmentDialog } from './attachments/file-attachment-dialog'
import { NoteAttachmentDialog } from './attachments/note-attachment-dialog'
import { CurrentInspection } from './current-inspection'
import { EmptyState } from './empty-state'
import { usePerformInspection } from '../hooks/usePerformInspection'

interface Props {
  inspection: Inspection
}

export function DoInspectionForm({ inspection }: Props) {
  const {
    currentInspection,
    isSubmitting,
    pause,
    isNoteDialogOpen,
    setIsNoteDialogOpen,
    isFileDialogOpen,
    setIsFileDialogOpen,
    setActiveQuestionId,
    note,
    setNote,
    selectedFile,
    setSelectedFile,
    router,
    handleFieldSave,
    unsavedChanges,
    savingFields,
    handleComplete,
    completionPercentage,
    hasUnsavedChanges,
    handleResponse,
    responses,
    handlePauseInspection,
    handleAttachFile,
    handleAddANote,
    fileAttachments,
    setFileAttachments,
  } = usePerformInspection(inspection)



  

  if (!currentInspection.pages || currentInspection.pages.length === 0) {
    return <EmptyState currentInspection={currentInspection} />
  }

  return (
    <div className="container mx-auto  max-w-4xl py-6 space-y-6">
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

      <Card className="shadow-none">
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

      <CurrentInspection
        currentInspection={currentInspection}
        responses={responses}
        unsavedChanges={(unsavedChanges as unknown) as Record<number, boolean>}
        savingFields={savingFields}
        handleResponse={handleResponse}
        handleFieldSave={handleFieldSave}
        setActiveQuestionId={setActiveQuestionId}
        setNote={setNote}
        setIsNoteDialogOpen={setIsNoteDialogOpen}
        setIsFileDialogOpen={setIsFileDialogOpen}
        fileAttachments={fileAttachments}
        setFileAttachments={setFileAttachments}
        />
      <NoteAttachmentDialog
        isNoteDialogOpen={isNoteDialogOpen}
        setIsNoteDialogOpen={setIsNoteDialogOpen}
        handleAddNote={handleAddANote}
        note={note}
        setNote={setNote}
      />

      <FileAttachmentDialog
        isFileDialogOpen={isFileDialogOpen}
        setIsFileDialogOpen={setIsFileDialogOpen}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        handleAttachFile={handleAttachFile}
      />
    </div>
  )
}
