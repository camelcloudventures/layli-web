'use client'

import type React from 'react'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { mockLocations } from '@/lib/data/mock-locations'
import { saveInspection } from '@/lib/data/mock-inspections'
import type {
  Inspection,
  InspectionSection,
} from '@/lib/types/inspection-types'
import { PlusCircle, Trash2, ArrowDown, ArrowUp } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export function CreateInspectionForm() {
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)
  const [inspectionName, setInspectionName] = useState('')
  const [locationId, setLocationId] = useState('')
  const [preparedBy, setPreparedBy] = useState('')
  const [scheduledDate, setScheduledDate] = useState('')
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [createdInspection, setCreatedInspection] = useState<Inspection | null>(
    null,
  )
  const [sections, setSections] = useState<InspectionSection[]>([
    {
      id: `section-${Date.now()}`,
      name: 'General Information',
      questions: [
        {
          id: `question-${Date.now()}`,
          name: 'Is all required PPE available?',
          response: null,
          score: 0,
          note: '',
          attachment: null,
          action: null,
        },
      ],
    },
  ])

  const addSection = () => {
    setSections([
      ...sections,
      {
        id: `section-${Date.now()}-${sections.length}`,
        name: `Section ${sections.length + 1}`,
        questions: [],
      },
    ])
  }

  const removeSection = (sectionIndex: number) => {
    const newSections = [...sections]
    newSections.splice(sectionIndex, 1)
    setSections(newSections)
  }

  const updateSectionName = (sectionIndex: number, name: string) => {
    const newSections = [...sections]
    newSections[sectionIndex].name = name
    setSections(newSections)
  }

  const addQuestion = (sectionIndex: number) => {
    const newSections = [...sections]
    newSections[sectionIndex].questions.push({
      id: `question-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)}`,
      name: '',
      response: null,
      score: 0,
      note: '',
      attachment: null,
      action: null,
    })
    setSections(newSections)
  }

  const updateQuestionName = (
    sectionIndex: number,
    questionIndex: number,
    name: string,
  ) => {
    const newSections = [...sections]
    newSections[sectionIndex].questions[questionIndex].name = name
    setSections(newSections)
  }

  const removeQuestion = (sectionIndex: number, questionIndex: number) => {
    const newSections = [...sections]
    newSections[sectionIndex].questions.splice(questionIndex, 1)
    setSections(newSections)
  }

  const moveQuestion = (
    sectionIndex: number,
    questionIndex: number,
    direction: 'up' | 'down',
  ) => {
    if (
      (direction === 'up' && questionIndex === 0) ||
      (direction === 'down' &&
        questionIndex === sections[sectionIndex].questions.length - 1)
    ) {
      return
    }

    const newSections = [...sections]
    const questions = [...newSections[sectionIndex].questions]
    const newIndex = direction === 'up' ? questionIndex - 1 : questionIndex + 1

    // Swap questions using a temporary variable
    const temp = questions[questionIndex]
    questions[questionIndex] = questions[newIndex]
    questions[newIndex] = temp

    newSections[sectionIndex].questions = questions
    setSections(newSections)
  }

  const moveSection = (sectionIndex: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && sectionIndex === 0) ||
      (direction === 'down' && sectionIndex === sections.length - 1)
    ) {
      return
    }

    const newSections = [...sections]
    const newIndex = direction === 'up' ? sectionIndex - 1 : sectionIndex + 1

    // Swap sections using a temporary variable
    const temp = newSections[sectionIndex]
    newSections[sectionIndex] = newSections[newIndex]
    newSections[newIndex] = temp

    setSections(newSections)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!inspectionName || !locationId) {
      toast.error('Please provide an inspection name and location.')
      return
    }

    // Validate that all sections have names and at least one question
    for (const section of sections) {
      if (!section.name) {
        toast.error('All sections must have a name.')
        return
      }

      if (section.questions.length === 0) {
        toast.error(
          `Section "${section.name}" must have at least one question.`,
        )
        return
      }

      // Validate that all questions have names
      for (const question of section.questions) {
        if (!question.name) {
          toast.error(
            `A question in section "${section.name}" is missing text.`,
          )
          return
        }
      }
    }

    setIsCreating(true)

    try {
      const location = mockLocations.find((loc) => loc.id === locationId)

      if (!location) {
        throw new Error('Selected location not found')
      }

      const inspectionId = `inspection-${Date.now()}`
      const newInspection: Inspection = {
        id: inspectionId,
        name: inspectionName,
        conducted_on: scheduledDate ? new Date(scheduledDate) : new Date(),
        location: location,
        sections: sections,
        user_name: preparedBy || 'Anonymous',
        status: 'draft',
        last_modified: new Date(),
        score: null,
      }

      // Save to localStorage
      await saveInspection(newInspection)

      // Store the created inspection for the success dialog
      setCreatedInspection(newInspection)
      setShowSuccessDialog(true)
    } catch (error) {
      console.error('Error creating inspection:', error)
      toast.error('Failed to create inspection.')
      setIsCreating(false)
    }
  }

  const handleViewInspection = () => {
    if (createdInspection) {
      router.push(`/dashboard/inspections/${createdInspection.id}/report`)
    }
    setShowSuccessDialog(false)
  }

  const handleStartInspection = () => {
    if (createdInspection) {
      router.push(`/dashboard/inspections/${createdInspection.id}/edit`)
    }
    setShowSuccessDialog(false)
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>New Inspection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="inspection-name">Inspection Name</Label>
              <Input
                id="inspection-name"
                value={inspectionName}
                onChange={(e) => setInspectionName(e.target.value)}
                placeholder="Enter inspection name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Select value={locationId} onValueChange={setLocationId}>
                <SelectTrigger id="location">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {mockLocations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prepared-by">Prepared By</Label>
              <Input
                id="prepared-by"
                value={preparedBy}
                onChange={(e) => setPreparedBy(e.target.value)}
                placeholder="Enter your name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduled-date">Scheduled Date</Label>
              <Input
                id="scheduled-date"
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Sections and Questions</h2>

          <Accordion
            type="multiple"
            defaultValue={sections.map((_, i) => `section-${i}`)}
          >
            {sections.map((section, sectionIndex) => (
              <AccordionItem key={section.id} value={`section-${sectionIndex}`}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="font-medium">
                      {section.name || `Section ${sectionIndex + 1}`}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {section.questions.length} question
                      {section.questions.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center space-x-2">
                      <Input
                        value={section.name}
                        onChange={(e) =>
                          updateSectionName(sectionIndex, e.target.value)
                        }
                        placeholder="Section name"
                        className="flex-1"
                      />
                      <div className="flex space-x-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => moveSection(sectionIndex, 'up')}
                          disabled={sectionIndex === 0}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => moveSection(sectionIndex, 'down')}
                          disabled={sectionIndex === sections.length - 1}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeSection(sectionIndex)}
                          disabled={sections.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {section.questions.map((question, questionIndex) => (
                      <div
                        key={question.id}
                        className="pl-4 border-l-2 border-gray-200 space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <div className="text-sm text-muted-foreground w-6">
                            {questionIndex + 1}.
                          </div>
                          <Input
                            value={question.name || ''}
                            onChange={(e) =>
                              updateQuestionName(
                                sectionIndex,
                                questionIndex,
                                e.target.value,
                              )
                            }
                            placeholder="Question text"
                            className="flex-1"
                          />
                          <div className="flex space-x-1">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                moveQuestion(sectionIndex, questionIndex, 'up')
                              }
                              disabled={questionIndex === 0}
                            >
                              <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                moveQuestion(
                                  sectionIndex,
                                  questionIndex,
                                  'down',
                                )
                              }
                              disabled={
                                questionIndex === section.questions.length - 1
                              }
                            >
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                removeQuestion(sectionIndex, questionIndex)
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addQuestion(sectionIndex)}
                      className="mt-2"
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Question
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <Button
            type="button"
            variant="outline"
            onClick={addSection}
            className="mt-4"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Section
          </Button>
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard/inspections')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isCreating}>
            {isCreating ? 'Creating...' : 'Create Inspection'}
          </Button>
        </div>
      </form>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inspection Created</DialogTitle>
            <DialogDescription>
              Your inspection &quot;{createdInspection?.name}&quot; has been
              created successfully.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={handleViewInspection}
              className="sm:flex-1"
            >
              View Inspection
            </Button>
            <Button onClick={handleStartInspection} className="sm:flex-1">
              Start Inspection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
