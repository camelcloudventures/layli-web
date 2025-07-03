"use client"

import { type Dispatch, type SetStateAction, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, GripVertical, ChevronDown, ChevronUp, FileText, Trash2 } from "lucide-react"
import type { AuditTemplate, Page, NewPage } from "@/types/audit-types"
import { SectionsManager } from "@/app/dashboard/templates/components/sections-manager"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PagesManagerProps {
  template: AuditTemplate
  setTemplate: Dispatch<SetStateAction<AuditTemplate>>
}

export function PagesManager({ template, setTemplate }: PagesManagerProps) {
  const [activePage, setActivePage] = useState<string | null>(template.pages.length > 0 ? template.pages[0].id : null)

  const addNewPage = () => {
    const tempId = `temp-${Date.now()}`
    const newPage: NewPage = {
      template_id: template.id,
      title: `Page ${template.pages.length + 1}`,
      description: '',
      ordinal: template.pages.length + 1,
      sections: [],
    }

    const updatedTemplate = { ...template }
    updatedTemplate.pages.push({ ...newPage, id: tempId } as Page)
    setTemplate(updatedTemplate)
    setActivePage(tempId)
  }

  const updatePage = (pageId: string, field: keyof Page, value: string) => {
    const updatedTemplate = { ...template }
    const pageIndex = updatedTemplate.pages.findIndex((page) => page.id === pageId)

    if (pageIndex !== -1) {
      updatedTemplate.pages[pageIndex] = {
        ...updatedTemplate.pages[pageIndex],
        [field]: value,
      }
      setTemplate(updatedTemplate)
    }
  }

  const handleDeletePage = (pageId: string) => {
    const updatedTemplate = { ...template, pages: template.pages.filter(page => page.id !== pageId) }
    setTemplate(updatedTemplate)
    setActivePage(updatedTemplate.pages.length > 0 ? updatedTemplate.pages[0].id : null)
    
  }

  const movePageUp = (pageId: string) => {
    const updatedTemplate = { ...template }
    const pageIndex = updatedTemplate.pages.findIndex((page) => page.id === pageId)

    if (pageIndex > 0) {
      // Swap with previous page
      ;[updatedTemplate.pages[pageIndex - 1], updatedTemplate.pages[pageIndex]] = [
        updatedTemplate.pages[pageIndex],
        updatedTemplate.pages[pageIndex - 1],
      ]

      // Update ordinals
      updatedTemplate.pages.forEach((page, index) => {
        page.ordinal = index + 1
      })

      setTemplate(updatedTemplate)
    }
  }

  const movePageDown = (pageId: string) => {
    const updatedTemplate = { ...template }
    const pageIndex = updatedTemplate.pages.findIndex((page) => page.id === pageId)

    if (pageIndex < updatedTemplate.pages.length - 1) {
      // Swap with next page
      ;[updatedTemplate.pages[pageIndex], updatedTemplate.pages[pageIndex + 1]] = [
        updatedTemplate.pages[pageIndex + 1],
        updatedTemplate.pages[pageIndex],
      ]

      // Update ordinals
      updatedTemplate.pages.forEach((page, index) => {
        page.ordinal = index + 1
      })

      setTemplate(updatedTemplate)
    }
  }

  const activatePageTab = (pageId: string) => {
    setActivePage(pageId)
  }

  return (
    <div className="space-y-6">
      {template.pages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10">
          <FileText className="h-16 w-16 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No Pages Added Yet</h3>
          <p className="mt-2 text-center text-muted-foreground">
            Start building your template by adding your first page
          </p>
          <Button className="mt-4" onClick={addNewPage}>
            <Plus className="mr-2 h-4 w-4" />
            Add First Page
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-medium">Pages</h3>
            <Button onClick={addNewPage} variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Page
            </Button>
          </div> */}

          <div className="flex flex-col md:flex-row gap-6">
            {/* Page sidebar navigation */}
            <div className="md:w-1/4">
              <div className="space-y-2">
                {template.pages.map((page) => (
                  <div
                    key={page.id}
                    className={`flex items-center justify-between rounded-md border p-2 ${
                      activePage === page.id ? "border-primary bg-primary/10" : ""
                    }`}
                  >
                    <button
                      className="flex items-center gap-2 w-full text-left"
                      onClick={() => activatePageTab(page.id)}
                    >
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{page.title}</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={page.ordinal === 1}
                        onClick={(e) => {
                          e.stopPropagation()
                          movePageUp(page.id)
                        }}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={page.ordinal === template.pages.length}
                        onClick={(e) => {
                          e.stopPropagation()
                          movePageDown(page.id)
                        }}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeletePage(page.id)
                        }}
                        aria-label="Delete Page"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active page editor */}
            <div className="flex-1">
              {activePage ? (
                <PageEditor
                  page={template.pages.find((p) => p.id === activePage)!}
                  updatePage={updatePage}
                  template={template}
                  setTemplate={setTemplate}
                />
              ) : (
                <Alert>
                  <AlertDescription>
                    No page selected. Please select a page from the sidebar or add a new page.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface PageEditorProps {
  page: Page
  updatePage: (pageId: string, field: keyof Page, value: string) => void
  template: AuditTemplate
  setTemplate: Dispatch<SetStateAction<AuditTemplate>>
}

function PageEditor({ page, updatePage, template, setTemplate }: PageEditorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Page: {page.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`page-title-${page.id}`}>Page Title</Label>
            <Input
              id={`page-title-${page.id}`}
              value={page.title}
              onChange={(e) => updatePage(page.id, "title", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`page-description-${page.id}`}>Page Description</Label>
            <Textarea
              id={`page-description-${page.id}`}
              value={page.description}
              onChange={(e) => updatePage(page.id, "description", e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>

        {/* Sections & Questions Manager */}
        <SectionsManager template={template} setTemplate={setTemplate} page={page} />
      </CardContent>
    </Card>
  )
}
