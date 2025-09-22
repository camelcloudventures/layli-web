import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AuditTemplate, Question } from "@/lib/types/audit-types";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ImageUpload } from "./image-upload";
import { DeletePageButton } from "./delete-controls/delete-page-button";
import { DeleteSectionButton } from "./delete-controls/delete-section-button";
import { DeleteQuestionButton } from "./delete-controls/delete-question-button";
import HasPermission from "../../components/has-permission";
import { Permission } from "@/lib/auth/auth";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface TemplatePreviewContentProps {
  template: AuditTemplate;
}

export function TemplatePreviewContent({
  template,
}: TemplatePreviewContentProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const router = useRouter();

  function handleDeleteSuccess() {
    if (template.pages.length <= 1) {
      router.push("/dashboard/templates");
    } else if (currentPageIndex >= template.pages.length - 1) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  }

  console.log("template", template);
  if (!template.pages || template.pages.length === 0) {
    return (
      <div className="rounded-xl border p-8 text-center bg-white shadow">
        <FileText className="mx-auto h-16 w-16 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-bold">No Pages to Preview</h3>
        <p className="mt-2 text-muted-foreground text-base">
          Add pages, sections, and questions to see a preview of your template
        </p>
      </div>
    );
  }

  const pageCount = template?.pages?.length;

  if (currentPageIndex >= pageCount) {
    return null;
  }

  const currentPage = template.pages[currentPageIndex];
  const goToNextPage = () => {
    if (currentPageIndex < pageCount - 1)
      setCurrentPageIndex(currentPageIndex + 1);
  };
  const goToPrevPage = () => {
    if (currentPageIndex > 0) setCurrentPageIndex(currentPageIndex - 1);
  };

  return (
    <div className="my-4 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">
          Template Preview: {template.title}
        </h3>

        <div className="flex items-center justify-end gap-2">
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
          <span className="text-sm text-muted-foreground">
            Page {currentPageIndex + 1} of {pageCount}
          </span>
        </div>
      </div>

      <div className=" flex flex-col gap-4 ">
        <CardHeader className="p-0 mb-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold mb-1">
              {currentPage.title}
            </CardTitle>
            <HasPermission permission={Permission.EDIT_TEMPLATES}>
              <DeletePageButton
                pageId={String(currentPage.id)}
                templateId={String(template.id)}
                onDeleteSuccess={handleDeleteSuccess}
              />
            </HasPermission>
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
                  <HasPermission permission={Permission.EDIT_TEMPLATES}>
                    <DeleteSectionButton
                      sectionId={String(section.id)}
                      pageId={String(currentPage.id)}
                    />
                  </HasPermission>
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
                          <HasPermission permission={Permission.EDIT_TEMPLATES}>
                            <DeleteQuestionButton
                              questionId={String(question.id)}
                              sectionId={String(question.section_id)}
                            />
                          </HasPermission>
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
      </div>
    </div>
  );
}

function renderQuestionInput(question: Question) {
  switch (question.field_type) {
    case "BOOLEAN":
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
      );
    case "TEXT":
      return (
        <Textarea
          placeholder="Enter your answer here..."
          className="min-h-[100px]"
        />
      );
    case "DATE":
      return <Input type="date" />;
    case "PHOTO":
      return (
        <ImageUpload value={""} onChange={() => {}} label="Upload Image" />
      );
    case "NUMBER":
      return <Input type="number" placeholder="Enter a number" />;
    case "SELECT":
      if (
        !question.response_options ||
        question.response_options.length === 0
      ) {
        return (
          <p className="text-sm text-muted-foreground">
            No options defined for this question
          </p>
        );
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
      );
    case "MULTI_SELECT":
      if (
        !question.response_options ||
        question.response_options.length === 0
      ) {
        return (
          <p className="text-sm text-muted-foreground">
            No options defined for this question
          </p>
        );
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
      );
    case "SLIDER":
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
      );
    case "SIGNATURE":
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
      );
    case "LOCATION":
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
      );

    default:
      return (
        <p className="text-sm text-muted-foreground">
          Unsupported question type
        </p>
      );
  }
}
