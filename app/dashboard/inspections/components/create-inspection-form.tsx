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
  InspectionQuestion,
} from '@/lib/types/inspection-types'
import { PlusCircle, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { InspectionSection } from '@/lib/types/inspection-types'
import { Switch } from '@/components/ui/switch'
import {
  Card as UiCard,
  CardContent as UiCardContent,
  CardHeader as UiCardHeader,
  CardTitle as UiCardTitle,
} from '@/components/ui/card'

// Constants for A4 page height and element heights (in px)
const A4_PAGE_HEIGHT_PX = 1122
const SECTION_HEADER_HEIGHT = 40
const QUESTION_HEIGHT = 60

// Utility to group sections/questions into pages
function groupSectionsIntoPages(
  sections: InspectionSection[],
): InspectionSection[][] {
  const pages: InspectionSection[][] = []
  let currentPage: InspectionSection[] = []
  let currentHeight = 0

  for (const section of sections) {
    const sectionHeight =
      SECTION_HEADER_HEIGHT + section.questions.length * QUESTION_HEIGHT
    if (
      currentHeight + sectionHeight > A4_PAGE_HEIGHT_PX &&
      currentPage.length > 0
    ) {
      pages.push(currentPage)
      currentPage = []
      currentHeight = 0
    }
    currentPage.push(section)
    currentHeight += sectionHeight
  }
  if (currentPage.length > 0) pages.push(currentPage)
  return pages
}

// Custom QuestionsManager for inspection data structure
interface InspectionQuestionsManagerProps {
  sections: InspectionSection[]
  setSections: React.Dispatch<React.SetStateAction<InspectionSection[]>>
  section: InspectionSection
}

function InspectionQuestionsManager({
  sections,
  setSections,
  section,
}: InspectionQuestionsManagerProps) {
  const [expandedQuestions, setExpandedQuestions] = useState<string[]>([])

  const addQuestion = (sectionIndex: number) => {
    const newSections = [...sections]
    newSections[sectionIndex].questions.push({
      id: `question-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)}`,
      name: 'New question?',
      response: null,
      field_type: 'TEXT',
      required: false,
      is_flagged: false,
      flag_rule: {},
      response_options: [],
      score: 0,
      note: '',
      attachment: null,
      action: null,
    })
    setSections(newSections)
    setExpandedQuestions([
      ...expandedQuestions,
      newSections[sectionIndex].questions[
        newSections[sectionIndex].questions.length - 1
      ].id,
    ])
  }

  const updateQuestion = (
    sectionIndex: number,
    questionIndex: number,
    field: keyof InspectionQuestion,
    value:
      | string
      | boolean
      | number
      | null
      | {
          operator?: string
          value?: string | number
          value2?: string | number
        },
  ) => {
    const newSections = [...sections]
    newSections[sectionIndex].questions[questionIndex][field] = value as never
    // Clear response options if field type is changed from SELECT/MULTI_SELECT to something else
    if (
      field === 'field_type' &&
      value !== 'SELECT' &&
      value !== 'MULTI_SELECT'
    ) {
      newSections[sectionIndex].questions[questionIndex].response_options = []
    }
    setSections(newSections)
  }

  const removeQuestion = (sectionIndex: number, questionIndex: number) => {
    const newSections = [...sections]
    const qid = newSections[sectionIndex].questions[questionIndex].id
    newSections[sectionIndex].questions.splice(questionIndex, 1)
    setSections(newSections)
    setExpandedQuestions(expandedQuestions.filter((id) => id !== qid))
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
    const temp = questions[questionIndex]
    questions[questionIndex] = questions[newIndex]
    questions[newIndex] = temp
    newSections[sectionIndex].questions = questions
    setSections(newSections)
  }

  const toggleQuestionExpanded = (qid: string) => {
    setExpandedQuestions((prev) =>
      prev.includes(qid) ? prev.filter((id) => id !== qid) : [...prev, qid],
    )
  }

  const sectionIndex = sections.findIndex((s) => s.id === section.id)

  // Helper for flag rule value
  function safeString(val: string | number | undefined | null): string {
    if (typeof val === 'string') return val
    if (typeof val === 'number') return String(val)
    return ''
  }

  // Response options for select/multi-select
  function updateResponseOptions(
    sectionIndex: number,
    questionIndex: number,
    options: string[],
  ) {
    const newSections = [...sections]
    newSections[sectionIndex].questions[
      questionIndex
    ].response_options = options
    setSections(newSections)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm text-muted-foreground">Questions</h4>
        <Button
          onClick={() => addQuestion(sectionIndex)}
          variant="outline"
          size="sm"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Question
        </Button>
      </div>
      {section.questions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-md border border-dashed py-6">
          <div className="text-muted-foreground mb-2">
            <PlusCircle className="h-8 w-8 mx-auto" />
          </div>
          <p className="text-center text-sm text-muted-foreground mb-3">
            No questions added to this section
          </p>
          <Button
            onClick={() => addQuestion(sectionIndex)}
            size="sm"
            variant="outline"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Question
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {section.questions.map((question, questionIndex) => (
            <UiCard
              key={question.id}
              className={`border ${
                expandedQuestions.includes(question.id) ? 'border-primary' : ''
              }`}
            >
              <UiCardHeader
                className="p-4 cursor-pointer"
                onClick={() => toggleQuestionExpanded(question.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UiCardTitle className="text-sm">
                      {question.name || 'New question?'}
                    </UiCardTitle>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        moveQuestion(sectionIndex, questionIndex, 'up')
                      }}
                      disabled={questionIndex === 0}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        moveQuestion(sectionIndex, questionIndex, 'down')
                      }}
                      disabled={questionIndex === section.questions.length - 1}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeQuestion(sectionIndex, questionIndex)
                      }}
                      aria-label="Delete Question"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </UiCardHeader>
              {expandedQuestions.includes(question.id) && (
                <UiCardContent className="px-4 pt-0 pb-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`question-text-${question.id}`}>
                        Question Text
                      </Label>
                      <Input
                        id={`question-text-${question.id}`}
                        value={question.name}
                        onChange={(e) =>
                          updateQuestion(
                            sectionIndex,
                            questionIndex,
                            'name',
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`question-type-${question.id}`}>
                        Field Type
                      </Label>
                      <Select
                        value={question.field_type || 'TEXT'}
                        onValueChange={(value) =>
                          updateQuestion(
                            sectionIndex,
                            questionIndex,
                            'field_type',
                            value,
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select field type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BOOLEAN">Yes/No</SelectItem>
                          <SelectItem value="TEXT">Text</SelectItem>
                          <SelectItem value="DATE">Date</SelectItem>
                          <SelectItem value="PHOTO">Photo</SelectItem>
                          <SelectItem value="NUMBER">Number</SelectItem>
                          <SelectItem value="SELECT">Single Select</SelectItem>
                          <SelectItem value="MULTI_SELECT">
                            Multi Select
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          id={`question-required-${question.id}`}
                          checked={!!question.required}
                          onCheckedChange={(checked) =>
                            updateQuestion(
                              sectionIndex,
                              questionIndex,
                              'required',
                              checked,
                            )
                          }
                        />
                        <Label htmlFor={`question-required-${question.id}`}>
                          Required
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          id={`question-flagged-${question.id}`}
                          checked={!!question.is_flagged}
                          onCheckedChange={(checked) =>
                            updateQuestion(
                              sectionIndex,
                              questionIndex,
                              'is_flagged',
                              checked,
                            )
                          }
                        />
                        <Label htmlFor={`question-flagged-${question.id}`}>
                          Flag Critical Issue
                        </Label>
                      </div>
                    </div>
                    {/* Response Options for SELECT/MULTI_SELECT */}
                    {(question.field_type === 'SELECT' ||
                      question.field_type === 'MULTI_SELECT') && (
                      <div className="space-y-2">
                        <Label>Response Options</Label>
                        <div className="flex flex-col gap-2">
                          {(question.response_options || []).map(
                            (opt: string, idx: number) => (
                              <div
                                key={idx}
                                className="flex gap-2 items-center"
                              >
                                <Input
                                  value={opt}
                                  onChange={(e) => {
                                    const opts = [
                                      ...(question.response_options || []),
                                    ]
                                    opts[idx] = e.target.value
                                    updateResponseOptions(
                                      sectionIndex,
                                      questionIndex,
                                      opts,
                                    )
                                  }}
                                  className="flex-1"
                                  placeholder={`Option ${idx + 1}`}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    const opts = [
                                      ...(question.response_options || []),
                                    ]
                                    opts.splice(idx, 1)
                                    updateResponseOptions(
                                      sectionIndex,
                                      questionIndex,
                                      opts,
                                    )
                                  }}
                                  aria-label="Remove Option"
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            ),
                          )}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateResponseOptions(
                                sectionIndex,
                                questionIndex,
                                [...(question.response_options || []), ''],
                              )
                            }
                          >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add Option
                          </Button>
                        </div>
                      </div>
                    )}
                    {/* Flagging UI */}
                    {question.is_flagged && (
                      <div className="space-y-2">
                        <Label className="font-medium">Flag when…</Label>
                        <div className="flex gap-2 items-center">
                          <select
                            className="border rounded px-2 py-1 text-sm"
                            aria-label="Flag operator"
                            value={safeString(question.flag_rule?.operator)}
                            onChange={(e) =>
                              updateQuestion(
                                sectionIndex,
                                questionIndex,
                                'flag_rule',
                                {
                                  ...question.flag_rule,
                                  operator: e.target.value,
                                },
                              )
                            }
                          >
                            <option value="">Select condition</option>
                            <option value="contains">Contains</option>
                            <option value="equals">Equals</option>
                            <option value="regex">Matches regex</option>
                            <option value="<">Less than</option>
                            <option value=">">Greater than</option>
                            <option value="=">Equal to</option>
                          </select>
                          <input
                            type="text"
                            className="border rounded px-2 py-1 text-sm"
                            aria-label="Flag value"
                            placeholder="Enter value"
                            value={safeString(question.flag_rule?.value)}
                            onChange={(e) =>
                              updateQuestion(
                                sectionIndex,
                                questionIndex,
                                'flag_rule',
                                {
                                  ...question.flag_rule,
                                  value: e.target.value,
                                },
                              )
                            }
                            disabled={!question.flag_rule?.operator}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </UiCardContent>
              )}
            </UiCard>
          ))}
        </div>
      )}
    </div>
  )
}

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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Sections and Questions</h2>
            <Button
              type="button"
              variant="outline"
              onClick={addSection}
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Add Section
            </Button>
          </div>

          {/* Automatic A4 Page Grouping */}
          {groupSectionsIntoPages(sections).map((pageSections, pageIndex) => (
            <div
              key={pageIndex}
              className="mb-8 pb-8 border-b border-dashed border-gray-300"
            >
              <div className="text-xs text-gray-400 mb-4 font-medium">
                Page {pageIndex + 1}
              </div>

              <div className="space-y-4">
                {pageSections.map((section) => {
                  const globalSectionIndex = sections.indexOf(section)
                  return (
                    <Card key={section.id} className="border border-gray-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex  items-center gap-2">
                            <Input
                              value={section.name}
                              onChange={(e) =>
                                updateSectionName(
                                  globalSectionIndex,
                                  e.target.value,
                                )
                              }
                              placeholder="Section name"
                              className="w-full"
                            />
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                moveSection(globalSectionIndex, 'up')
                              }
                              disabled={globalSectionIndex === 0}
                            >
                              <ChevronUp className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                moveSection(globalSectionIndex, 'down')
                              }
                              disabled={
                                globalSectionIndex === sections.length - 1
                              }
                            >
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeSection(globalSectionIndex)}
                              disabled={sections.length === 1}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <InspectionQuestionsManager
                          sections={sections}
                          setSections={setSections}
                          section={section}
                        />
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}

          {sections.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-md border border-dashed py-12">
              <div className="text-muted-foreground mb-4">
                <PlusCircle className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium mb-2">No Sections Added</h3>
              <p className="text-center text-muted-foreground mb-4">
                Add sections to organize your inspection questions
              </p>
              <Button onClick={addSection} className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Add First Section
              </Button>
            </div>
          )}
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
