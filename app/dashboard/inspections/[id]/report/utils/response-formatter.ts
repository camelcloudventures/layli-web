import { InspectionResponse } from "../types/inspection-types";

interface Question {
  id: number;
  title?: string;
  text?: string;
  field_type: string;
  description?: string;
  response_options?: Array<{
    id: number;
    label: string;
  }>;
}

export interface FormattedResponse {
  displayValue: string;
  imageUrl?: string;
  isImage: boolean;
}

/**
 * Formats response values for display in PDF based on field type
 */
export function formatResponseValue(
  response: InspectionResponse,
  question: Question
): FormattedResponse {
  // Handle Signature
  if (question.field_type === "SIGNATURE" && response.response_value) {
    return {
      displayValue: "Signature",
      imageUrl: response.response_value,
      isImage: true,
    };
  }

  // Handle Photo - check both file_attachments and response_value
  if (question.field_type === "PHOTO") {
    // First check if there are file attachments
    if (response.file_attachments && response.file_attachments.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const photo = response.file_attachments[0] as any;
      return {
        displayValue: photo?.filename || "Photo",
        imageUrl: photo?.file_path,
        isImage: true,
      };
    }
    // If no file attachments, check if response_value is a URL
    if (response.response_value && response.response_value.startsWith("http")) {
      return {
        displayValue: "Photo",
        imageUrl: response.response_value,
        isImage: true,
      };
    }
    return {
      displayValue: "No photo uploaded",
      isImage: false,
    };
  }

  // Handle BOOLEAN questions
  if (question.field_type === "BOOLEAN") {
    if (response.response_value === "true" || response.response_value === "1") {
      return { displayValue: "Yes", isImage: false };
    }
    if (
      response.response_value === "false" ||
      response.response_value === "0"
    ) {
      return { displayValue: "No", isImage: false };
    }
    return { displayValue: "No response", isImage: false };
  }

  // Handle NUMBER questions
  if (question.field_type === "NUMBER") {
    if (
      response.numeric_value !== null &&
      response.numeric_value !== undefined
    ) {
      return {
        displayValue: response.numeric_value.toString(),
        isImage: false,
      };
    }
    if (response.response_value) {
      return { displayValue: response.response_value, isImage: false };
    }
    return { displayValue: "No response", isImage: false };
  }

  // Handle DATE questions
  if (question.field_type === "DATE") {
    if (response.response_value) {
      try {
        return {
          displayValue: new Date(response.response_value).toLocaleDateString(),
          isImage: false,
        };
      } catch {
        return { displayValue: response.response_value, isImage: false };
      }
    }
    return { displayValue: "No response", isImage: false };
  }

  // Handle SELECT questions
  if (question.field_type === "SELECT") {
    // First check if response_value contains a valid option label
    if (response.response_value && question.response_options) {
      const matchingOption = question.response_options.find(
        (option) => option.label === response.response_value
      );
      if (matchingOption) {
        return { displayValue: response.response_value, isImage: false };
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
          const option = question.response_options?.find(
            (o) => o.id === numericId
          );
          return option ? option.label : null;
        })
        .filter(Boolean)
        .join(", ");
      return {
        displayValue: selectedLabels || "No response",
        isImage: false,
      };
    }
    // Final fallback to response_value
    if (response.response_value) {
      return { displayValue: response.response_value, isImage: false };
    }
    return { displayValue: "No response", isImage: false };
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
        question.response_options?.some((option) => option.label === value)
      );
      if (validLabels.length > 0) {
        return { displayValue: validLabels.join(", "), isImage: false };
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
          const option = question.response_options?.find(
            (o) => o.id === numericId
          );
          return option ? option.label : null;
        })
        .filter(Boolean)
        .join(", ");
      return {
        displayValue: selectedLabels || "No response",
        isImage: false,
      };
    }
    // Final fallback to response_value
    if (response.response_value) {
      return { displayValue: response.response_value, isImage: false };
    }
    return { displayValue: "No response", isImage: false };
  }

  // Handle CHECKBOX questions (similar to MULTI_SELECT)
  if (question.field_type === "CHECKBOX") {
    // First check if response_value contains comma-separated labels
    if (response.response_value && question.response_options) {
      // Split by comma and check if each part matches an option label
      const responseValues = response.response_value
        .split(",")
        .map((v) => v.trim());
      const validLabels = responseValues.filter((value) =>
        question.response_options?.some((option) => option.label === value)
      );
      if (validLabels.length > 0) {
        return { displayValue: validLabels.join(", "), isImage: false };
      }
    }
    // Fallback: check if we have selected_options with IDs
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
          const option = question.response_options?.find(
            (o) => o.id === numericId
          );
          return option ? option.label : null;
        })
        .filter(Boolean)
        .join(", ");
      return {
        displayValue: selectedLabels || "No response",
        isImage: false,
      };
    }
    // Final fallback to response_value
    if (response.response_value) {
      return { displayValue: response.response_value, isImage: false };
    }
    return { displayValue: "No response", isImage: false };
  }

  // Handle TEXT questions
  if (question.field_type === "TEXT") {
    if (response.text_value) {
      return { displayValue: response.text_value, isImage: false };
    }
    if (response.response_value) {
      return { displayValue: response.response_value, isImage: false };
    }
    return { displayValue: "No response", isImage: false };
  }

  // Handle LOCATION questions
  if (question.field_type === "LOCATION") {
    if (response.location_data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const location = response.location_data as any;
      if (location?.address) {
        return { displayValue: location.address, isImage: false };
      }
      if (location?.latitude && location?.longitude) {
        return {
          displayValue: `Lat: ${location.latitude}, Lng: ${location.longitude}`,
          isImage: false,
        };
      }
    }
    return { displayValue: "No location recorded", isImage: false };
  }

  // Handle SLIDER questions
  if (question.field_type === "SLIDER") {
    if (
      response.numeric_value !== null &&
      response.numeric_value !== undefined
    ) {
      return {
        displayValue: response.numeric_value.toString(),
        isImage: false,
      };
    }
    if (response.response_value) {
      return { displayValue: response.response_value, isImage: false };
    }
    return { displayValue: "No response", isImage: false };
  }

  // Fallback for other field types
  if (response.text_value) {
    return { displayValue: response.text_value, isImage: false };
  }
  if (response.numeric_value !== null && response.numeric_value !== undefined) {
    return { displayValue: response.numeric_value.toString(), isImage: false };
  }
  if (response.response_value) {
    // Only try to parse as date if it looks like a date string
    if (response.response_value.match(/^\d{4}-\d{2}-\d{2}/)) {
      try {
        return {
          displayValue: new Date(response.response_value).toLocaleDateString(),
          isImage: false,
        };
      } catch {
        return { displayValue: response.response_value, isImage: false };
      }
    }
    return { displayValue: response.response_value, isImage: false };
  }
  if (response.selected_options && response.selected_options.length > 0) {
    return {
      displayValue: response.selected_options.join(", "),
      isImage: false,
    };
  }
  return { displayValue: "No response", isImage: false };
}

/**
 * Determines badge color based on response value and points
 */
export function getBadgeColor(
  response: InspectionResponse
): "red" | "green" | "gray" {
  // Flagged items are always red
  if (response.is_flagged) {
    return "red";
  }

  // Check points
  if (response.points_earned !== null && response.points_possible !== null) {
    if (response.points_earned < response.points_possible) {
      return "red";
    }
    if (response.points_earned === response.points_possible) {
      return "green";
    }
  }

  // Check response value for common patterns
  const value = response.response_value?.toLowerCase();
  if (
    value === "yes" ||
    value === "good" ||
    value === "excellent" ||
    value === "pass" ||
    value === "passed"
  ) {
    return "green";
  }
  if (
    value === "no" ||
    value === "poor" ||
    value === "fail" ||
    value === "failed"
  ) {
    return "red";
  }

  // Default to gray for neutral responses
  return "gray";
}

/**
 * Formats a date string to readable format
 */
export function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
}

/**
 * Formats a date string to short format
 */
export function formatDateShort(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}
