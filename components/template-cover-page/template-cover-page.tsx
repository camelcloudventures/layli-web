import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { QuestionsManager } from "@/app/dashboard/templates/components/questions-manager";
import type {
  Question,
  ResponseOption,
  AuditTemplate,
} from "@/lib/types/audit-types";
import type { Response } from "@/lib/types/inspection-types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/context/auth-provider";
import {
  saveResponse,
  updateResponse,
} from "@/app/dashboard/inspections/actions/actions";

export interface TemplateCoverPageProps {
  isMultiTenant?: boolean;
  pageId: string;
  sectionId: string;
  inspectionId: string;
  initialResponses?: Response[];
  onProgressUpdate?: () => void;
}

// Helper function to create response options with proper structure
const createResponseOption = (
  label: string,
  code: string,
  sortOrder: number,
  isFlagged: boolean,
  color?: string
): ResponseOption => ({
  id: uuidv4(),
  question_id: "",
  label,
  code,
  sort_order: sortOrder,
  is_flagged: isFlagged,
  color: color || "emerald-500",
});

export const getPreloadedQuestions = (
  pageId: string,
  sectionId: string,
  isMultiTenant?: boolean
): Question[] => [
  {
    id: uuidv4(),
    page_id: pageId,
    section_id: sectionId,
    text: isMultiTenant ? "Tenant" : "Site Conducted",
    required: true,
    multiple_selection: false,
    is_flagged: false,
    field_type: "TEXT",
    ordinal: 1,
    response_options: [createResponseOption("Site", "TEXT", 1, false)],
  },
  {
    id: uuidv4(),
    page_id: pageId,
    section_id: sectionId,
    text: "Date",
    required: true,
    multiple_selection: false,
    is_flagged: false,
    field_type: "DATE",
    ordinal: 2,
    response_options: [
      createResponseOption("Date Input", "DATE_INPUT", 1, false),
    ],
  },
  {
    id: uuidv4(),
    page_id: pageId,
    section_id: sectionId,
    text: "Conducted by",
    required: true,
    multiple_selection: false,
    is_flagged: false,
    field_type: "TEXT",
    ordinal: 3,
    response_options: [
      createResponseOption("Person Selection", "TEXT", 1, false),
    ],
  },
  {
    id: uuidv4(),
    page_id: pageId,
    section_id: sectionId,
    text: "Location",
    required: true,
    multiple_selection: false,
    is_flagged: false,
    field_type: "TEXT",
    ordinal: 4,
    response_options: [createResponseOption("Text Input", "TEXT", 1, false)],
  },
];

