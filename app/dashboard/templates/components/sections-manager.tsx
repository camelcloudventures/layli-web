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
import { reflowTemplateByA4 } from "@/app/dashboard/templates/utils/a4-pagination";

interface SectionsManagerProps {
  template: AuditTemplate;
  setTemplate: Dispatch<SetStateAction<AuditTemplate>>;
  page: Page;
  handleQuestionAddition: (
    pageId: string,
    sectionId: string,
    newQuestion: NewSection["questions"][number]
  ) => void;
}

export function SectionsManager({
  template,
  setTemplate,
  page,
  handleQuestionAddition,
}: SectionsManagerProps) {
  const [openSections, setOpenSections] = useState<string[]>([]);

  const uniqueSectionsOnThisPage = page.sections;

  console.log("page", page);

  const addNewSection = () => {
    const tempId = `temp-${Date.now()}`;
    // Count unique logical sections by id across the whole template
    const uniqueSectionIds = new Set<string>();
    template.pages.forEach((p) =>
      p.sections.forEach((s) => uniqueSectionIds.add(s.id))
    );
    const totalUniqueSections = uniqueSectionIds.size;
    const newSection: NewSection = {
      page_id: page.id,
      title: `Section ${totalUniqueSections + 1}`,
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
      const reflowed = reflowTemplateByA4(updatedTemplate);
      setTemplate(reflowed);
      setOpenSections([...openSections, tempId]);
    }
  };

  const updateSection = (
    sectionId: string,
    field: keyof Section,
    value: string
  ) => {
    const updatedTemplate = { ...template };
    // propagate update across all fragments of this section id
    for (const p of updatedTemplate.pages) {
      p.sections = p.sections.map((s) =>
        s.id === sectionId ? { ...s, [field]: value } : s
      );
    }
    setTemplate(updatedTemplate);
  };

  const handleDeleteSection = (sectionId: string) => {
    const updatedTemplate = { ...template };
    for (const p of updatedTemplate.pages) {
      p.sections = p.sections.filter((s) => s.id !== sectionId);
    }
    const reflowed = reflowTemplateByA4(updatedTemplate);
    setTemplate(reflowed);
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
