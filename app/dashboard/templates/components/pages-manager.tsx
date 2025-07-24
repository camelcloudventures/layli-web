"use client"

import { type Dispatch, type SetStateAction, useState, useEffect, useRef, useLayoutEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { GripVertical, ChevronDown, ChevronUp, Trash2 } from "lucide-react"
import type { AuditTemplate, Page, Section } from "@/lib/types/audit-types"
import { SectionsManager } from "@/app/dashboard/templates/components/sections-manager"
import { Alert, AlertDescription } from "@/components/ui/alert"

const A4_PAGE_HEIGHT_PX = 1123; // Common approximation for 96 DPI

interface PagesManagerProps {
  template: AuditTemplate
  setTemplate: Dispatch<SetStateAction<AuditTemplate>>
}

export function PagesManager({ template, setTemplate }: PagesManagerProps) {
  const [activePage, setActivePage] = useState<string | null>(null)

  const repaginate = (sourcePageId: string, startSectionId: string) => {
      const updatedTemplate = JSON.parse(JSON.stringify(template));
      const sourcePageIndex = updatedTemplate.pages.findIndex((p: Page) => p.id === sourcePageId);
      if (sourcePageIndex === -1) return;
  
      const sourcePage = updatedTemplate.pages[sourcePageIndex];
      const startSectionIndex = sourcePage.sections.findIndex((s: Section) => s.id === startSectionId);
      if (startSectionIndex === -1) return;
  
      if (sourcePage.sections.length > 0 && startSectionIndex === 0) {
        console.warn("Section is too large to fit on a single page. Consider splitting it.");
      }
      
      const targetPageIndex = sourcePageIndex + 1;
      if (targetPageIndex >= updatedTemplate.pages.length) {
        const newPageId = Date.now().toString();
        updatedTemplate.pages.push({
          id: newPageId,
          template_id: updatedTemplate.id,
          title: `Page ${updatedTemplate.pages.length + 1}`,
          description: '',
          ordinal: updatedTemplate.pages.length + 1,
          sections: [], 
          created_at: new Date().toISOString()
        });
        
        updatedTemplate.pages.forEach((p: Page, pageIndex: number) => {
          p.ordinal = pageIndex + 1;
          p.sections.forEach((s: Section, sectionIndex: number) => {
            s.ordinal = sectionIndex + 1;
            s.page_id = p.id;
          });
        });

        setTemplate(updatedTemplate);
        setActivePage(newPageId); // Navigate to the new page
      } else {
        setTemplate(updatedTemplate);
      }
  };


  useEffect(() => {
    // If no pages exist, create the first one.
    if (template.pages.length === 0) {
      const newPageId = Date.now().toString();
      setTemplate(prev => ({
        ...prev,
        pages: [{
          id: newPageId,
          template_id: prev.id,
          title: 'Page 1',
          description: '',
          ordinal: 1,
          sections: [],
          created_at: new Date().toISOString()
        }]
      }));
      setActivePage(newPageId);
      return;
    }

    // Set initial active page or handle active page deletion
    if (activePage === null || !template.pages.some(p => p.id === activePage)) {
      setActivePage(template.pages[0].id);
    }
  }, [template.pages, activePage, setTemplate, template.id]);


  const updatePage = (pageId: string, field: keyof Page, value: string) => {
    const updatedTemplate = { ...template }
    const pageIndex = updatedTemplate.pages.findIndex((page) => page.id === pageId)

    if (pageIndex !== -1) {
      const pageToUpdate = updatedTemplate.pages[pageIndex];
      (pageToUpdate[field] as Page[keyof Page]) = value
      setTemplate(updatedTemplate)
    }
  }

  const handleDeletePage = (pageId: string) => {
    // Prevent deleting the last page
    if (template.pages.length <= 1) {
      alert("You cannot delete the last page.");
      return;
    }
    const updatedTemplate = { ...template, pages: template.pages.filter(page => page.id !== pageId) }
    setTemplate(updatedTemplate)
  }

  const movePageUp = (pageId: string) => {
    const pageIndex = template.pages.findIndex((page) => page.id === pageId)
    if (pageIndex > 0) {
      const newPages = [...template.pages];
      [newPages[pageIndex - 1], newPages[pageIndex]] = [newPages[pageIndex], newPages[pageIndex - 1]];
      setTemplate({...template, pages: newPages});
    }
  }

  const movePageDown = (pageId: string) => {
    const pageIndex = template.pages.findIndex((page) => page.id === pageId)
    if (pageIndex < template.pages.length - 1) {
      const newPages = [...template.pages];
      [newPages[pageIndex], newPages[pageIndex + 1]] = [newPages[pageIndex + 1], newPages[pageIndex]];
      setTemplate({...template, pages: newPages});
    }
  }

  const activatePageTab = (pageId: string) => {
    setActivePage(pageId)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-6">
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
            {activePage && template.pages.find((p) => p.id === activePage) ? (
              <PageEditor
                key={activePage} // Add key to force re-mount on page change
                page={template.pages.find((p) => p.id === activePage)!}
                updatePage={updatePage}
                template={template}
                setTemplate={setTemplate}
                repaginate={repaginate}
              />
            ) : (
              <Alert>
                <AlertDescription>
                  Loading page...
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface PageEditorProps {
  page: Page
  updatePage: (pageId: string, field: keyof Page, value: string) => void
  template: AuditTemplate
  setTemplate: Dispatch<SetStateAction<AuditTemplate>>
  repaginate: (sourcePageId: string, startSectionId: string) => void;
}

function PageEditor({ page, updatePage, template, setTemplate, repaginate }: PageEditorProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isPageFull, setIsPageFull] = useState(false);

  useLayoutEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const { scrollHeight } = content;
    const pageIsFull = scrollHeight > A4_PAGE_HEIGHT_PX;
    setIsPageFull(pageIsFull);

    if (pageIsFull) {
      let cumulativeHeight = 0;
      const sectionElements = Array.from(content.querySelectorAll('[data-section-id]'));
      let overflowSectionId: string | null = null;

      for (const el of sectionElements) {
        cumulativeHeight += (el as HTMLElement).offsetHeight;
        if (cumulativeHeight > A4_PAGE_HEIGHT_PX) {
          overflowSectionId = el.getAttribute('data-section-id');
          break;
        }
      }

      if (overflowSectionId) {
        repaginate(page.id, overflowSectionId);
      }
    }
  }, [page.sections, page.id, repaginate]);

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
        <div ref={contentRef}>
          <SectionsManager template={template} setTemplate={setTemplate} page={page} isPageFull={isPageFull}/>
        </div>
      </CardContent>
    </Card>
  )
}