export function TemplateCoverPage({
  isMultiTenant,
  pageId,
  sectionId,
  inspectionId,
  initialResponses,
  onProgressUpdate,
}: TemplateCoverPageProps) {
  const { user } = useAuth();
  const [questions] = useState<Question[]>(
    getPreloadedQuestions(pageId, sectionId, isMultiTenant)
  );
  const [responses, setResponses] = useState<Response[]>(
    initialResponses || []
  );
  const [unsavedResponses, setUnsavedResponses] = useState<
    Record<string, Response>
  >({});
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Pre-select current user for "Prepared by" field
  useEffect(() => {
    if (
      user &&
      !responses.some((r) => r.question_id === Number(questions[2].id))
    ) {
      //@ts-expect-error - questions is not typed
      const preparedByResponse: Response = {
        id: uuidv4(),
        question_id: Number(questions[2].id),
        selected_options: [],
        response_value: user.name || user.email,
        text_value: user.name || user.email,
        inspector_notes: "",
        file_attachments: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        inspection_id: inspectionId,
        manual_score: false,
        numeric_value: null,
        points_earned: 0,
        points_possible: 0,
        location_data: null,
      };
      setUnsavedResponses((prev) => ({
        ...prev,
        [Number(questions[2].id)]: preparedByResponse,
      }));
      setIsDirty(true);
    }
  }, [user, questions, responses, inspectionId]);

  const handleResponseChange = (questionId: string, newResponse: Response) => {
    // Format the response based on the question type
    const question = questions.find((q) => q.id === questionId);
    if (!question) return;

    const existingResponse = responses.find(
      (r) => r.question_id === Number(questionId)
    );

    //@ts-expect-error - responses is not typed
    let formattedResponse: Response = {
      id: existingResponse?.id || uuidv4(),
      question_id: Number(questionId),
      selected_options: [],
      response_value: newResponse.response_value || "",
      text_value: newResponse.response_value || "",
      inspector_notes: newResponse.inspector_notes || "",
      file_attachments: newResponse.file_attachments || [],
      created_at: existingResponse?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      inspection_id: inspectionId,
      manual_score: false,
      numeric_value: null,
      points_earned: 0,
      points_possible: 0,
      location_data: null,
    };

    // Add location data if it's a location question
    if (question.field_type === "LOCATION" && newResponse.location_data) {
      formattedResponse = {
        ...formattedResponse,
        location_data: newResponse.location_data,
      };
    }

    // Store in unsaved responses
    setUnsavedResponses((prev) => ({
      ...prev,
      [Number(questionId)]: formattedResponse,
    }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    if (Object.keys(unsavedResponses).length === 0) return;

    setIsSaving(true);
    try {
      // Save all unsaved responses
      const savedResponses = await Promise.all(
        Object.values(unsavedResponses).map((response) => {
          const existingResponse = responses.find(
            (r) => r.question_id === Number(response.question_id)
          );
          return existingResponse
            ? updateResponse(
                inspectionId,
                Number(response.question_id).toString(),
                response
              )
            : saveResponse(
                inspectionId,
                Number(response.question_id).toString(),
                response
              );
        })
      );

      // Update local state with saved responses
      setResponses((prev) => {
        const updated = [...prev];
        savedResponses.forEach((savedResponse) => {
          const index = updated.findIndex(
            (r) =>
              r.question_id === Number((savedResponse as Response).question_id)
          );
          if (index >= 0) {
            updated[index] = savedResponse as Response;
          } else {
            updated.push(savedResponse as Response);
          }
        });
        return updated;
      });

      // Clear unsaved responses
      setUnsavedResponses({});
      setIsDirty(false);

      // Update progress
      onProgressUpdate?.();
    } catch (error) {
      console.error("Failed to save responses:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Combine saved and unsaved responses for display
  const displayResponses = [...responses];
  Object.values(unsavedResponses).forEach((unsavedResponse) => {
    const index = displayResponses.findIndex(
      (r) => r.question_id === Number(unsavedResponse.question_id)
    );
    if (index >= 0) {
      displayResponses[index] = unsavedResponse;
    } else {
      displayResponses.push(unsavedResponse);
    }
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Cover Page</h3>
        <div className="flex items-center gap-2">
          <Badge variant={isDirty ? "destructive" : "secondary"}>
            {isDirty ? "Unsaved" : "Saved"}
          </Badge>
          <Button onClick={handleSave} disabled={!isDirty || isSaving}>
            {isSaving ? "Saving..." : "Save Responses"}
          </Button>
        </div>
      </div>
      <QuestionsManager
        template={
          {
            id: "cover-template",
            title: "",
            description: "",
            pages: [
              {
                id: pageId,
                template_id: "cover-template",
                title: "",
                description: "",
                ordinal: 1,
                sections: [
                  {
                    id: sectionId,
                    page_id: pageId,
                    title: "Cover Page",
                    ordinal: 1,
                    questions,
                  },
                ],
              },
            ],
          } as AuditTemplate
        }
        setTemplate={() => {}}
        page={{
          id: pageId,
          template_id: "cover-template",
          title: "",
          description: "",
          ordinal: 1,
          sections: [
            {
              id: sectionId,
              page_id: pageId,
              title: "Cover Page",
              ordinal: 1,
              questions,
            },
          ],
        }}
        section={{
          id: sectionId,
          page_id: pageId,
          title: "Cover Page",
          ordinal: 1,
          questions,
        }}
        //@ts-expect-error - responses is not typed
        responses={displayResponses}
        onResponseChange={handleResponseChange}
      />
    </div>
  );
}
