"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FieldMapper } from "./fields/field-mapper";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { Paperclip } from "lucide-react";
import { NoteDisplay } from "@/components/custom/note-with-attachments";
import {
  Inspection,
  LocationResponse,
  Response,
  Question,
} from "@/lib/types/inspection-types";
import { User } from "@/lib/types";
import { useActionsStore } from "@/store/actions";
import { AttachedAction } from "./attached-action";
import { PlusCircle } from "lucide-react";

type CurrentInspectionProps = {
  currentInspection: Inspection;
  responses: Record<number, Response>;
  persistedResponses: Record<number, Response>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  unsavedChanges: Record<number, any>;
  savingFields: Record<number, boolean>;
  handleResponse: (
    question: Question,
    value: string | string[] | LocationResponse,
    files?: File[]
  ) => void;
  setActiveQuestionId: (questionId: number) => void;
  setNote: (note: string) => void;
  setIsNoteDialogOpen: (isOpen: boolean) => void;
  setIsFileDialogOpen: (isOpen: boolean) => void;
  setIsCreateActionDialogOpen: (isOpen: boolean) => void;
  fileAttachments: {
    questionId?: number;
    fileName?: string;
    file_path?: string;
    file_size?: number;
    mime_type?: string;
  }[];
  setFileAttachments: (
    files: {
      questionId?: number;
      fileName?: string;
      file_path?: string;
      file_size?: number;
      mime_type?: string;
    }[]
  ) => void;
  setSelectedFile: (file: File | null) => void;
  users: User[];
};
export function CurrentInspection({
  currentInspection,
  responses,
  persistedResponses,
  unsavedChanges,
  handleResponse,
  setActiveQuestionId,
  setNote,
  setIsNoteDialogOpen,
  setIsFileDialogOpen,
  setIsCreateActionDialogOpen,
  fileAttachments,
  setFileAttachments,
  setSelectedFile,
  users,
}: CurrentInspectionProps) {
  const { actions } = useActionsStore();
  console.log("currentInspection", currentInspection);
  // Resolve trigger value (which may reference a template option id) to the live
  // inspection response option id by matching via template option code/label.
  const resolveTriggerOptionId = (
    parentQuestion: Question,
    rawTriggerValue: string | number | boolean
  ): number | null => {
    if (typeof rawTriggerValue === "boolean") {
      return null;
    }
    const asNumber =
      typeof rawTriggerValue === "string"
        ? parseInt(rawTriggerValue, 10)
        : (rawTriggerValue as number);
    // 1) If it already matches a live option id, use it
    if (
      !isNaN(asNumber) &&
      parentQuestion.response_options?.some((opt) => opt.id === asNumber)
    ) {
      return asNumber;
    }
    // 2) Try resolve through the template by matching the option via id -> code/label
    const template = currentInspection.template;
    if (!template) return null;
    // Find matching template question by text (best available invariant)
    for (const tPage of template.pages || []) {
      for (const tSection of tPage.sections || []) {
        const tQuestion = tSection.questions.find(
          (q) =>
            q.text?.trim().toLowerCase() ===
            parentQuestion.text?.trim().toLowerCase()
        );
        if (!tQuestion) continue;
        const tOption = tQuestion.response_options?.find(
          (opt) => String(opt.id) === String(rawTriggerValue)
        );
        if (!tOption) continue;
        // Prefer code match, else label match
        const matchByCodeOrLabel = parentQuestion.response_options?.find(
          (opt) =>
            (tOption.code && opt.code && opt.code === tOption.code) ||
            opt.label?.trim().toLowerCase() ===
              tOption.label?.trim().toLowerCase()
        );
        if (matchByCodeOrLabel) return matchByCodeOrLabel.id;
      }
    }
    return null;
  };
  const shouldShowQuestion = (question: Question) => {
    if (!question.parent_question_id) {
      return true;
    }

    // Only use server-confirmed responses to evaluate conditional logic
    const parentResponse = persistedResponses[question.parent_question_id];
    if (!parentResponse) {
      return false;
    }

    const { trigger } = question;
    if (!trigger) {
      return true;
    }

    const { value, operator } = trigger;

    // Find parent question to check its field type
    let parentQuestion: Question | undefined;
    for (const page of currentInspection.pages) {
      for (const section of page.sections) {
        const found = section.questions.find(
          (q) => q.id === question.parent_question_id
        );
        if (found) {
          parentQuestion = found;
          break;
        }
      }
      if (parentQuestion) break;
    }

    if (!parentQuestion) {
      return false;
    }

    // Check if parent is SELECT/CHECKBOX/MULTI_SELECT (uses selected_options)
    const isSelectType =
      parentQuestion.field_type === "SELECT" ||
      parentQuestion.field_type === "MULTI_SELECT" ||
      parentQuestion.field_type === "CHECKBOX";

    let parentValue: string | number | boolean | undefined;
    let parentValues: (string | number)[] | undefined;

    if (isSelectType) {
      // For SELECT/CHECKBOX/MULTI_SELECT, check selected_options array
      parentValues = parentResponse.selected_options || [];
      const selected = (parentValues as number[]) || [];
      // Resolve trigger to a live option id (from template space if needed)
      const resolvedOptionId = resolveTriggerOptionId(parentQuestion, value);
      // If we cannot resolve the trigger option for select types, fail closed (do not show)
      if (resolvedOptionId == null) {
        return false;
      }

      // Convert trigger value to number if it's a string (for option ID comparison)
      const triggerValueAsNumber = resolvedOptionId;
      const triggerValueAsString = String(resolvedOptionId);

      switch (operator) {
        case "equals":
          // Check if trigger value (option ID) is in selected_options
          return selected.includes(triggerValueAsNumber as number);
        case "not_equals":
          // Check if trigger value is NOT in selected_options
          return !selected.includes(triggerValueAsNumber as number);
        case "contains":
          // For MULTI_SELECT/CHECKBOX, check if any selected option matches
          return selected.some(
            (optId) =>
              optId === triggerValueAsNumber ||
              String(optId) === triggerValueAsString
          );
        default:
          return true;
      }
    } else {
      // For other field types, use response_value
      parentValue = parentResponse.response_value;

      // Convert values to strings for comparison
      const parentValueStr = String(parentValue || "");
      const triggerValueStr = String(value);

      switch (operator) {
        case "equals":
          return parentValueStr === triggerValueStr;
        case "not_equals":
          return parentValueStr !== triggerValueStr;
        case "contains":
          return parentValueStr.includes(triggerValueStr);
        default:
          return true;
      }
    }
  };

  console.log("-------------------NEEDS TO SHOW LOG--------------");
  console.log("actions", actions);
  return (
    <Card className="border-none  shadow-none bg-transparent w-full">
      <CardContent className="p-0  pt-6  ">
        <Tabs defaultValue={currentInspection.pages[0].id.toString()}>
          <TabsList className="flex justify-center  gap-2">
            {currentInspection.pages.map((page) => (
              <TabsTrigger
                key={page.id}
                value={page.id.toString()}
                className="p-4 text-sm font-medium  transition-colors data-[state=active]:bg-white data-[state=active]:text-black data-[state=inactive]:bg-muted data-[state=inactive]:text-muted-foreground "
              >
                {page.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {currentInspection.pages.map((page) => (
            <TabsContent
              className="w-full"
              key={page.id}
              value={page.id.toString()}
            >
              <div className="space-y-6">
                {page.sections.map((section) => (
                  <div key={section.id} className="space-y-4">
                    <h3 className="text-lg font-semibold">{section.title}</h3>
                    {section.questions
                      .filter(shouldShowQuestion)
                      .map((question) => {
                        const response = responses[question.id];
                        const unsavedChange = unsavedChanges[question.id];
                        const hasUnsavedChange = unsavedChange !== undefined;
                        const actionId =
                          unsavedChange?.action_id || response?.action_id;
                        const action = actions.find((a) => a.id === actionId);

                        const isCompleted =
                          currentInspection.status === "completed" ||
                          currentInspection.status === "done";

                        return (
                          <Card className=" shadow-none" key={question.id}>
                            <CardContent className="pt-6">
                              <div className="space-y-4">
                                <FieldMapper
                                  question={question}
                                  response={response}
                                  onResponse={(value, files) =>
                                    handleResponse(question, value, files)
                                  }
                                  fileAttachments={fileAttachments}
                                  setFileAttachments={setFileAttachments}
                                  hasUnsavedChanges={hasUnsavedChange}
                                  isDisabled={isCompleted}
                                  users={users}
                                />
                                <div className="flex flex-wrap gap-2 w-full justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setActiveQuestionId(question.id);
                                        setNote(
                                          response?.inspector_notes || ""
                                        );
                                        setIsNoteDialogOpen(true);
                                      }}
                                      disabled={isCompleted}
                                    >
                                      <FileText className="mr-2 h-4 w-4" />
                                      {response?.inspector_notes
                                        ? "Edit Note"
                                        : "Add Note"}
                                    </Button>

                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setActiveQuestionId(question.id);

                                        // Always reset selectedFile first
                                        setSelectedFile(null);

                                        // Then set it only if this question has existing attachments
                                        if (
                                          response?.file_attachments?.length
                                        ) {
                                          const attachment =
                                            response.file_attachments[0];
                                          const fileLikeObject = {
                                            name: attachment.filename,
                                            size: attachment.file_size,
                                            type: attachment.mime_type,
                                            file_path: attachment.file_path,
                                            fileName: attachment.filename,
                                          };
                                          setSelectedFile(
                                            fileLikeObject as unknown as File
                                          );
                                        }

                                        setIsFileDialogOpen(true);
                                      }}
                                      disabled={isCompleted}
                                    >
                                      <Paperclip className="mr-2 h-4 w-4" />
                                      {response?.file_attachments?.length
                                        ? "Edit Attachment"
                                        : "Attach File"}
                                    </Button>

                                    {!action && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          setActiveQuestionId(question.id);
                                          setIsCreateActionDialogOpen(true);
                                        }}
                                        disabled={isCompleted}
                                      >
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Create Action
                                      </Button>
                                    )}
                                  </div>
                                </div>
                                {action && <AttachedAction action={action} />}
                                {/* <h1>Note</h1> */}
                                {/* Display notes */}
                                {response?.inspector_notes && (
                                  <div className="mt-3">
                                    <h1 className="font-semibold text-muted-foreground">
                                      Notes
                                    </h1>
                                    <NoteDisplay
                                      note={response.inspector_notes}
                                      className="mt-3"
                                    />
                                  </div>
                                )}

                                {response?.file_attachments &&
                                  response.file_attachments.length > 0 && (
                                    <div className="font-semibold text-muted-foreground">
                                      Attached File(s):
                                    </div>
                                  )}
                                {response?.file_attachments &&
                                  response.file_attachments.length > 0 && (
                                    <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30 mt-2">
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                          <Paperclip className="h-4 w-4" />
                                          <span className="text-sm font-medium truncate">
                                            {
                                              response.file_attachments[0]
                                                .filename
                                            }
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
