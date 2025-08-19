"use client";

import { type Dispatch, type SetStateAction, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GripVertical, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import type { AuditTemplate, Page } from "@/lib/types/audit-types";
import { SectionsManager } from "@/app/dashboard/templates/components/sections-manager";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PagesManagerProps {
  template: AuditTemplate;
  setTemplate: Dispatch<SetStateAction<AuditTemplate>>;
}

export function PagesManager({ template, setTemplate }: PagesManagerProps) {
  const [activePage, setActivePage] = useState<string | null>(null);

  useEffect(() => {
    // If no pages exist, create the first one.
    if (template.pages.length === 0) {
      const newPageId = Date.now().toString();
      setTemplate((prev) => ({
        ...prev,
        pages: [
          {
            id: newPageId,
            template_id: prev.id,
            title: "Page 1",
            description: "",
            ordinal: 1,
            sections: [],
            created_at: new Date().toISOString(),
          },
        ],
      }));
      setActivePage(newPageId);
      return;
    }

    // Set initial active page or handle active page deletion
    if (
      activePage === null ||
      !template.pages.some((p) => p.id === activePage)
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

  // Step 2: Global Question Counting Logic
  const QUESTIONS_PER_PAGE = 6;

  // Flatten all questions from all pages with their global positions
  const getAllQuestionsWithPositions = (currentTemplate: AuditTemplate) => {
    const allQuestions: Array<{
      question: any;
      globalPosition: number;
      pageId: string;
      sectionId: string;
      currentPageId: string;
    }> = [];

    let globalPosition = 1;

    currentTemplate.pages.forEach((page) => {
      page.sections.forEach((section) => {
        section.questions.forEach((question) => {
          allQuestions.push({
            question,
            globalPosition,
            pageId: page.id,
            sectionId: section.id,
            currentPageId: page.id,
          });
          globalPosition++;
        });
      });
    });

    return allQuestions;
  };

  // Calculate which page a question should be on based on its global position
  const getTargetPageForPosition = (globalPosition: number) => {
    const targetPageIndex = Math.ceil(globalPosition / QUESTIONS_PER_PAGE) - 1;
    return template.pages[targetPageIndex]?.id || null;
  };

  // Get questions that should be on a specific page
  const getQuestionsForPage = (pageId: string) => {
    const allQuestions = getAllQuestionsWithPositions(template);
    const pageIndex = template.pages.findIndex((p) => p.id === pageId);
    if (pageIndex === -1) return [];

    const startPosition = pageIndex * QUESTIONS_PER_PAGE + 1;
    const endPosition = (pageIndex + 1) * QUESTIONS_PER_PAGE;

    return allQuestions.filter(
      (q) =>
        q.globalPosition >= startPosition && q.globalPosition <= endPosition
    );
  };

  // Get the target page for a new question
  const getTargetPageForNewQuestion = () => {
    const allQuestions = getAllQuestionsWithPositions(template);
    const totalQuestions = allQuestions.length;
    const targetPageIndex = Math.floor(totalQuestions / QUESTIONS_PER_PAGE);

    // If we need a new page
    if (targetPageIndex >= template.pages.length) {
      return null; // Indicates new page needed
    }

    return template.pages[targetPageIndex]?.id || null;
  };

  // Current page info
  const currentPage = template.pages.find((p) => p.id === activePage);
  const currentPageQuestions = currentPage
    ? getQuestionsForPage(currentPage.id)
    : [];
  const totalGlobalQuestions = getAllQuestionsWithPositions(template).length;

  console.log("Total global questions:", totalGlobalQuestions);
  console.log("Current page questions:", currentPageQuestions.length);
  console.log("Questions per page limit:", QUESTIONS_PER_PAGE);

  // Step 3: Page Creation Logic
  const createNewPage = () => {
    const newPageId = Date.now().toString();
    const newPage = {
      id: newPageId,
      template_id: template.id,
      title: `Page ${template.pages.length + 1}`,
      description: "",
      ordinal: template.pages.length + 1,
      sections: [],
      created_at: new Date().toISOString(),
    };

    const updatedTemplate = {
      ...template,
      pages: [...template.pages, newPage],
    };

    setTemplate(updatedTemplate);
    setActivePage(newPageId); // Navigate to the new page
    return newPageId;
  };

  const handleQuestionAddition = (sectionId: string, newQuestion: any) => {
    const updatedTemplate = JSON.parse(JSON.stringify(template));

    // Find the section and add the new question to it, regardless of page
    let sectionFound = false;
    for (const page of updatedTemplate.pages) {
      for (const section of page.sections) {
        if (section.id === sectionId) {
          section.questions.push({
            ...newQuestion,
            id: Date.now().toString(),
            section_id: section.id,
            ordinal: section.questions.length + 1,
            created_at: new Date().toISOString(),
          });
          sectionFound = true;
          break;
        }
      }
      if (sectionFound) break;
    }

    if (!sectionFound) {
      console.error("Section not found!");
      return;
    }

    // After adding the question, check if a new page is needed.
    // We need to pass the modified template to the counting function.
    const allQuestions = getAllQuestionsWithPositions(updatedTemplate);
    const totalQuestions = allQuestions.length;
    const requiredPages = Math.ceil(totalQuestions / QUESTIONS_PER_PAGE) || 1;

    let newPageId = null;
    if (requiredPages > updatedTemplate.pages.length) {
      newPageId = Date.now().toString();
      const newPage = {
        id: newPageId,
        template_id: updatedTemplate.id,
        title: `Page ${updatedTemplate.pages.length + 1}`,
        description: "",
        ordinal: updatedTemplate.pages.length + 1,
        sections: [],
        created_at: new Date().toISOString(),
      };
      updatedTemplate.pages.push(newPage);
    }

    setTemplate(updatedTemplate);

    if (newPageId) {
      setActivePage(newPageId);
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
                      disabled={page.ordinal === 1}
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
                      disabled={page.ordinal === template.pages.length}
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
                getQuestionsForPage={getQuestionsForPage}
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
  handleQuestionAddition: (sectionId: string, newQuestion: any) => void;
  getQuestionsForPage: (pageId: string) => any[];
}

function PageEditor({
  page,
  updatePage,
  template,
  setTemplate,
  handleQuestionAddition,
  getQuestionsForPage,
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
            questionsForThisPage={getQuestionsForPage(page.id)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
