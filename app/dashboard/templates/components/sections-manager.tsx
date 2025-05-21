"use client"

import { type Dispatch, type SetStateAction, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp, LayoutGrid } from "lucide-react"
import type { AuditTemplate, Page, Section, NewSection } from "@/types/audit-types"
import { QuestionsManager } from "@/app/dashboard/templates/components/questions-manager"
import { deleteSection } from '@/app/dashboard/templates/actions/actions'
import { toast } from 'sonner'

interface SectionsManagerProps {
  template: AuditTemplate
  setTemplate: Dispatch<SetStateAction<AuditTemplate>>
  page: Page
}

export function SectionsManager({ template, setTemplate, page }: SectionsManagerProps) {
  const [openSections, setOpenSections] = useState<string[]>([])

  const addNewSection = () => {
    const tempId = `temp-${Date.now()}`
    const newSection: NewSection = {
      page_id: page.id,
      title: `Section ${page.sections.length + 1}`,
      ordinal: page.sections.length + 1,
      questions: [],
    }

    const updatedTemplate = { ...template }
    const pageIndex = updatedTemplate.pages.findIndex((p) => p.id === page.id)

    if (pageIndex !== -1) {
      updatedTemplate.pages[pageIndex].sections.push({ ...newSection, id: tempId } as Section)
      setTemplate(updatedTemplate)
      setOpenSections([...openSections, tempId])
    }
  }

  const updateSection = (sectionId: string, field: keyof Section, value: string) => {
    const updatedTemplate = { ...template }
    const pageIndex = updatedTemplate.pages.findIndex((p) => p.id === page.id)

    if (pageIndex !== -1) {
      const sectionIndex = updatedTemplate.pages[pageIndex].sections.findIndex((section) => section.id === sectionId)

      if (sectionIndex !== -1) {
        updatedTemplate.pages[pageIndex].sections[sectionIndex] = {
          ...updatedTemplate.pages[pageIndex].sections[sectionIndex],
          [field]: value,
        }
        setTemplate(updatedTemplate)
      }
    }
  }

  const handleDeleteSection = async (sectionId: string) => {
    if (!window.confirm('Are you sure you want to delete this section? This action cannot be undone.')) return
    try {
      await deleteSection(sectionId, page.id)
      toast.success('Section deleted successfully!')
      const updatedTemplate = { ...template }
      const pageIndex = updatedTemplate.pages.findIndex(p => p.id === page.id)
      if (pageIndex !== -1) {
        updatedTemplate.pages[pageIndex].sections = updatedTemplate.pages[pageIndex].sections.filter(s => s.id !== sectionId)
        setTemplate(updatedTemplate)
      }
    } catch {
      toast.error('Failed to delete section')
    }
  }

  const moveSectionUp = (sectionId: string) => {
    const updatedTemplate = { ...template }
    const pageIndex = updatedTemplate.pages.findIndex((p) => p.id === page.id)

    if (pageIndex !== -1) {
      const sections = updatedTemplate.pages[pageIndex].sections
      const sectionIndex = sections.findIndex((section) => section.id === sectionId)

      if (sectionIndex > 0) {
        // Swap with previous section
        ;[sections[sectionIndex - 1], sections[sectionIndex]] = [sections[sectionIndex], sections[sectionIndex - 1]]

        // Update ordinals
        sections.forEach((section, index) => {
          section.ordinal = index + 1
        })

        setTemplate(updatedTemplate)
      }
    }
  }

  const moveSectionDown = (sectionId: string) => {
    const updatedTemplate = { ...template }
    const pageIndex = updatedTemplate.pages.findIndex((p) => p.id === page.id)

    if (pageIndex !== -1) {
      const sections = updatedTemplate.pages[pageIndex].sections
      const sectionIndex = sections.findIndex((section) => section.id === sectionId)

      if (sectionIndex < sections.length - 1) {
        // Swap with next section
        ;[sections[sectionIndex], sections[sectionIndex + 1]] = [sections[sectionIndex + 1], sections[sectionIndex]]

        // Update ordinals
        sections.forEach((section, index) => {
          section.ordinal = index + 1
        })

        setTemplate(updatedTemplate)
      }
    }
  }

  const handleAccordionChange = (sectionId: string) => {
    setOpenSections((prevOpenSections) => {
      if (prevOpenSections.includes(sectionId)) {
        return prevOpenSections.filter((id) => id !== sectionId)
      } else {
        return [...prevOpenSections, sectionId]
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Sections</h3>
        <Button onClick={addNewSection} variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Section
        </Button>
      </div>

      {page.sections.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-md border border-dashed py-8">
          <LayoutGrid className="h-16 w-16 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No Sections Added</h3>
          <p className="mt-2 text-center text-muted-foreground">Add sections to organize your audit questions</p>
          <Button className="mt-4" onClick={addNewSection}>
            <Plus className="mr-2 h-4 w-4" />
            Add First Section
          </Button>
        </div>
      ) : (
        <Accordion type="multiple" value={openSections} className="space-y-4">
          {page.sections.map((section) => (
            <AccordionItem key={section.id} value={section.id} className="border rounded-md">
              <AccordionTrigger onClick={() => handleAccordionChange(section.id)} className="px-4 hover:no-underline">
                <div className="flex items-center gap-2 text-left">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <span>{section.title}</span>
                </div>
                <div className="flex items-center gap-1 mr-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={section.ordinal === 1}
                    onClick={(e) => {
                      e.stopPropagation()
                      moveSectionUp(section.id)
                    }}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={section.ordinal === page.sections.length}
                    onClick={(e) => {
                      e.stopPropagation()
                      moveSectionDown(section.id)
                    }}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteSection(section.id)
                    }}
                    aria-label="Delete Section"
                  >
                    Delete
                  </Button>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-2 pb-4">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`section-title-${section.id}`}>Section Title</Label>
                      <Input
                        id={`section-title-${section.id}`}
                        value={section.title}
                        onChange={(e) => updateSection(section.id, "title", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Questions Manager */}
                  <QuestionsManager template={template} setTemplate={setTemplate} page={page} section={section} />
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  )
}
