"use client";

import { type Dispatch, type SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
} from "lucide-react";
import type {
  AuditTemplate,
  Page,
  Section,
  NewSection,
} from "@/lib/types/audit-types";
import { QuestionsManager } from "@/app/dashboard/templates/components/questions-manager";

interface SectionsManagerProps {
  template: AuditTemplate;
  setTemplate: Dispatch<SetStateAction<AuditTemplate>>;
  page: Page;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleQuestionAddition: (sectionId: string, newQuestion: any) => void;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  questionsForThisPage: any[];
}

export function SectionsManager({
  template,
  setTemplate,
  page,
  handleQuestionAddition,
  questionsForThisPage,
}: SectionsManagerProps) {
  const [openSections, setOpenSections] = useState<string[]>([]);

  const sectionsOnThisPage = template.pages
    .flatMap((p) => p.sections)
    .filter((section) =>
      questionsForThisPage.some((q) => q.sectionId === section.id)
    );

  // Also include empty sections that belong to the current page.
  const emptySectionsOnThisPage =
    template.pages
      .find((p) => p.id === page.id)
      ?.sections.filter((s) => s.questions.length === 0) || [];

  const combinedSections = [...sectionsOnThisPage, ...emptySectionsOnThisPage];

  const uniqueSectionsOnThisPage = [
    ...new Map(combinedSections.map((s) => [s.id, s])).values(),
  ];

  console.log("page", page);

  const addNewSection = () => {
    const tempId = `temp-${Date.now()}`;
    const totalSections = template.pages.reduce(
      (acc, p) => acc + p.sections.length,
      0
    );
    const newSection: NewSection = {
      page_id: page.id,
      title: `Section ${totalSections + 1}`,
      ordinal: page.sections.length + 1,
      questions: [],
    };

    const updatedTemplate = { ...template };
    const pageIndex = updatedTemplate.pages.findIndex((p) => p.id === page.id);

    if (pageIndex !== -1) {
      updatedTemplate.pages[pageIndex].sections.push({
        ...newSection,
        id: tempId,
      } as Section);
      setTemplate(updatedTemplate);
      setOpenSections([...openSections, tempId]);
    }
  };

  const updateSection = (
    sectionId: string,
    field: keyof Section,
    value: string
  ) => {
    const updatedTemplate = { ...template };
    const pageIndex = updatedTemplate.pages.findIndex((p) => p.id === page.id);

    if (pageIndex !== -1) {
      const sectionIndex = updatedTemplate.pages[pageIndex].sections.findIndex(
        (section) => section.id === sectionId
      );

      if (sectionIndex !== -1) {
        updatedTemplate.pages[pageIndex].sections[sectionIndex] = {
          ...updatedTemplate.pages[pageIndex].sections[sectionIndex],
          [field]: value,
        };
        setTemplate(updatedTemplate);
      }
    }
  };

  const handleDeleteSection = (sectionId: string) => {
    const updatedTemplate = { ...template };
    const pageIndex = updatedTemplate.pages.findIndex((p) => p.id === page.id);
    if (pageIndex !== -1) {
      updatedTemplate.pages[pageIndex].sections = updatedTemplate.pages[
        pageIndex
      ].sections.filter((s) => s.id !== sectionId);
      setTemplate(updatedTemplate);
    }
  };

  const moveSectionUp = (sectionId: string) => {
    const updatedTemplate = { ...template };
    const pageIndex = updatedTemplate.pages.findIndex((p) => p.id === page.id);

    if (pageIndex !== -1) {
      const sections = updatedTemplate.pages[pageIndex].sections;
      const sectionIndex = sections.findIndex(
        (section) => section.id === sectionId
      );

      if (sectionIndex > 0) {
        // Swap with previous section
        [sections[sectionIndex - 1], sections[sectionIndex]] = [
          sections[sectionIndex],
          sections[sectionIndex - 1],
        ];

        // Update ordinals
        sections.forEach((section, index) => {
          section.ordinal = index + 1;
        });

        setTemplate(updatedTemplate);
      }
    }
  };

  const moveSectionDown = (sectionId: string) => {
    const updatedTemplate = { ...template };
    const pageIndex = updatedTemplate.pages.findIndex((p) => p.id === page.id);

    if (pageIndex !== -1) {
      const sections = updatedTemplate.pages[pageIndex].sections;
      const sectionIndex = sections.findIndex(
        (section) => section.id === sectionId
      );

      if (sectionIndex < sections.length - 1) {
        // Swap with next section
        [sections[sectionIndex], sections[sectionIndex + 1]] = [
          sections[sectionIndex + 1],
          sections[sectionIndex],
        ];

        // Update ordinals
        sections.forEach((section, index) => {
          section.ordinal = index + 1;
        });

        setTemplate(updatedTemplate);
      }
    }
  };

  const handleAccordionChange = (sectionId: string) => {
    setOpenSections((prevOpenSections) => {
      if (prevOpenSections.includes(sectionId)) {
        return prevOpenSections.filter((id) => id !== sectionId);
      } else {
        return [...prevOpenSections, sectionId];
      }
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Sections</h3>

      {uniqueSectionsOnThisPage.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-md border border-dashed py-12">
          <LayoutGrid className="h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-center text-muted-foreground">
            No Sections Added
          </p>
          <Button
            onClick={addNewSection}
            variant="outline"
            size="sm"
            className="mt-4"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add First Section
          </Button>
        </div>
      ) : (
        <Accordion
          type="multiple"
          value={openSections}
          onValueChange={setOpenSections}
          className="space-y-4"
        >
          {uniqueSectionsOnThisPage.map((section) => (
            <AccordionItem
              key={section.id}
              value={section.id}
              className="border rounded-md"
              data-section-id={section.id}
            >
              <AccordionTrigger
                onClick={() => handleAccordionChange(section.id)}
                className="px-4 hover:no-underline"
              >
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
                      e.stopPropagation();
                      moveSectionUp(section.id);
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
                      e.stopPropagation();
                      moveSectionDown(section.id);
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
                      handleDeleteSection(section.id);
                    }}
                    aria-label="Delete Section"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-2 pb-4">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`section-title-${section.id}`}>
                        Section Title
                      </Label>
                      <Input
                        id={`section-title-${section.id}`}
                        value={section.title}
                        onChange={(e) =>
                          updateSection(section.id, "title", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  {/* Questions Manager */}
                  <QuestionsManager
                    template={template}
                    setTemplate={setTemplate}
                    page={page}
                    section={section}
                    handleQuestionAddition={handleQuestionAddition}
                    questionsForThisPage={questionsForThisPage}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
      {uniqueSectionsOnThisPage.length > 0 && (
        <div className="flex justify-end mt-4">
          <Button onClick={addNewSection} variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Section
          </Button>
        </div>
      )}
    </div>
  );
}
