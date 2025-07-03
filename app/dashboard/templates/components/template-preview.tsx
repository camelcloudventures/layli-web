'use client'

import { useState } from 'react'
import Image from 'next/image'
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
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ImageUpload } from './image-upload'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface TemplatePreviewProps {
  template: AuditTemplate
}

export function TemplatePreview({ template }: TemplatePreviewProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [imageAnswers, setImageAnswersState] = useState<Record<string, string>>(
    {},
  )

  function setImageAnswers(id: string, value: string) {
    setImageAnswersState((prev) => ({ ...prev, [id]: value }))
  }

  // Check if template has pages
  if (!template.pages || template.pages.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center">
        <FileText className="mx-auto h-16 w-16 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">No Pages to Preview</h3>
        <p className="mt-2 text-muted-foreground">
          Add pages, sections, and questions to see a preview of your template
        </p>
      </div>
    )
  }

  const currentPage = template.pages[currentPageIndex]
  const pageCount = template.pages.length

  const goToNextPage = () => {
    if (currentPageIndex < pageCount - 1) {
      setCurrentPageIndex(currentPageIndex + 1)
    }
  }

  const goToPrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1)
    }
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

      <Card className="overflow-hidden">
        {currentPage.photo && (
          <div className="relative h-48 w-full">
            <Image
              src={currentPage.photo || '/placeholder.svg'}
              alt={currentPage.title || 'Page cover'}
              fill
              className="object-cover"
            />
          </div>
        )}

        <CardHeader>
          <CardTitle>{currentPage.title}</CardTitle>
          {currentPage.description && (
            <CardDescription>{currentPage.description}</CardDescription>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {currentPage.sections.length === 0 ? (
            <div className="rounded-md border border-dashed p-6 text-center">
              <p className="text-muted-foreground">
                No sections added to this page
              </p>
            </div>
          ) : (
            currentPage.sections.map((section) => (
              <div key={section.id} className="space-y-4">
                <h4 className="text-lg font-medium">{section.title}</h4>

                {section.questions.length === 0 ? (
                  <div className="rounded-md border border-dashed p-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      No questions in this section
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {section.questions.map((question) => (
                      <div key={question.id} className="space-y-2">
                        <div className="flex items-start gap-2">
                          <div className="flex-1">
                            <Label className="text-base">
                              {question.text}
                              {question.required && (
                                <span className="text-red-500 ml-1">*</span>
                              )}
                            </Label>
                          </div>
                          {question.is_flagged && (
                            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                              <AlertTriangle className="mr-1 h-3 w-3" />
                              Critical
                            </Badge>
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

        <CardFooter className="flex justify-between border-t p-4">
          <Button
            variant="outline"
            onClick={goToPrevPage}
            disabled={currentPageIndex === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          <Button
            onClick={goToNextPage}
            disabled={currentPageIndex === pageCount - 1}
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

    case 'SLIDER':
      return (
        <div className="space-y-2">
          <Label htmlFor={`slider-${question.id}`}>Slider (1-5)</Label>
          <div className="flex items-center gap-2">
            <span className="text-sm">1</span>
            <Slider
              id={`slider-${question.id}`}
              defaultValue={[1]}
              max={5}
              min={1}
              step={1}
              className="w-full"
              disabled
            />
            <span className="text-sm">5</span>
            <span className="ml-2 text-muted-foreground text-xs">Value: 1</span>
          </div>
        </div>
      )

    case 'SIGNATURE':
      return (
        <div className="space-y-2">
          <Label htmlFor={`signature-${question.id}`}>Signature</Label>
          <div className="border border-dashed rounded-md flex flex-col items-center justify-center min-h-[80px] py-4 bg-gray-50">
            <svg
              width="32"
              height="32"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-gray-400 mb-2"
              viewBox="0 0 24 24"
            >
              <path d="M16 19c-2.5-2.5-7.5-2.5-10 0M8 13c.5-1.5 2.5-1.5 3 0m2-4c.5-2 3.5-2 4 0" />
            </svg>
            <span className="text-xs text-muted-foreground">Sign here</span>
          </div>
        </div>
      )

    case 'LOCATION':
      return (
        <div className="space-y-2">
          <Label htmlFor={`location-${question.id}`}>Location</Label>
          <div className="flex items-center gap-2 mb-2">
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-gray-400"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
            </svg>
            <Input
              className="w-full"
              value="123 Main St, City"
              disabled
              aria-label="Address"
            />
          </div>
          <div className="flex gap-2">
            <Input
              className="w-1/2"
              value="Lat: 0.0000"
              disabled
              aria-label="Latitude"
            />
            <Input
              className="w-1/2"
              value="Lng: 0.0000"
              disabled
              aria-label="Longitude"
            />
          </div>
        </div>
      )

    case 'PERSON':
      return <PersonPreviewField questionId={question.id} />

    case 'ASSET':
      return <AssetPreviewField questionId={question.id} />

    default:
      return (
        <p className="text-sm text-muted-foreground">
          Unsupported question type
        </p>
      )
  }
}

function PersonPreviewField({ questionId }: { questionId: string }) {
  const [selectedPerson, setSelectedPerson] = useState('')
  return (
    <div className="space-y-2">
      <Label htmlFor={`person-${questionId}`}>Person</Label>
      <Select defaultValue={selectedPerson} onValueChange={setSelectedPerson}>
        <SelectTrigger>
          <SelectValue placeholder="Select a person" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">John Doe</SelectItem>
          <SelectItem value="2">Jane Smith</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

function AssetPreviewField({ questionId }: { questionId: string }) {
  const [assetFile, setAssetFile] = useState('')
  return (
    <div className="space-y-2">
      <Label htmlFor={`asset-${questionId}`}>Asset</Label>
      <ImageUpload
        value={assetFile}
        onChange={setAssetFile}
        label="Upload Asset"
        accept="*/*"
      />
    </div>
  )
}
