"use client"

import type React from "react"
import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription } from "@/components/ui/alert"
  import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Save, ClipboardCheck } from "lucide-react"
import { calculateScore } from "@/lib/score-utils"
import type { Inspection, InspectionQuestion } from "@/lib/types/inspection-types"
import { InspectionQuestionForm } from "./inspection-question-form"
import { updateInspection } from "@/lib/data/mock-inspections"
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
} from "@/components/ui/alert-dialog"

interface InspectionFormProps {
  inspection: Inspection
  isEditing?: boolean
}

export function InspectionForm({ inspection: initialInspection }: InspectionFormProps) {
  const [inspection, setInspection] = useState<Inspection>({
    ...initialInspection,
    user_name: "", // Start with empty user_name regardless of what's in initialInspection
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
  const [showCompleteDialog, setShowCompleteDialog] = useState(false)
  const router = useRouter()

  const handleQuestionChange = (sectionIndex: number, questionIndex: number, updatedQuestion: InspectionQuestion) => {
    const updatedSections = [...inspection.sections]
    updatedSections[sectionIndex].questions[questionIndex] = updatedQuestion

    const updatedInspection = {
      ...inspection,
      sections: updatedSections,
      last_modified: new Date(),
    }

    // Recalculate score
    const totalQuestions = updatedInspection.sections.reduce((total, section) => {
      return total + section.questions.filter((q) => q.response !== null).length
    }, 0)

    const answeredYes = updatedInspection.sections.reduce(
      (total, section) => total + section.questions.filter((q) => q.response === true).length,
      0,
    )

    const score = totalQuestions > 0 ? Math.round((answeredYes / totalQuestions) * 100) : null

    setInspection({
      ...updatedInspection,
      score: score,
    })

    // Save to localStorage on every question change
    updateInspection({
      ...updatedInspection,
      score: score,
    })
  }

  const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInspection({
      ...inspection,
      user_name: e.target.value,
    })
  }

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // Update in localStorage
      await updateInspection(inspection)

      toast.success('Progress saved')

      router.push('/dashboard/inspections')
    } catch (error) {
      console.error('Error saving inspection progress:', error)
      toast.error('Failed to save inspection progress.')
    } finally {
      setIsSaving(false)
    }
  }

  // Check if all questions have been answered
  const areAllQuestionsAnswered = () => {
    return inspection.sections.every((section) => section.questions.every((question) => question.response !== null))
  }

  const handleCompleteClick = () => {
    if (!inspection.user_name) {
      toast.error('Inspector Name Required')
      return
    }

    if (!areAllQuestionsAnswered()) {
      toast.error('Incomplete Inspection')
      return
    }

    setShowCompleteDialog(true)
  }

  const handleComplete = async () => {
    setIsCompleting(true)

    try {
      // Calculate score
      let totalQuestions = 0
      let passedQuestions = 0

      inspection.sections.forEach((section) => {
        section.questions.forEach((question) => {
          if (question.response !== null) {
            totalQuestions++
            if (question.response === true) {
              passedQuestions++
            }
          }
        })
      })

      const score = totalQuestions > 0 ? Math.round((passedQuestions / totalQuestions) * 100) : 0

      const updatedInspection = {
        ...inspection,
        status: 'completed',
        completed_on: new Date(),
        score: score,
      }

      // Update in localStorage
      await updateInspection(updatedInspection as Inspection)

      toast.success('Inspection completed')

      router.push('/dashboard/inspections')
    } catch (error) {
      console.error('Error completing inspection:', error)
      toast.error('Failed to complete inspection.')
    } finally {
      setIsCompleting(false)
      setShowCompleteDialog(false)
    }
  }

  const hasQuestionsWithActions = inspection.sections.some((section) =>
    section.questions.some((question) => question.action),
  )

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{inspection.name}</h1>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard/inspections")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Progress'}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Location</label>
            <p className="text-sm">{inspection.location.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Conducted On</label>
            <p className="text-sm">{new Date(inspection.conducted_on).toLocaleDateString()}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" defaultValue={inspection.sections.map((_, i) => `section-${i}`)}>
            {inspection.sections.map((section, sectionIndex) => (
              <AccordionItem key={sectionIndex} value={`section-${sectionIndex}`}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="font-medium">{section.name}</div>
                    <Badge variant="outline">Score: {calculateScore(section.questions)}%</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    {section.questions.map((question, questionIndex) => (
                      <InspectionQuestionForm
                        key={questionIndex}
                        question={question}
                        onChange={(updatedQuestion) =>
                          handleQuestionChange(sectionIndex, questionIndex, updatedQuestion)
                        }
                        sectionIndex={sectionIndex}
                        questionIndex={questionIndex}
                      />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {hasQuestionsWithActions && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Actions have been created based on some questions. These will be available in the Actions dashboard.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Completion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="userName" className="text-sm font-medium block mb-1">
                Name of person conducting this inspection *
              </label>
              <Input
                id="userName"
                placeholder="Enter name"
                value={inspection.user_name || ""}
                onChange={handleUserNameChange}
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={handleSave} disabled={isSaving || isCompleting}>
            <Save className="mr-2 h-4 w-4" />
            Save Progress
          </Button>

          <AlertDialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
            <AlertDialogTrigger asChild>
              <Button type="button" onClick={handleCompleteClick} disabled={isSaving || isCompleting}>
                <ClipboardCheck className="mr-2 h-4 w-4" />
                {isCompleting ? 'Completing...' : 'Complete Inspection'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Complete Inspection</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to complete this inspection? Once
                  completed, you won&apos;t be able to make further changes.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleComplete}>Complete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </form>
  )
}
