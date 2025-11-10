"use client";

import { type Dispatch, type SetStateAction, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  GripVertical,
  ChevronDown,
  ChevronUp,
  Plus,
  HelpCircle,
  Trash2,
} from "lucide-react";
import type {
  AuditTemplate,
  Page,
  Section,
  Question,
  NewQuestion,
} from "@/lib/types/audit-types";
import { ResponseOptionsManager } from "@/app/dashboard/templates/components/response-options-manager";
import { reflowTemplateByA4 } from "@/app/dashboard/templates/utils/a4-pagination";

interface QuestionsManagerProps {
  template: AuditTemplate;
  setTemplate: Dispatch<SetStateAction<AuditTemplate>>;
  page: Page;
  section: Section;
  handleQuestionAddition: (
    pageId: string,
    sectionId: string,
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    newQuestion: any
  ) => void;
}

export function QuestionsManager({
  template,
  setTemplate,
  page,
  section,
  handleQuestionAddition,
}: QuestionsManagerProps) {
  // Auto-expand all questions by default when editing
  const [expandedQuestions, setExpandedQuestions] = useState<string[]>(() => {
    return section.questions.map((q) => q.id);
  });

  // Update expanded questions when section questions change
  useEffect(() => {
    const allQuestionIds = section.questions.map((q) => q.id);
    setExpandedQuestions((prev) => {
      // Keep existing expanded questions, add new ones
      const newIds = allQuestionIds.filter((id) => !prev.includes(id));
      return [...prev, ...newIds];
    });
  }, [section.questions]);

  // For real pages, render the questions that actually belong to this section on this page
  const questionsForThisSectionOnThisPage = section.questions;

  const addNewQuestion = () => {
    const newQuestion: NewQuestion = {
      page_id: page.id,
      section_id: section.id,
      text: "New question?",
      required: false,
      multiple_selection: false,
      is_flagged: false,
      field_type: "TEXT",
      ordinal: section.questions.length + 1,
      response_options: [],
    };

    // Use the new question addition logic
    handleQuestionAddition(page.id, section.id, newQuestion);
  };

  const updateQuestion = (
    questionId: string,
    field: keyof Question,
    value: unknown
  ) => {
    const updatedTemplate = { ...template };
    const pageIndex = updatedTemplate.pages.findIndex((p) => p.id === page.id);

    if (pageIndex !== -1) {
      const sectionIndex = updatedTemplate.pages[pageIndex].sections.findIndex(
        (s) => s.id === section.id
      );

      if (sectionIndex !== -1) {
        const questionIndex = updatedTemplate.pages[pageIndex].sections[
          sectionIndex
        ].questions.findIndex((q) => q.id === questionId);

        if (questionIndex !== -1) {
          updatedTemplate.pages[pageIndex].sections[sectionIndex].questions[
            questionIndex
          ] = {
            ...updatedTemplate.pages[pageIndex].sections[sectionIndex]
              .questions[questionIndex],
            [field]: value,
          };

          // Clear response options if field type is changed from SELECT to something else
          if (
            field === "field_type" &&
            value !== "SELECT" &&
            value !== "MULTI_SELECT" &&
            updatedTemplate.pages[pageIndex].sections[sectionIndex].questions[
              questionIndex
            ].response_options
          ) {
            updatedTemplate.pages[pageIndex].sections[sectionIndex].questions[
              questionIndex
            ].response_options = [];
          }

          const reflowed = reflowTemplateByA4(updatedTemplate);
          setTemplate(reflowed);
        }
      }
    }
  };

  const handleDeleteQuestion = (questionId: string) => {
    const updatedTemplate = { ...template };
    const pageIndex = updatedTemplate.pages.findIndex((p) => p.id === page.id);
    if (pageIndex !== -1) {
      const sectionIndex = updatedTemplate.pages[pageIndex].sections.findIndex(
        (s) => s.id === section.id
      );
      if (sectionIndex !== -1) {
        updatedTemplate.pages[pageIndex].sections[sectionIndex].questions =
          updatedTemplate.pages[pageIndex].sections[
            sectionIndex
          ].questions.filter((q) => q.id !== questionId);
        const reflowed = reflowTemplateByA4(updatedTemplate);
        setTemplate(reflowed);
      }
    }
  };

  const moveQuestionUp = (questionId: string) => {
    const updatedTemplate = { ...template };
    const pageIndex = updatedTemplate.pages.findIndex((p) => p.id === page.id);

    if (pageIndex !== -1) {
      const sectionIndex = updatedTemplate.pages[pageIndex].sections.findIndex(
        (s) => s.id === section.id
      );

      if (sectionIndex !== -1) {
        const questions =
          updatedTemplate.pages[pageIndex].sections[sectionIndex].questions;
        const questionIndex = questions.findIndex((q) => q.id === questionId);

        if (questionIndex > 0) {
          // Swap with previous question
          [questions[questionIndex - 1], questions[questionIndex]] = [
            questions[questionIndex],
            questions[questionIndex - 1],
          ];

          // Update ordinals
          questions.forEach((question, index) => {
            question.ordinal = index + 1;
          });

          const reflowed = reflowTemplateByA4(updatedTemplate);
          setTemplate(reflowed);
        }
      }
    }
  };

  const moveQuestionDown = (questionId: string) => {
    const updatedTemplate = { ...template };
    const pageIndex = updatedTemplate.pages.findIndex((p) => p.id === page.id);

    if (pageIndex !== -1) {
      const sectionIndex = updatedTemplate.pages[pageIndex].sections.findIndex(
        (s) => s.id === section.id
      );

      if (sectionIndex !== -1) {
        const questions =
          updatedTemplate.pages[pageIndex].sections[sectionIndex].questions;
        const questionIndex = questions.findIndex((q) => q.id === questionId);

        if (questionIndex < questions.length - 1) {
          // Swap with next question
          [questions[questionIndex], questions[questionIndex + 1]] = [
            questions[questionIndex + 1],
            questions[questionIndex],
          ];

          // Update ordinals
          questions.forEach((question, index) => {
            question.ordinal = index + 1;
          });

          const reflowed = reflowTemplateByA4(updatedTemplate);
          setTemplate(reflowed);
        }
      }
    }
  };

  const toggleQuestionExpanded = (questionId: string) => {
    setExpandedQuestions((prevExpanded) => {
      if (prevExpanded.includes(questionId)) {
        return prevExpanded.filter((id) => id !== questionId);
      } else {
        return [...prevExpanded, questionId];
      }
    });
  };

  // Helper to ensure string for input value
  function safeString(val: string | number | undefined | null): string {
    if (typeof val === "string") return val;
    if (typeof val === "number") return String(val);
    return "";
  }

  return (
    <div className="space-y-4">
      <h4 className="font-medium">Questions</h4>
      {questionsForThisSectionOnThisPage.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-md border border-dashed py-8">
          <HelpCircle className="h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-center text-muted-foreground">
            No questions added to this section
          </p>
          <Button className="mt-4" onClick={addNewQuestion} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Question
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {questionsForThisSectionOnThisPage.map((question) => {
            return (
              <Card
                key={question.id}
                className={`border ${
                  expandedQuestions.includes(question.id)
                    ? "border-primary"
                    : ""
                }`}
              >
                <CardHeader
                  className="p-4 cursor-pointer"
                  onClick={() => toggleQuestionExpanded(question.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <CardTitle className="text-sm">{question.text}</CardTitle>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={question.ordinal === 1}
                        onClick={(e) => {
                          e.stopPropagation();
                          moveQuestionUp(question.id);
                        }}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={question.ordinal === section.questions.length}
                        onClick={(e) => {
                          e.stopPropagation();
                          moveQuestionDown(question.id);
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
                          handleDeleteQuestion(question.id);
                        }}
                        aria-label="Delete Question"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {expandedQuestions.includes(question.id) && (
                  <CardContent className="px-4 pt-0 pb-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={`question-text-${question.id}`}>
                          Question Text
                        </Label>
                        <Input
                          id={`question-text-${question.id}`}
                          value={question.text}
                          onChange={(e) =>
                            updateQuestion(question.id, "text", e.target.value)
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`question-type-${question.id}`}>
                          Field Type
                        </Label>
                        <Select
                          value={question.field_type}
                          onValueChange={(value) =>
                            updateQuestion(
                              question.id,
                              "field_type",
                              value as
                                | "BOOLEAN"
                                | "TEXT"
                                | "DATE"
                                | "PHOTO"
                                | "NUMBER"
                                | "SELECT"
                                | "MULTI_SELECT"
                                | "SIGNATURE"
                                | "LOCATION"
                                | "SLIDER"
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select field type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BOOLEAN">Yes/No</SelectItem>
                            <SelectItem value="TEXT">Text</SelectItem>
                            <SelectItem value="DATE">Date</SelectItem>
                            <SelectItem value="PHOTO">Photo</SelectItem>
                            <SelectItem value="NUMBER">Number</SelectItem>
                            <SelectItem value="SELECT">
                              Single Select
                            </SelectItem>
                            <SelectItem value="MULTI_SELECT">
                              Multi Select
                            </SelectItem>
                            <SelectItem value="SIGNATURE">Signature</SelectItem>
                            <SelectItem value="LOCATION">Location</SelectItem>
                            <SelectItem value="SLIDER">Slider</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Switch
                            id={`question-required-${question.id}`}
                            checked={question.required}
                            onCheckedChange={(checked) =>
                              updateQuestion(question.id, "required", checked)
                            }
                          />
                          <Label htmlFor={`question-required-${question.id}`}>
                            Required
                          </Label>
                        </div>

                        <div className="flex items-center gap-2">
                          <Switch
                            id={`question-flagged-${question.id}`}
                            checked={question.is_flagged}
                            onCheckedChange={(checked) =>
                              updateQuestion(question.id, "is_flagged", checked)
                            }
                          />
                          <Label htmlFor={`question-flagged-${question.id}`}>
                            Flag Critical Issue
                          </Label>
                        </div>

                        {(question.field_type === "SELECT" ||
                          question.field_type === "MULTI_SELECT") && (
                          <div className="flex items-center gap-2">
                            <Switch
                              id={`question-multiple-${question.id}`}
                              checked={question.multiple_selection}
                              onCheckedChange={(checked) =>
                                updateQuestion(
                                  question.id,
                                  "multiple_selection",
                                  checked
                                )
                              }
                            />
                            <Label htmlFor={`question-multiple-${question.id}`}>
                              Multiple Selection
                            </Label>
                          </div>
                        )}
                      </div>

                      {/* Add new field type specific UI components */}
                      {question.field_type === "SIGNATURE" && (
                        <div className="space-y-2">
                          <Label htmlFor={`signature-${question.id}`}>
                            Signature
                          </Label>
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
                            <span className="text-xs text-muted-foreground">
                              Sign here
                            </span>
                          </div>
                        </div>
                      )}

                      {question.field_type === "LOCATION" && (
                        <div className="space-y-2">
                          <Label htmlFor={`location-${question.id}`}>
                            Location
                          </Label>
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
                      )}

                      {question.field_type === "SLIDER" && (
                        <div className="space-y-2">
                          <Label htmlFor={`slider-${question.id}`}>
                            Slider (1-5)
                          </Label>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">1</span>
                            <Slider
                              id={`slider-${question.id}`}
                              value={[question.slider_value || 1]}
                              max={5}
                              min={1}
                              step={1}
                              className="w-full"
                              onValueChange={(val) =>
                                updateQuestion(
                                  question.id,
                                  "slider_value",
                                  val[0]
                                )
                              }
                            />
                            <span className="text-sm">5</span>
                            <span className="ml-2 text-muted-foreground text-xs">
                              Value: {question.slider_value || 1}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Response Options Manager (for SELECT & MULTI_SELECT) */}
                      {(question.field_type === "SELECT" ||
                        question.field_type === "MULTI_SELECT") && (
                        <ResponseOptionsManager
                          template={template}
                          setTemplate={setTemplate}
                          page={page}
                          section={section}
                          question={question}
                        />
                      )}

                      {/* Flagging UI for all logical field types - show if is_flagged is true OR if flag_rule exists */}
                      {(question.is_flagged || question.flag_rule) &&
                        (question.field_type === "TEXT" ||
                          question.field_type === "NUMBER" ||
                          question.field_type === "SLIDER" ||
                          question.field_type === "DATE" ||
                          question.field_type === "BOOLEAN" ||
                          question.field_type === "PHOTO" ||
                          question.field_type === "SIGNATURE" ||
                          question.field_type === "LOCATION") && (
                          <div className="space-y-2">
                            <Label className="font-medium">Flag when…</Label>
                            {/* TEXT */}
                            {question.field_type === "TEXT" && (
                              <div className="flex gap-2 items-center">
                                <select
                                  className="border rounded px-2 py-1 text-sm"
                                  aria-label="Flag operator for text"
                                  value={safeString(
                                    question.flag_rule?.operator
                                  )}
                                  onChange={(e) =>
                                    updateQuestion(question.id, "flag_rule", {
                                      ...question.flag_rule,
                                      operator: e.target.value,
                                    })
                                  }
                                >
                                  <option value="">Select condition</option>
                                  <option value="contains">Contains</option>
                                  <option value="equals">Equals</option>
                                  <option value="regex">Matches regex</option>
                                </select>
                                <input
                                  type="text"
                                  className="border rounded px-2 py-1 text-sm"
                                  aria-label="Flag value for text"
                                  placeholder="Enter value"
                                  value={safeString(question.flag_rule?.value)}
                                  onChange={(e) =>
                                    updateQuestion(question.id, "flag_rule", {
                                      ...question.flag_rule,
                                      value: e.target.value,
                                    })
                                  }
                                  disabled={!question.flag_rule?.operator}
                                />
                              </div>
                            )}
                            {/* NUMBER/SLIDER */}
                            {(question.field_type === "NUMBER" ||
                              question.field_type === "SLIDER") && (
                              <div className="flex gap-2 items-center">
                                <select
                                  className="border rounded px-2 py-1 text-sm"
                                  aria-label="Flag operator for number"
                                  value={safeString(
                                    question.flag_rule?.operator
                                  )}
                                  onChange={(e) =>
                                    updateQuestion(question.id, "flag_rule", {
                                      ...question.flag_rule,
                                      operator: e.target.value,
                                      value: undefined,
                                      value2: undefined,
                                    })
                                  }
                                >
                                  <option value="">Select condition</option>
                                  <option value="<">Less than</option>
                                  <option value=">">Greater than</option>
                                  <option value="=">Equal to</option>
                                  <option value="between">Between</option>
                                  <option value="not_between">
                                    Not between
                                  </option>
                                </select>
                                {/* Single value input */}
                                {["<", ">", "="].includes(
                                  question.flag_rule?.operator || ""
                                ) && (
                                  <input
                                    type="number"
                                    className="border rounded px-2 py-1 text-sm"
                                    aria-label="Flag value for number"
                                    placeholder="Enter value"
                                    value={safeString(
                                      question.flag_rule?.value
                                    )}
                                    onChange={(e) =>
                                      updateQuestion(question.id, "flag_rule", {
                                        ...question.flag_rule,
                                        value: e.target.value,
                                      })
                                    }
                                    disabled={!question.flag_rule?.operator}
                                  />
                                )}
                                {/* Two value inputs for between/not_between */}
                                {["between", "not_between"].includes(
                                  question.flag_rule?.operator || ""
                                ) && (
                                  <>
                                    <input
                                      type="number"
                                      className="border rounded px-2 py-1 text-sm"
                                      aria-label="Flag value 1 for number"
                                      placeholder="Min"
                                      value={safeString(
                                        question.flag_rule?.value
                                      )}
                                      onChange={(e) =>
                                        updateQuestion(
                                          question.id,
                                          "flag_rule",
                                          {
                                            ...question.flag_rule,
                                            value: e.target.value,
                                          }
                                        )
                                      }
                                      disabled={!question.flag_rule?.operator}
                                    />
                                    <span className="text-xs">and</span>
                                    <input
                                      type="number"
                                      className="border rounded px-2 py-1 text-sm"
                                      aria-label="Flag value 2 for number"
                                      placeholder="Max"
                                      value={safeString(
                                        question.flag_rule?.value2
                                      )}
                                      onChange={(e) =>
                                        updateQuestion(
                                          question.id,
                                          "flag_rule",
                                          {
                                            ...question.flag_rule,
                                            value2: e.target.value,
                                          }
                                        )
                                      }
                                      disabled={!question.flag_rule?.operator}
                                    />
                                  </>
                                )}
                              </div>
                            )}
                            {/* DATE */}
                            {question.field_type === "DATE" && (
                              <div className="flex gap-2 items-center">
                                <select
                                  className="border rounded px-2 py-1 text-sm"
                                  aria-label="Flag operator for date"
                                  value={safeString(
                                    question.flag_rule?.operator
                                  )}
                                  onChange={(e) =>
                                    updateQuestion(question.id, "flag_rule", {
                                      ...question.flag_rule,
                                      operator: e.target.value,
                                      value: undefined,
                                      value2: undefined,
                                    })
                                  }
                                >
                                  <option value="">Select condition</option>
                                  <option value="before">Before</option>
                                  <option value="after">After</option>
                                  <option value="on">On</option>
                                  <option value="between">Between</option>
                                  <option value="not_between">
                                    Not between
                                  </option>
                                </select>
                                {/* Single date input */}
                                {["before", "after", "on"].includes(
                                  question.flag_rule?.operator || ""
                                ) && (
                                  <input
                                    type="date"
                                    className="border rounded px-2 py-1 text-sm"
                                    aria-label="Flag value for date"
                                    value={safeString(
                                      question.flag_rule?.value
                                    )}
                                    onChange={(e) =>
                                      updateQuestion(question.id, "flag_rule", {
                                        ...question.flag_rule,
                                        value: e.target.value,
                                      })
                                    }
                                    disabled={!question.flag_rule?.operator}
                                  />
                                )}
                                {/* Two date inputs for between/not_between */}
                                {["between", "not_between"].includes(
                                  question.flag_rule?.operator || ""
                                ) && (
                                  <>
                                    <input
                                      type="date"
                                      className="border rounded px-2 py-1 text-sm"
                                      aria-label="Flag value 1 for date"
                                      value={safeString(
                                        question.flag_rule?.value
                                      )}
                                      onChange={(e) =>
                                        updateQuestion(
                                          question.id,
                                          "flag_rule",
                                          {
                                            ...question.flag_rule,
                                            value: e.target.value,
                                          }
                                        )
                                      }
                                      disabled={!question.flag_rule?.operator}
                                    />
                                    <span className="text-xs">and</span>
                                    <input
                                      type="date"
                                      className="border rounded px-2 py-1 text-sm"
                                      aria-label="Flag value 2 for date"
                                      value={safeString(
                                        question.flag_rule?.value2
                                      )}
                                      onChange={(e) =>
                                        updateQuestion(
                                          question.id,
                                          "flag_rule",
                                          {
                                            ...question.flag_rule,
                                            value2: e.target.value,
                                          }
                                        )
                                      }
                                      disabled={!question.flag_rule?.operator}
                                    />
                                  </>
                                )}
                              </div>
                            )}
                            {/* BOOLEAN */}
                            {question.field_type === "BOOLEAN" && (
                              <div className="flex gap-2 items-center">
                                <select
                                  className="border rounded px-2 py-1 text-sm"
                                  aria-label="Flag operator for boolean"
                                  value={safeString(question.flag_rule?.value)}
                                  onChange={(e) =>
                                    updateQuestion(question.id, "flag_rule", {
                                      operator: "equals",
                                      value: e.target.value,
                                    })
                                  }
                                >
                                  <option value="">Select condition</option>
                                  <option value="true">Flag if Yes</option>
                                  <option value="false">Flag if No</option>
                                </select>
                              </div>
                            )}
                            {/* PHOTO, SIGNATURE, LOCATION */}
                            {(question.field_type === "PHOTO" ||
                              question.field_type === "SIGNATURE" ||
                              question.field_type === "LOCATION") && (
                              <div className="flex gap-2 items-center">
                                <select
                                  className="border rounded px-2 py-1 text-sm"
                                  aria-label="Flag operator for presence"
                                  value={safeString(
                                    question.flag_rule?.operator
                                  )}
                                  onChange={(e) =>
                                    updateQuestion(question.id, "flag_rule", {
                                      operator: e.target.value,
                                    })
                                  }
                                >
                                  <option value="">Select condition</option>
                                  <option value="present">
                                    Flag if present
                                  </option>
                                  <option value="absent">Flag if absent</option>
                                </select>
                              </div>
                            )}
                          </div>
                        )}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
      {questionsForThisSectionOnThisPage.length > 0 && (
        <div className="flex justify-end">
          <Button onClick={addNewQuestion} variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Question
          </Button>
        </div>
      )}
    </div>
  );
}
