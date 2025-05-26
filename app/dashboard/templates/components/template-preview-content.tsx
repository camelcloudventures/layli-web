'use client'

import { useState } from 'react'
// import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { AuditTemplate, Question } from '@/lib/types/audit-types'
import {
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  FileText,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ImageUpload } from './image-upload'

interface TemplatePreviewContentProps {
  template: AuditTemplate
}

export function TemplatePreviewContent({
  template,
}: TemplatePreviewContentProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [imageAnswers, setImageAnswersState] = useState<Record<string, string>>(
    {},
  )

  function setImageAnswers(id: string, value: string) {
    setImageAnswersState((prev) => ({ ...prev, [id]: value }))
  }

  if (!template.pages || template.pages.length === 0) {
    return (
      <div className="rounded-xl border p-8 text-center bg-white shadow">
        <FileText className="mx-auto h-16 w-16 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-bold">No Pages to Preview</h3>
        <p className="mt-2 text-muted-foreground text-base">
          Add pages, sections, and questions to see a preview of your template
        </p>
      </div>
    )
  }

  const currentPage = template.pages[currentPageIndex]
  const pageCount = template.pages.length

  const goToNextPage = () => {
    if (currentPageIndex < pageCount - 1)
      setCurrentPageIndex(currentPageIndex + 1)
  }
  const goToPrevPage = () => {
    if (currentPageIndex > 0) setCurrentPageIndex(currentPageIndex - 1)
  }

  return (
    <div className="space-y-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium">
          Template Preview: {template.title}
        </h3>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Page {currentPageIndex + 1} of {pageCount}
          </span>
          <div className="flex">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrevPage}
              disabled={currentPageIndex === 0}
              className="rounded-r-none"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={goToNextPage}
              disabled={currentPageIndex === pageCount - 1}
              className="rounded-l-none"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Card className="overflow-hidden rounded-xl shadow bg-white p-8">
        {/* {currentPage.photo && (
          <div className="relative h-48 w-full">
            <Image
              src={currentPage.photo || '/placeholder.svg'}
              alt={currentPage.title || 'Page cover'}
              fill
              className="object-cover"
            />
          </div>
        )} */}
        <CardHeader className="p-0 mb-6">
          <CardTitle className="text-2xl font-bold mb-1">
            {currentPage.title}
          </CardTitle>
          {currentPage.description && (
            <CardDescription>{currentPage.description}</CardDescription>
          )}
        </CardHeader>

        <CardContent className="space-y-8 p-0">
          {currentPage.sections.length === 0 ? (
            <div className="rounded-md border border-dashed p-6 text-center">
              <p className="text-muted-foreground text-base">
                No sections added to this page
              </p>
            </div>
          ) : (
            currentPage.sections.map((section) => (
              <div key={section.id} className="space-y-4">
                <div>
                  <h4 className="text-xl font-bold mb-1 flex items-center">
                    {section.title}
                  </h4>
                </div>
                {section.questions.length === 0 ? (
                  <div className="rounded-md border border-dashed p-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      No questions in this section
                    </p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {section.questions.map((question) => (
                      <div key={question.id} className="space-y-2">
                        <div className="flex items-center gap-2 mb-1">
                          <Label className="text-base font-semibold">
                            {question.text}
                            {question.required && (
                              <span className="text-red-500 font-bold ml-1">
                                *
                              </span>
                            )}
                          </Label>
                          {question.is_flagged && (
                            <span className="ml-auto flex items-center gap-1 rounded bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-800">
                              <AlertTriangle className="h-3 w-3" />
                              Critical
                            </span>
                          )}
                        </div>
                        <div className="pl-0">
                          {renderQuestionInput(
                            question,
                            imageAnswers,
                            setImageAnswers,
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </CardContent>

        <CardFooter className="flex justify-between border-t p-0 pt-6 mt-8">
          <Button
            variant="outline"
            onClick={goToPrevPage}
            disabled={currentPageIndex === 0}
            className="min-w-[120px]"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button
            onClick={goToNextPage}
            disabled={currentPageIndex === pageCount - 1}
            className="min-w-[120px] bg-muted text-muted-foreground"
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

function renderQuestionInput(
  question: Question,
  imageAnswers: Record<string, string>,
  setImageAnswers: (id: string, value: string) => void,
) {
  switch (question.field_type) {
    case 'BOOLEAN':
      return (
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <RadioGroup defaultValue="yes">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id={`${question.id}-yes`} />
                <Label htmlFor={`${question.id}-yes`}>Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id={`${question.id}-no`} />
                <Label htmlFor={`${question.id}-no`}>No</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      )

    case 'TEXT':
      return (
        <Textarea
          placeholder="Enter your answer here..."
          className="min-h-[100px]"
        />
      )

    case 'DATE':
      return <Input type="date" />

    case 'PHOTO':
      return (
        <ImageUpload
          value={imageAnswers[String(question.id)] || ''}
          onChange={(img) => setImageAnswers(String(question.id), img)}
          label="Upload Image"
        />
      )

    case 'NUMBER':
      return <Input type="number" placeholder="Enter a number" />

    case 'SELECT':
      if (
        !question.response_options ||
        question.response_options.length === 0
      ) {
        return (
          <p className="text-sm text-muted-foreground">
            No options defined for this question
          </p>
        )
      }

      return (
        <RadioGroup>
          {question.response_options.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <RadioGroupItem
                value={String(option.id)}
                id={`${question.id}-${option.id}`}
              />
              <Label
                htmlFor={`${question.id}-${option.id}`}
                className="flex items-center gap-2"
              >
                {option.label}
                {option.is_flagged && (
                  <AlertTriangle className="h-3 w-3 text-amber-500" />
                )}
              </Label>
            </div>
          ))}
        </RadioGroup>
      )

    case 'MULTI_SELECT':
      if (
        !question.response_options ||
        question.response_options.length === 0
      ) {
        return (
          <p className="text-sm text-muted-foreground">
            No options defined for this question
          </p>
        )
      }

      return (
        <div className="space-y-2">
          {question.response_options.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox id={`${question.id}-${option.id}`} />
              <Label
                htmlFor={`${question.id}-${option.id}`}
                className="flex items-center gap-2"
              >
                {option.label}
                {option.is_flagged && (
                  <AlertTriangle className="h-3 w-3 text-amber-500" />
                )}
              </Label>
            </div>
          ))}
        </div>
      )

    default:
      return (
        <p className="text-sm text-muted-foreground">
          Unsupported question type
        </p>
      )
  }
}
