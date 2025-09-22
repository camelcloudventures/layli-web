"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  Flag,
  FileText,
  User,
  Download,
} from "lucide-react";
import { Inspection, InspectionResponse } from "../types/inspection-types";
import { downloadInspectionPDF } from "../utils/pdf-generator";
import { toast } from "sonner";
import { useActions } from "@/hooks/use-actions";
import Image from "next/image";

interface InspectionReportProps {
  inspection: Inspection;
}

export function InspectionReport({ inspection }: InspectionReportProps) {
  const [selectedPage, setSelectedPage] = useState(0);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { actions } = useActions();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A":
        return "bg-green-100 text-green-800";
      case "B":
        return "bg-blue-100 text-blue-800";
      case "C":
        return "bg-yellow-100 text-yellow-800";
      case "D":
        return "bg-orange-100 text-orange-800";
      case "F":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getResponseDisplayValue = (
    response: InspectionResponse,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    question: any
  ) => {
    // Handle Signature
    if (question.field_type === "SIGNATURE" && response.response_value) {
      return (
        <a
          href={response.response_value}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src={response.response_value}
            alt="Signature"
            width={200}
            height={100}
            className="rounded-md border bg-white"
          />
        </a>
      );
    }

    // Handle Photo - check both file_attachments and response_value
    if (question.field_type === "PHOTO") {
      // First check if there are file attachments
      if (response.file_attachments && response.file_attachments.length > 0) {
        const photo = response.file_attachments[0];
        return (
          //@ts-expect-error - this is a temporary fix to get the photo to display
          <a href={photo?.file_path} target="_blank" rel="noopener noreferrer">
            <Image
              // @ts-expect-error - this is a temporary fix to get the photo to display
              src={photo?.file_path}
              // @ts-expect-error - this is a temporary fix to get the photo to display
              alt={photo?.filename}
              width={200}
              height={150}
              className="rounded-md border object-cover"
            />
          </a>
        );
      }
      // If no file attachments, check if response_value is a URL
      if (
        response.response_value &&
        response.response_value.startsWith("http")
      ) {
        return (
          <a
            href={response.response_value}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={response.response_value}
              alt="Uploaded photo"
              width={200}
              height={150}
              className="rounded-md border object-cover"
            />
          </a>
        );
      }
      return "No photo uploaded";
    }

    // Handle BOOLEAN questions
    if (question.field_type === "BOOLEAN") {
      if (
        response.response_value === "true" ||
        response.response_value === "1"
      ) {
        return "Yes";
      }
      if (
        response.response_value === "false" ||
        response.response_value === "0"
      ) {
        return "No";
      }
      return "No response";
    }

    // Handle NUMBER questions
    if (question.field_type === "NUMBER") {
      if (
        response.numeric_value !== null &&
        response.numeric_value !== undefined
      ) {
        return response.numeric_value.toString();
      }
      if (response.response_value) {
        return response.response_value;
      }
      return "No response";
    }

    // Handle DATE questions
    if (question.field_type === "DATE") {
      if (response.response_value) {
        try {
          return new Date(response.response_value).toLocaleDateString();
        } catch {
          return response.response_value;
        }
      }
      return "No response";
    }

    // Handle SELECT questions
    if (question.field_type === "SELECT") {
      // First check if response_value contains a valid option label
      if (response.response_value && question.response_options) {
        const matchingOption = question.response_options.find(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (option: any) => option.label === response.response_value
        );
        if (matchingOption) {
          return response.response_value;
        }
      }
      // Fallback: check if we have selected_options with IDs (rare case)
      if (
        response.selected_options &&
        response.selected_options.length > 0 &&
        question.response_options
      ) {
        const selectedLabels = response.selected_options
          .map((optionId) => {
            // Convert to number if it's a string
            const numericId =
              typeof optionId === "string" ? parseInt(optionId) : optionId;
            const option = question.response_options.find(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (o: any) => o.id === numericId
            );
            return option ? option.label : null;
          })
          .filter(Boolean)
          .join(", ");
        return selectedLabels || "No response";
      }
      // Final fallback to response_value
      if (response.response_value) {
        return response.response_value;
      }
      return "No response";
    }

    // Handle MULTI_SELECT questions
    if (question.field_type === "MULTI_SELECT") {
      // First check if response_value contains comma-separated labels
      if (response.response_value && question.response_options) {
        // Split by comma and check if each part matches an option label
        const responseValues = response.response_value
          .split(",")
          .map((v) => v.trim());
        const validLabels = responseValues.filter((value) =>
          question.response_options.some(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (option: any) => option.label === value
          )
        );
        if (validLabels.length > 0) {
          return validLabels.join(", ");
        }
      }
      // Fallback: check if we have selected_options with IDs (rare case)
      if (
        response.selected_options &&
        response.selected_options.length > 0 &&
        question.response_options
      ) {
        const selectedLabels = response.selected_options
          .map((optionId) => {
            // Convert to number if it's a string
            const numericId =
              typeof optionId === "string" ? parseInt(optionId) : optionId;
            const option = question.response_options.find(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (o: any) => o.id === numericId
            );
            return option ? option.label : null;
          })
          .filter(Boolean)
          .join(", ");
        return selectedLabels || "No response";
      }
      // Final fallback to response_value
      if (response.response_value) {
        return response.response_value;
      }
      return "No response";
    }

    // Handle TEXT questions
    if (question.field_type === "TEXT") {
      if (response.text_value) {
        return response.text_value;
      }
      if (response.response_value) {
        return response.response_value;
      }
      return "No response";
    }

    // Handle LOCATION questions
    if (question.field_type === "LOCATION") {
      if (response.location_data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const location = response.location_data as any;
        if (location?.address) {
          return location.address;
        }
        if (location?.latitude && location?.longitude) {
          return `Lat: ${location.latitude}, Lng: ${location.longitude}`;
        }
      }
      return "No location recorded";
    }

    // Handle SLIDER questions
    if (question.field_type === "SLIDER") {
      if (
        response.numeric_value !== null &&
        response.numeric_value !== undefined
      ) {
        return response.numeric_value.toString();
      }
      if (response.response_value) {
        return response.response_value;
      }
      return "No response";
    }

    // Fallback for other field types
    if (response.text_value) return response.text_value;
    if (
      response.numeric_value !== null &&
      response.numeric_value !== undefined
    ) {
      return response.numeric_value.toString();
    }
    if (response.response_value) {
      // Only try to parse as date if it looks like a date string
      if (response.response_value.match(/^\d{4}-\d{2}-\d{2}/)) {
        try {
          return new Date(response.response_value).toLocaleDateString();
        } catch {
          return response.response_value;
        }
      }
      return response.response_value;
    }
    if (response.selected_options && response.selected_options.length > 0) {
      return response.selected_options.join(", ");
    }
    return "No response";
  };

  const getQuestionById = (questionId: number) => {
    for (const page of inspection.pages) {
      for (const section of page.sections) {
        const question = section.questions.find((q) => q.id === questionId);
        if (question) return question;
      }
    }
    return null;
  };

  const getSectionScore = (sectionId: number) => {
    return inspection.section_scores.find(
      (score) => score.section_id === sectionId
    );
  };

  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPDF(true);

      // Generate filename based on inspection title and date
      const filename = `inspection-report-${inspection.title.replace(
        /[^a-zA-Z0-9]/g,
        "-"
      )}-${new Date().toISOString().split("T")[0]}.pdf`;

      // Download the PDF
      downloadInspectionPDF(inspection, { filename });

      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Calculate issues and actions counts
  const issueCount = inspection.responses.filter((r) => r.is_flagged).length;
  const actionCount = inspection.responses.filter((r) => r.action_id).length;

  // Get inspector name from assignees
  const inspector =
    inspection.assignees.find((a) => a.role === "auditor") ||
    inspection.assignees[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {inspection.title}
          </h1>
          <p className="text-gray-600 mt-1">{inspection.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
          >
            <Download className="w-4 h-4 mr-2" />
            {isGeneratingPDF ? "Generating..." : "Download PDF"}
          </Button>
          <Link href="/dashboard/inspections">
            <Button variant="outline">Back to Inspections</Button>
          </Link>
        </div>
      </div>

      {/* Inspection Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Inspection Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Conducted On
              </p>
              <p className="text-lg font-semibold">
                {formatDate(inspection.created_at)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Completed On
              </p>
              <p className="text-lg font-semibold">
                {formatDate(inspection.completed_at)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Inspector
              </p>
              <p className="text-lg font-semibold">
                {inspector?.full_name || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Score</p>
              <p
                className={`text-lg font-semibold ${
                  (inspection.final_score || 0) >= 80
                    ? "text-green-600"
                    : (inspection.final_score || 0) >= 60
                    ? "text-amber-600"
                    : "text-red-600"
                }`}
              >
                {inspection.final_score}%
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Issues Found
              </p>
              <p className="text-lg font-semibold">{issueCount}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Actions Created
              </p>
              <p className="text-lg font-semibold">{actionCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assignees */}
      {inspection.assignees.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Assignees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {inspection.assignees.map((assignee) => (
                <Badge key={assignee.id} variant="secondary">
                  {assignee.full_name} ({assignee.role})
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Page Navigation */}
      {inspection.pages.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {inspection.pages.map((page, index) => (
                <Button
                  key={page.id}
                  variant={selectedPage === index ? "default" : "outline"}
                  onClick={() => setSelectedPage(index)}
                >
                  {page.title}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sections */}
      <div className="space-y-6">
        {inspection.pages[selectedPage]?.sections.map((section) => {
          const sectionScore = getSectionScore(section.id);
          const sectionResponses = inspection.responses.filter((response) => {
            const question = getQuestionById(response.question_id);
            return (
              question && section.questions.some((q) => q.id === question.id)
            );
          });

          return (
            <Card
              key={section.id}
              className={
                sectionResponses.some((r) => r.is_flagged)
                  ? "border-red-200 bg-red-50"
                  : ""
              }
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {sectionResponses.some((r) => r.is_flagged) && (
                      <Flag className="w-5 h-5 text-red-600" />
                    )}
                    {section.title}
                  </CardTitle>
                  {sectionScore && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Score:</span>
                      <span className="font-semibold">
                        {sectionScore.section_score}%
                      </span>
                      <Badge
                        className={getGradeColor(sectionScore.section_grade)}
                      >
                        {sectionScore.section_grade}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {section.questions.map((question) => {
                  const response = inspection.responses.find(
                    (r) => r.question_id === question.id
                  );

                  return (
                    <div
                      key={question.id}
                      className={`p-4 border rounded-lg ${
                        response?.is_flagged
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-gray-900">
                              {/* @ts-expect-error - this is a temporary fix to get the question text to display */}
                              {question.text}
                            </h4>
                            <Badge variant="secondary">
                              {/* @ts-expect-error - this is a temporary fix to get the field type to display */}
                              {question.field_type}
                            </Badge>
                          </div>
                          {question.description && (
                            <p className="text-sm text-gray-600 mt-1">
                              {question.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {response?.is_flagged && (
                            <Flag className="w-4 h-4 text-red-600" />
                          )}
                          {response ? (
                            response.points_earned ===
                            response.points_possible ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-600" />
                            )
                          ) : (
                            <XCircle className="w-4 h-4 text-gray-400" />
                          )}
                          <span className="text-sm text-gray-600">
                            {response?.points_earned || 0}/
                            {response?.points_possible || question.points} pts
                          </span>
                        </div>
                      </div>

                      {response && (
                        <div className="space-y-4 mt-4">
                          <div
                            className={`p-3 rounded ${
                              response.is_flagged
                                ? "bg-red-50 border border-red-200"
                                : "bg-gray-50"
                            }`}
                          >
                            <span
                              className={`text-sm font-medium ${
                                response.is_flagged
                                  ? "text-red-700"
                                  : "text-gray-700"
                              }`}
                            >
                              Response:
                            </span>
                            <div
                              className={`text-sm mt-1 ${
                                response.is_flagged
                                  ? "text-red-900"
                                  : "text-gray-900"
                              }`}
                            >
                              {getResponseDisplayValue(response, question)}
                            </div>
                          </div>

                          {response.inspector_notes && (
                            <div className="bg-blue-50 p-3 rounded">
                              <span className="text-sm font-medium text-blue-700">
                                Inspector Notes:
                              </span>
                              <p className="text-sm text-blue-900 mt-1">
                                {response.inspector_notes}
                              </p>
                            </div>
                          )}

                          {response.flag_reason && (
                            <div className="bg-red-100 border border-red-300 p-3 rounded">
                              <span className="text-sm font-semibold text-red-800 flex items-center gap-2">
                                <Flag className="w-4 h-4" />
                                Flag Reason:
                              </span>
                              <p className="text-sm text-red-900 mt-1 font-medium">
                                {response.flag_reason}
                              </p>
                            </div>
                          )}

                          {response.file_attachments &&
                            response.file_attachments.length > 0 && (
                              <div className="bg-gray-50 p-3 rounded">
                                <span className="text-sm font-medium text-gray-700">
                                  Attachments:
                                </span>
                                <div className="flex flex-col gap-2 mt-1">
                                  {response.file_attachments.map(
                                    (attachment, index) => (
                                      <a
                                        key={index}
                                        // @ts-expect-error - this is a temporary fix to get the attachment to display
                                        href={attachment?.file_path}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                                      >
                                        <FileText className="w-4 h-4" />
                                        {/* @ts-expect-error - this is a temporary fix to get the attachment to display */}
                                        <span>{attachment?.filename}</span>
                                      </a>
                                    )
                                  )}
                                </div>
                              </div>
                            )}

                          {response.action_id &&
                            (() => {
                              const action = actions.find(
                                (a) => a.id === response.action_id
                              );
                              if (!action) return null;
                              return (
                                <div className="bg-purple-50 p-3 rounded">
                                  <span className="text-sm font-medium text-purple-700">
                                    Linked Action:
                                  </span>
                                  <div className="text-sm text-purple-900 mt-1 space-y-1">
                                    <p>
                                      <strong>Title:</strong> {action.title}
                                    </p>
                                    <p>
                                      <strong>Status:</strong>{" "}
                                      <Badge variant="outline">
                                        {action.status}
                                      </Badge>
                                    </p>
                                    <p>
                                      <strong>Priority:</strong>{" "}
                                      <Badge variant="outline">
                                        {action.priority}
                                      </Badge>
                                    </p>
                                  </div>
                                </div>
                              );
                            })()}
                        </div>
                      )}

                      {/* Show "No response" for questions without responses */}
                      {!response && (
                        <div className="bg-gray-50 p-3 rounded">
                          <span className="text-sm font-medium text-gray-700">
                            Response:
                          </span>
                          <p className="text-sm text-gray-500 mt-1">
                            No response recorded
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
