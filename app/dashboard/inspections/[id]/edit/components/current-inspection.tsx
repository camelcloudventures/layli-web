"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FieldMapper } from "./fields/field-mapper";
import { Button } from "@/components/ui/button";
import { FileText, Save } from "lucide-react";
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
import { ResponseData } from "@/app/dashboard/inspections/types/types";

type CurrentInspectionProps = {
  currentInspection: Inspection;
  responses: Record<number, Response>;
  unsavedChanges: Record<number, ResponseData>;
  savingFields: Record<number, boolean>;
  handleResponse: (
    question: Question,
    value: string | string[] | LocationResponse,
    files?: File[]
  ) => void;
  handleFieldSave: (questionId: number) => Promise<void>;
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
  unsavedChanges,
  savingFields,
  handleResponse,
  handleFieldSave,
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
                    {section.questions.map((question) => {
                      const response = responses[question.id];
                      const unsavedChange = unsavedChanges[question.id];
                      const hasUnsavedChange = unsavedChange !== undefined;
                      const isSaving = savingFields[question.id];
                      const actionId =
                        unsavedChange?.action_id || response?.action_id;
                      const action = actions.find((a) => a.id === actionId);

                      // Only disable fields after they've been saved (have a response ID)
                      // For all field types, check if there's a response ID
                      const isAnswered = !!response?.id;

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
                                isDisabled={isAnswered}
                                users={users}
                              />
                              <div className="flex flex-wrap gap-2 w-full justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setActiveQuestionId(question.id);
                                      setNote(response?.inspector_notes || "");
                                      setIsNoteDialogOpen(true);
                                    }}
                                    disabled={isAnswered}
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
                                      if (response?.file_attachments?.length) {
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
                                    disabled={isAnswered}
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
                                      disabled={isAnswered}
                                    >
                                      <PlusCircle className="mr-2 h-4 w-4" />
                                      Create Action
                                    </Button>
                                  )}
                                </div>

                                <div className="space-y-4">
                                  <div className="flex items-start justify-between gap-4">
                                    {hasUnsavedChange && (
                                      <div className="flex items-center gap-2 pt-2">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() =>
                                            handleFieldSave(question.id)
                                          }
                                          disabled={isSaving}
                                          className="h-7 px-2 text-xs"
                                        >
                                          <Save className="mr-1 h-3 w-3" />
                                          {isSaving ? "Saving..." : "Save"}
                                        </Button>
                                      </div>
                                    )}
                                  </div>
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
