'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  getInspectionById,
  updateInspection,
} from '@/lib/data/mock-inspections'
import type {
  Inspection,
  InspectionQuestion,
} from '@/lib/types/inspection-types'
import { ArrowLeft, Save, CheckCircle } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import { toast } from 'sonner'
import { InspectionQuestionForm } from '../../components/inspection-question-form'

export default function EditInspectionPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [completing, setCompleting] = useState(false)
  const [inspection, setInspection] = useState<Inspection | null>(null)
  const [activeTab, setActiveTab] = useState('section-0')
  const [inspectorName, setInspectorName] = useState('')
  const [showCompleteDialog, setShowCompleteDialog] = useState(false)

  useEffect(() => {
    const fetchInspection = async () => {
      try {
        const data = await getInspectionById(params.id)
        if (data) {
          setInspection(data)
          setInspectorName(data.user_name || '')
        } else {
          toast.error('Inspection not found')
          router.push('/dashboard/inspections')
        }
      } catch (error) {
        console.error('Error fetching inspection:', error)
        toast.error('Failed to load inspection')
      } finally {
        setLoading(false)
      }
    }

    fetchInspection()
  }, [params.id, router, toast])

  const handleQuestionChange = (
    sectionIndex: number,
    questionIndex: number,
    updatedQuestion: InspectionQuestion,
  ) => {
    if (!inspection) return

    setInspection((prev) => {
      if (!prev) return prev

      const updatedSections = [...prev.sections]
      const updatedQuestions = [...updatedSections[sectionIndex].questions]

      updatedQuestions[questionIndex] = updatedQuestion

      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        questions: updatedQuestions,
      }

      return {
        ...prev,
        sections: updatedSections,
        last_modified: new Date(),
      }
    })

    // Auto-save to localStorage
    if (inspection) {
      const updatedSections = [...inspection.sections]
      updatedSections[sectionIndex].questions[questionIndex] = updatedQuestion
      updateInspection({
        ...inspection,
        sections: updatedSections,
        last_modified: new Date(),
      })
    }
  }

  const handleSave = async () => {
    if (!inspection) return
    setSaving(true)

    try {
      const updatedInspection = {
        ...inspection,
        user_name: inspectorName,
        last_modified: new Date(),
      }

      await updateInspection(updatedInspection)

      toast.success('Inspection Saved')

      router.push('/dashboard/inspections')
    } catch (error) {
      console.error('Error saving inspection:', error)
      toast.error('Failed to save inspection')
    } finally {
      setSaving(false)
    }
  }

  // Check if all questions have been answered
  const areAllQuestionsAnswered = () => {
    if (!inspection) return false

    return inspection.sections.every((section) =>
      section.questions.every((question) => question.response !== null),
    )
  }

  const handleCompleteClick = () => {
    if (!inspection) return

    if (!inspectorName.trim()) {
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
    if (!inspection) return
    setCompleting(true)

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
              question.score = 10
            } else {
              question.score = 0
            }
          }
        })
      })

      const score =
        totalQuestions > 0
          ? Math.round((passedQuestions / totalQuestions) * 100)
          : 0

      const updatedInspection = {
        ...inspection,
        user_name: inspectorName,
        status: 'completed' as const,
        last_modified: new Date(),
        completed_on: new Date(),
        score: score,
      }

      await updateInspection(updatedInspection)

      toast.success('Inspection Completed')

      router.push(`/dashboard/inspections/${inspection.id}/report`)
    } catch (error) {
      console.error('Error completing inspection:', error)
      toast.error('Failed to complete inspection')
    } finally {
      setCompleting(false)
      setShowCompleteDialog(false)
    }
  }

  // Calculate completion percentage
  const calculateCompletion = () => {
    if (!inspection) return 0

    let totalQuestions = 0
    let answeredQuestions = 0

    inspection.sections.forEach((section) => {
      section.questions.forEach((question) => {
        totalQuestions++
        if (question.response !== null) answeredQuestions++
      })
    })

    return totalQuestions > 0
      ? Math.round((answeredQuestions / totalQuestions) * 100)
      : 0
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Skeleton className="h-10 w-10 mr-4" />
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="mt-2 h-4 w-64" />
          </div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!inspection) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Inspection not found</p>
          <Button
            onClick={() => router.push('/dashboard/inspections')}
            className="mt-4"
          >
            Back to Inspections
          </Button>
        </CardContent>
      </Card>
    )
  }

  const completionPercentage = calculateCompletion()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard/inspections')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {inspection.name}
            </h1>
            <p className="text-muted-foreground">{inspection.location.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Saving...' : 'Save Progress'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Inspection Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                Completion: {completionPercentage}%
              </span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  completionPercentage >= 100
                    ? 'bg-green-500'
                    : completionPercentage >= 50
                    ? 'bg-amber-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-4">
            {inspection.sections.map((section, index) => (
              <TabsTrigger key={section.id} value={`section-${index}`}>
                {section.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {inspection.sections.map((section, sectionIndex) => (
            <TabsContent key={section.id} value={`section-${sectionIndex}`}>
              <Card>
                <CardHeader>
                  <CardTitle>{section.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {section.questions.map((question, questionIndex) => (
                      <InspectionQuestionForm
                        key={question.id}
                        question={question}
                        onChange={(updatedQuestion) =>
                          handleQuestionChange(
                            sectionIndex,
                            questionIndex,
                            updatedQuestion,
                          )
                        }
                        sectionIndex={sectionIndex}
                        questionIndex={questionIndex}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Complete Inspection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="inspector-name">Inspector Name</Label>
                <Input
                  id="inspector-name"
                  value={inspectorName}
                  onChange={(e) => setInspectorName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="flex justify-end">
                <AlertDialog
                  open={showCompleteDialog}
                  onOpenChange={setShowCompleteDialog}
                >
                  <AlertDialogTrigger asChild>
                    <Button onClick={handleCompleteClick} disabled={completing}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      {completing ? 'Completing...' : 'Complete Inspection'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Complete Inspection</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to complete this inspection? Once
                        completed, you won&apos;t be able to make further
                        changes.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleComplete}>
                        Complete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
