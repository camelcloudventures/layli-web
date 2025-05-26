import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { AuditTemplate, Question } from '@/lib/types/audit-types'
import { AlertTriangle, FileText } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ImageUpload } from './image-upload'
import { DeletePageButton } from './delete-controls/delete-page-button'
import { DeleteSectionButton } from './delete-controls/delete-section-button'
import { DeleteQuestionButton } from './delete-controls/delete-question-button'

interface TemplatePreviewContentProps {
  template: AuditTemplate
  currentPageIndex?: number
}

export function TemplatePreviewContent({
  template,
  currentPageIndex = 0,
}: TemplatePreviewContentProps) {
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

  return (
    <div className="space-y-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium">
          Template Preview: {template.title}
        </h3>
        <span className="text-sm text-muted-foreground">
          Page {currentPageIndex + 1} of {pageCount}
        </span>
      </div>

      <Card className="overflow-hidden rounded-xl shadow bg-white p-8">
        <CardHeader className="p-0 mb-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold mb-1">
              {currentPage.title}
            </CardTitle>
            <DeletePageButton
              pageId={String(currentPage.id)}
              templateId={String(template.id)}
            />
          </div>
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
                <div className="flex items-center justify-between">
                  <h4 className="text-xl font-bold mb-1">{section.title}</h4>
                  <DeleteSectionButton
                    sectionId={String(section.id)}
                    pageId={String(currentPage.id)}
                  />
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
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <Label className="text-base font-semibold">
                              {question.text}
                              {question.required && (
                                <span className="text-red-500 font-bold ml-1">
                                  *
                                </span>
                              )}
                            </Label>
                            {question.is_flagged && (
                              <span className="ml-2 flex items-center gap-1 rounded bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-800">
                                <AlertTriangle className="h-3 w-3" />
                                Critical
                              </span>
                            )}
                          </div>
                          <DeleteQuestionButton
                            questionId={String(question.id)}
                            sectionId={String(question.section_id)}
                          />
                        </div>
                        <div className="pl-0">
                          {renderQuestionInput(question)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function renderQuestionInput(question: Question) {
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
      return <ImageUpload value={''} onChange={() => {}} label="Upload Image" />
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
              <Label htmlFor={`${question.id}-${option.id}`}>
                {option.label}
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
              <Label htmlFor={`${question.id}-${option.id}`}>
                {option.label}
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
