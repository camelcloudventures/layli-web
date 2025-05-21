'use client'

import type { Dispatch, SetStateAction } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import type {
  AuditTemplate,
  Page,
  Section,
  Question,
  ResponseOption,
  NewResponseOption,
} from '@/types/audit-types'

interface ResponseOptionsManagerProps {
  template: AuditTemplate
  setTemplate: Dispatch<SetStateAction<AuditTemplate>>
  page: Page
  section: Section
  question: Question
}

export function ResponseOptionsManager({
  template,
  setTemplate,
  page,
  section,
  question,
}: ResponseOptionsManagerProps) {
  const addResponseOption = () => {
    const tempId = `temp-${Date.now()}`
    const newOption: NewResponseOption = {
      question_id: question.id,
      label: 'New Option',
      code: '',
      sort_order: question.response_options?.length || 0,
      score: 0,
      is_flagged: false,
      color: '#e2e8f0', // Default color
    }

    const updatedTemplate = { ...template }
    const pageIndex = updatedTemplate.pages.findIndex((p) => p.id === page.id)

    if (pageIndex !== -1) {
      const sectionIndex = updatedTemplate.pages[pageIndex].sections.findIndex(
        (s) => s.id === section.id,
      )

      if (sectionIndex !== -1) {
        const questionIndex = updatedTemplate.pages[pageIndex].sections[
          sectionIndex
        ].questions.findIndex((q) => q.id === question.id)

        if (questionIndex !== -1) {
          const targetQuestion =
            updatedTemplate.pages[pageIndex].sections[sectionIndex].questions[
              questionIndex
            ]

          if (!targetQuestion.response_options) {
            targetQuestion.response_options = []
          }

          targetQuestion.response_options.push({
            ...newOption,
            id: tempId,
          } as ResponseOption)
          setTemplate(updatedTemplate)
        }
      }
    }
  }

  const updateResponseOption = (
    optionId: string,
    field: keyof ResponseOption,
    value: string | number | boolean,
  ) => {
    const updatedTemplate = { ...template }
    const pageIndex = updatedTemplate.pages.findIndex((p) => p.id === page.id)

    if (pageIndex !== -1) {
      const sectionIndex = updatedTemplate.pages[pageIndex].sections.findIndex(
        (s) => s.id === section.id,
      )

      if (sectionIndex !== -1) {
        const questionIndex = updatedTemplate.pages[pageIndex].sections[
          sectionIndex
        ].questions.findIndex((q) => q.id === question.id)

        if (
          questionIndex !== -1 &&
          updatedTemplate.pages[pageIndex].sections[sectionIndex].questions[
            questionIndex
          ].response_options
        ) {
          const optionIndex = updatedTemplate.pages[pageIndex].sections[
            sectionIndex
          ].questions[questionIndex].response_options!.findIndex(
            (o) => o.id === optionId,
          )

          if (optionIndex !== -1) {
            updatedTemplate.pages[pageIndex].sections[sectionIndex].questions[
              questionIndex
            ].response_options![optionIndex] = {
              ...updatedTemplate.pages[pageIndex].sections[sectionIndex]
                .questions[questionIndex].response_options![optionIndex],
              [field]: value,
            }

            setTemplate(updatedTemplate)
          }
        }
      }
    }
  }

  const deleteResponseOption = (optionId: string) => {
    const updatedTemplate = { ...template }
    const pageIndex = updatedTemplate.pages.findIndex((p) => p.id === page.id)

    if (pageIndex !== -1) {
      const sectionIndex = updatedTemplate.pages[pageIndex].sections.findIndex(
        (s) => s.id === section.id,
      )

      if (sectionIndex !== -1) {
        const questionIndex = updatedTemplate.pages[pageIndex].sections[
          sectionIndex
        ].questions.findIndex((q) => q.id === question.id)

        if (
          questionIndex !== -1 &&
          updatedTemplate.pages[pageIndex].sections[sectionIndex].questions[
            questionIndex
          ].response_options
        ) {
          updatedTemplate.pages[pageIndex].sections[sectionIndex].questions[
            questionIndex
          ].response_options = updatedTemplate.pages[pageIndex].sections[
            sectionIndex
          ].questions[questionIndex].response_options!.filter(
            (o) => o.id !== optionId,
          )

          // Update sort_order for remaining options
          updatedTemplate.pages[pageIndex].sections[sectionIndex].questions[
            questionIndex
          ].response_options!.forEach((option, index) => {
            option.sort_order = index
          })

          setTemplate(updatedTemplate)
        }
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Response Options</Label>
        <Button onClick={addResponseOption} variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Option
        </Button>
      </div>

      {!question.response_options || question.response_options.length === 0 ? (
        <div className="rounded-md border border-dashed p-4 text-center">
          <p className="text-sm text-muted-foreground">
            No response options added. Add options for users to select from.
          </p>
          <Button className="mt-4" onClick={addResponseOption} size="sm">
            Add First Option
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {question.response_options?.map((option) => (
            <div
              key={option.id}
              className="flex items-center gap-2 rounded-md border p-2"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />

              <div className="flex-1">
                <Input
                  value={option.label}
                  onChange={(e) =>
                    updateResponseOption(option.id, 'label', e.target.value)
                  }
                  placeholder="Option label"
                  className="mr-2"
                />
              </div>

              <div className="flex items-center gap-2">
                <div
                  className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md border"
                  style={{ backgroundColor: option.color }}
                  title="Choose a color"
                >
                  <input
                    type="color"
                    value={option.color}
                    onChange={(e) =>
                      updateResponseOption(option.id, 'color', e.target.value)
                    }
                    className="opacity-0 absolute inset-0 w-6 h-6 cursor-pointer"
                  />
                </div>

                <div className="flex items-center">
                  <Input
                    type="number"
                    value={option.score}
                    onChange={(e) =>
                      updateResponseOption(
                        option.id,
                        'score',
                        Number.parseInt(e.target.value) || 0,
                      )
                    }
                    className="w-16 text-xs"
                    title="Score value"
                  />
                </div>

                <div className="flex items-center">
                  <Switch
                    id={`option-flag-${option.id}`}
                    checked={option.is_flagged}
                    onCheckedChange={(checked) =>
                      updateResponseOption(option.id, 'is_flagged', checked)
                    }
                    title="Flag this option"
                  />
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => deleteResponseOption(option.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
