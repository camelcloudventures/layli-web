"use client";

import { useState } from "react";
import type {
  InspectionQuestion,
  InspectionSection,
} from "@/lib/types/inspection-types";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Card as UiCard,
  CardContent as UiCardContent,
  CardHeader as UiCardHeader,
  CardTitle as UiCardTitle,
} from "@/components/ui/card";

interface InspectionQuestionsManagerProps {
  sections: InspectionSection[];
  setSections: React.Dispatch<React.SetStateAction<InspectionSection[]>>;
  section: InspectionSection;
}

export function InspectionQuestionsManager({
  sections,
  setSections,
  section,
}: InspectionQuestionsManagerProps) {
  const [expandedQuestions, setExpandedQuestions] = useState<string[]>([]);

  const addQuestion = (sectionIndex: number) => {
    const newSections = [...sections];
    newSections[sectionIndex].questions.push({
      id: `question-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)}`,
      name: "New question?",
      response: null,
      field_type: "TEXT",
      required: false,
      is_flagged: false,
      flag_rule: {},
      response_options: [],
      score: 0,
      note: "",
      attachment: null,
      action: null,
    });
    setSections(newSections);
    setExpandedQuestions([
      ...expandedQuestions,
      newSections[sectionIndex].questions[
        newSections[sectionIndex].questions.length - 1
      ].id,
    ]);
  };

  const updateQuestion = (
    sectionIndex: number,
    questionIndex: number,
    field: keyof InspectionQuestion,
    value:
      | string
      | boolean
      | number
      | null
      | {
          operator?: string;
          value?: string | number;
          value2?: string | number;
        }
  ) => {
    const newSections = [...sections];
    newSections[sectionIndex].questions[questionIndex][field] = value as never;
    // Clear response options if field type is changed from SELECT/MULTI_SELECT to something else
    if (
      field === "field_type" &&
      value !== "SELECT" &&
      value !== "MULTI_SELECT"
    ) {
      newSections[sectionIndex].questions[questionIndex].response_options = [];
    }
    setSections(newSections);
  };

  const removeQuestion = (sectionIndex: number, questionIndex: number) => {
    const newSections = [...sections];
    const qid = newSections[sectionIndex].questions[questionIndex].id;
    newSections[sectionIndex].questions.splice(questionIndex, 1);
    setSections(newSections);
    setExpandedQuestions(expandedQuestions.filter((id) => id !== qid));
  };

  const moveQuestion = (
    sectionIndex: number,
    questionIndex: number,
    direction: "up" | "down"
  ) => {
    if (
      (direction === "up" && questionIndex === 0) ||
      (direction === "down" &&
        questionIndex === sections[sectionIndex].questions.length - 1)
    ) {
      return;
    }
    const newSections = [...sections];
    const questions = [...newSections[sectionIndex].questions];
    const newIndex = direction === "up" ? questionIndex - 1 : questionIndex + 1;
    const temp = questions[questionIndex];
    questions[questionIndex] = questions[newIndex];
    questions[newIndex] = temp;
    newSections[sectionIndex].questions = questions;
    setSections(newSections);
  };

  const toggleQuestionExpanded = (qid: string) => {
    setExpandedQuestions((prev) =>
      prev.includes(qid) ? prev.filter((id) => id !== qid) : [...prev, qid]
    );
  };

  const sectionIndex = sections.findIndex((s) => s.id === section.id);

  // Helper for flag rule value
  function safeString(val: string | number | undefined | null): string {
    if (typeof val === "string") return val;
    if (typeof val === "number") return String(val);
    return "";
  }

  // Response options for select/multi-select
  function updateResponseOptions(
    sectionIndex: number,
    questionIndex: number,
    options: string[]
  ) {
    const newSections = [...sections];
    newSections[sectionIndex].questions[questionIndex].response_options =
      options;
    setSections(newSections);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm text-muted-foreground">Questions</h4>
        <Button
          type="button"
          onClick={() => addQuestion(sectionIndex)}
          variant="outline"
          size="sm"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Question
        </Button>
      </div>
      {section.questions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-md border border-dashed py-6">
          <div className="text-muted-foreground mb-2">
            <PlusCircle className="h-8 w-8 mx-auto" />
          </div>
          <p className="text-center text-sm text-muted-foreground mb-3">
            No questions added to this section
          </p>
          <Button
            type="button"
            onClick={() => addQuestion(sectionIndex)}
            size="sm"
            variant="outline"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Question
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {section.questions.map((question, questionIndex) => (
            <UiCard
              key={question.id}
              className={`shadow-sm border-slate-200 ${
                expandedQuestions.includes(question.id) ? "" : ""
              }`}
            >
              <UiCardHeader
                className="p-4 cursor-pointer"
                onClick={() => toggleQuestionExpanded(question.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UiCardTitle className="text-sm">
                      {question.name || "New question?"}
                    </UiCardTitle>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveQuestion(sectionIndex, questionIndex, "up");
                      }}
                      disabled={questionIndex === 0}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveQuestion(sectionIndex, questionIndex, "down");
                      }}
                      disabled={questionIndex === section.questions.length - 1}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeQuestion(sectionIndex, questionIndex);
                      }}
                      aria-label="Delete Question"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </UiCardHeader>
              {expandedQuestions.includes(question.id) && (
                <UiCardContent className="px-4 pt-0 pb-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`question-text-${question.id}`}>
                        Question Text
                      </Label>
                      <Input
                        id={`question-text-${question.id}`}
                        value={question.name}
                        onChange={(e) =>
                          updateQuestion(
                            sectionIndex,
                            questionIndex,
                            "name",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`question-type-${question.id}`}>
                        Field Type
                      </Label>
                      <Select
                        value={question.field_type || "TEXT"}
                        onValueChange={(value) =>
                          updateQuestion(
                            sectionIndex,
                            questionIndex,
                            "field_type",
                            value
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
                          <SelectItem value="SELECT">Single Select</SelectItem>
                          <SelectItem value="MULTI_SELECT">
                            Multi Select
                          </SelectItem>
                          <SelectItem value="CHECKBOX">Checkbox</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          id={`question-required-${question.id}`}
                          checked={!!question.required}
                          onCheckedChange={(checked) =>
                            updateQuestion(
                              sectionIndex,
                              questionIndex,
                              "required",
                              checked
                            )
                          }
                        />
                        <Label htmlFor={`question-required-${question.id}`}>
                          Required
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          id={`question-flagged-${question.id}`}
                          checked={!!question.is_flagged}
                          onCheckedChange={(checked) =>
                            updateQuestion(
                              sectionIndex,
                              questionIndex,
                              "is_flagged",
                              checked
                            )
                          }
                        />
                        <Label htmlFor={`question-flagged-${question.id}`}>
                          Flag Critical Issue
                        </Label>
                      </div>
                    </div>
                    {/* Response Options for SELECT/MULTI_SELECT */}
                    {(question.field_type === "SELECT" ||
                      question.field_type === "MULTI_SELECT") && (
                      <div className="space-y-2">
                        <Label>Response Options</Label>
                        <div className="flex flex-col gap-2">
                          {(question.response_options || []).map(
                            (opt: string, idx: number) => (
                              <div
                                key={idx}
                                className="flex gap-2 items-center"
                              >
                                <Input
                                  value={opt}
                                  onChange={(e) => {
                                    const opts = [
                                      ...(question.response_options || []),
                                    ];
                                    opts[idx] = e.target.value;
                                    updateResponseOptions(
                                      sectionIndex,
                                      questionIndex,
                                      opts
                                    );
                                  }}
                                  className="flex-1"
                                  placeholder={`Option ${idx + 1}`}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    const opts = [
                                      ...(question.response_options || []),
                                    ];
                                    opts.splice(idx, 1);
                                    updateResponseOptions(
                                      sectionIndex,
                                      questionIndex,
                                      opts
                                    );
                                  }}
                                  aria-label="Remove Option"
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            )
                          )}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateResponseOptions(
                                sectionIndex,
                                questionIndex,
                                [...(question.response_options || []), ""]
                              )
                            }
                          >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add Option
                          </Button>
                        </div>
                      </div>
                    )}
                    {/* Flagging UI */}
                    {question.is_flagged && (
                      <div className="space-y-2">
                        <Label className="font-medium">Flag when…</Label>
                        <div className="flex gap-2 items-center">
                          <select
                            className="border rounded px-2 py-1 text-sm"
                            aria-label="Flag operator"
                            value={safeString(question.flag_rule?.operator)}
                            onChange={(e) =>
                              updateQuestion(
                                sectionIndex,
                                questionIndex,
                                "flag_rule",
                                {
                                  ...question.flag_rule,
                                  operator: e.target.value,
                                }
                              )
                            }
                          >
                            <option value="">Select condition</option>
                            <option value="contains">Contains</option>
                            <option value="equals">Equals</option>
                            <option value="regex">Matches regex</option>
                            <option value="<">Less than</option>
                            <option value=">">Greater than</option>
                            <option value="=">Equal to</option>
                          </select>
                          <input
                            type="text"
                            className="border rounded px-2 py-1 text-sm"
                            aria-label="Flag value"
                            placeholder="Enter value"
                            value={safeString(question.flag_rule?.value)}
                            onChange={(e) =>
                              updateQuestion(
                                sectionIndex,
                                questionIndex,
                                "flag_rule",
                                {
                                  ...question.flag_rule,
                                  value: e.target.value,
                                }
                              )
                            }
                            disabled={!question.flag_rule?.operator}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </UiCardContent>
              )}
            </UiCard>
          ))}
        </div>
      )}
    </div>
  );
}
