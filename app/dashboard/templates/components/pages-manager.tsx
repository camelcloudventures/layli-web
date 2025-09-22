"use client";

import { type Dispatch, type SetStateAction, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  GripVertical,
  ChevronDown,
  ChevronUp,
  Trash2,
  PlusCircle,
} from "lucide-react";
import type { AuditTemplate, Page } from "@/lib/types/audit-types";
import { SectionsManager } from "@/app/dashboard/templates/components/sections-manager";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { reflowTemplateByA4 } from "@/app/dashboard/templates/utils/a4-pagination";

interface PagesManagerProps {
  template: AuditTemplate;
  setTemplate: Dispatch<SetStateAction<AuditTemplate>>;
}

export function PagesManager({ template, setTemplate }: PagesManagerProps) {
  const [activePage, setActivePage] = useState<string | null>(null);

  useEffect(() => {
    // Set initial active page or handle active page deletion
    if (
      template.pages.length > 0 &&
      (activePage === null || !template.pages.some((p) => p.id === activePage))
    ) {
      setActivePage(template.pages[0].id);
    }
  }, [template.pages, activePage, setTemplate, template.id]);

  const updatePage = (pageId: string, field: keyof Page, value: string) => {
    const updatedTemplate = { ...template };
    const pageIndex = updatedTemplate.pages.findIndex(
      (page) => page.id === pageId
    );

    if (pageIndex !== -1) {
      const pageToUpdate = updatedTemplate.pages[pageIndex];
      (pageToUpdate[field] as Page[keyof Page]) = value;
      setTemplate(updatedTemplate);
    }
  };

  const handleDeletePage = (pageId: string) => {
    // Prevent deleting the last page
    if (template.pages.length <= 1) {
      alert("You cannot delete the last page.");
      return;
    }
    const updatedTemplate = {
      ...template,
      pages: template.pages.filter((page) => page.id !== pageId),
    };
    setTemplate(updatedTemplate);
  };

  const handleAddPage = () => {
    const newPageId = Date.now().toString();
    const newPage: Page = {
      id: newPageId,
      template_id: template.id,
      title: `Page ${template.pages.length + 1}`,
      description: "",
      ordinal: template.pages.length + 1,
      sections: [],
      created_at: new Date().toISOString(),
    };

    setTemplate((prev) => ({
      ...prev,
      pages: [...prev.pages, newPage],
    }));
    setActivePage(newPageId);
  };

  const movePageUp = (pageId: string) => {
    const pageIndex = template.pages.findIndex((page) => page.id === pageId);
    if (pageIndex > 0) {
      const newPages = [...template.pages];
      [newPages[pageIndex - 1], newPages[pageIndex]] = [
        newPages[pageIndex],
        newPages[pageIndex - 1],
      ];
      setTemplate({ ...template, pages: newPages });
    }
  };

  const movePageDown = (pageId: string) => {
    const pageIndex = template.pages.findIndex((page) => page.id === pageId);
    if (pageIndex < template.pages.length - 1) {
      const newPages = [...template.pages];
      [newPages[pageIndex], newPages[pageIndex + 1]] = [
        newPages[pageIndex + 1],
        newPages[pageIndex],
      ];
      setTemplate({ ...template, pages: newPages });
    }
  };

  const activatePageTab = (pageId: string) => {
    setActivePage(pageId);
  };

  const handleQuestionAddition = (
    pageId: string,
    sectionId: string,
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    newQuestion: any
  ) => {
    const draft = JSON.parse(JSON.stringify(template)) as AuditTemplate;

    // Find the last fragment of this section across pages by traversal order
    let lastFragment: { pageIndex: number; sectionIndex: number } | null = null;
    draft.pages.forEach((p, pi) => {
      p.sections.forEach((s, si) => {
        if (s.id === sectionId)
          lastFragment = { pageIndex: pi, sectionIndex: si };
      });
    });

    if (!lastFragment) {
      console.error("Section not found!");
      return;
    }

    const qId = Date.now().toString();
    const { pageIndex, sectionIndex } = lastFragment;
    draft.pages[pageIndex].sections[sectionIndex].questions.push({
      ...newQuestion,
      id: qId,
      section_id: sectionId,
      page_id: draft.pages[pageIndex].id,
      ordinal:
        draft.pages[pageIndex].sections[sectionIndex].questions.length + 1,
      created_at: new Date().toISOString(),
    });

    // Reflow the entire template using A4 layout rules
    const reflowed = reflowTemplateByA4(draft);
    setTemplate(reflowed);

    // Find which page now contains the new question and activate it
    for (const p of reflowed.pages) {
      for (const s of p.sections) {
        if (s.id !== sectionId) continue;
        if (s.questions.some((q) => q.id === qId)) {
          setActivePage(p.id);
          return;
        }
      }
    }
  };

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
                      onClick={(e) => {
                        e.stopPropagation();
                        movePageUp(page.id);
                      }}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        movePageDown(page.id);
                      }}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePage(page.id);
                      }}
                      aria-label="Delete Page"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                onClick={handleAddPage}
                variant="outline"
                className="w-full mt-4"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Page
              </Button>
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
                handleQuestionAddition={handleQuestionAddition}
              />
            ) : (
              <Alert>
                <AlertDescription>Loading page...</AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface PageEditorProps {
  page: Page;
  updatePage: (pageId: string, field: keyof Page, value: string) => void;
  template: AuditTemplate;
  setTemplate: Dispatch<SetStateAction<AuditTemplate>>;
  handleQuestionAddition: (
    pageId: string,
    sectionId: string,
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    newQuestion: any
  ) => void;
}

function PageEditor({
  page,
  updatePage,
  template,
  setTemplate,
  handleQuestionAddition,
}: PageEditorProps) {
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
            <Label htmlFor={`page-description-${page.id}`}>
              Page Description
            </Label>
            <Textarea
              id={`page-description-${page.id}`}
              value={page.description}
              onChange={(e) =>
                updatePage(page.id, "description", e.target.value)
              }
              className="min-h-[100px]"
            />
          </div>
        </div>

        {/* Sections & Questions Manager */}
        <div>
          <SectionsManager
            template={template}
            setTemplate={setTemplate}
            page={page}
            handleQuestionAddition={handleQuestionAddition}
          />
        </div>
      </CardContent>
    </Card>
  );
}
