"use client";

import { Flag, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import Image from "next/image";

export interface FlaggedItemData {
  id: string;
  question_id: number;
  question_text: string;
  question_field_type?: string;
  response_value?: string;
  text_value?: string | null;
  numeric_value?: number | null;
  flag_reason?: string;
  inspector_notes?: string;
  points_earned: number;
  points_possible: number;
  created_at: string;
  // Inspection context
  inspection_id: string;
  inspection_title: string;
  template_name: string;
  site_name?: string;
  section_name?: string;
  inspector_name?: string;
}

interface FlaggedItemCardProps {
  item: FlaggedItemData;
  showInspectionLink?: boolean;
  compact?: boolean;
  onClick?: () => void;
}

export function FlaggedItemCard({
  item,
  showInspectionLink = true,
  compact = false,
  onClick,
}: FlaggedItemCardProps) {
  // Helper function to detect if response is an image
  const isImageResponse = (): boolean => {
    if (!item.response_value) return false;

    // Check if response_value is a base64 data URL
    if (item.response_value.startsWith("data:image")) {
      return true;
    }

    // Check if response_value is an HTTP/HTTPS URL
    if (
      item.response_value.startsWith("http://") ||
      item.response_value.startsWith("https://")
    ) {
      return true;
    }

    // Check if question field type is PHOTO or SIGNATURE
    if (
      item.question_field_type === "PHOTO" ||
      item.question_field_type === "SIGNATURE"
    ) {
      return true;
    }

    return false;
  };

  const formatResponseValue = (): string | React.ReactNode => {
    // Check for image responses first
    if (isImageResponse() && item.response_value) {
      const imageSrc = item.response_value;
      const isSignature = item.question_field_type === "SIGNATURE";

      return (
        <a
          href={imageSrc}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-block"
        >
          <Image
            src={imageSrc}
            alt={isSignature ? "Signature" : "Uploaded photo"}
            width={isSignature ? 200 : 300}
            height={isSignature ? 100 : 200}
            className="rounded-md border bg-white object-cover"
            unoptimized={imageSrc.startsWith("data:")}
          />
        </a>
      );
    }

    // Handle non-image responses
    if (item.text_value) return item.text_value;
    if (item.numeric_value !== null && item.numeric_value !== undefined) {
      return item.numeric_value.toString();
    }
    if (item.response_value) return item.response_value;
    return "No response";
  };

  if (compact) {
    return (
      <div
        className={`p-4 border rounded-lg border-red-300 bg-red-50 cursor-pointer hover:bg-red-100 transition-colors ${
          onClick ? "" : ""
        }`}
        onClick={onClick}
      >
        <div className="space-y-3">
          {/* Question */}
          <div className="flex items-start gap-2">
            <Flag className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 mb-1">
                Question:
              </p>
              <p className="text-sm text-gray-800">{item.question_text}</p>
            </div>
          </div>

          {/* Response */}
          <div className="bg-white p-2 rounded border border-red-200">
            <p className="text-xs font-semibold text-gray-700 mb-1">
              Response:
            </p>
            <div className="text-sm text-gray-900 font-medium">
              {formatResponseValue()}
            </div>
          </div>

          {/* Flag Reason */}
          {item.flag_reason && (
            <div className="bg-red-100 p-2 rounded border border-red-300">
              <p className="text-xs font-semibold text-red-800 mb-1">
                Why Flagged:
              </p>
              <p className="text-sm text-red-900">{item.flag_reason}</p>
            </div>
          )}

          {/* Context */}
          <div className="flex items-center gap-2 text-xs text-gray-600 pt-2 border-t border-red-200">
            <span>{item.template_name}</span>
            {item.site_name && <span>• {item.site_name}</span>}
            {item.section_name && <span>• {item.section_name}</span>}
          </div>

          {/* Action Button */}
          {showInspectionLink && (
            <div className="flex justify-end pt-1">
              <Button
                variant="ghost"
                size="sm"
                className="flex-shrink-0"
                asChild
                onClick={(e) => e.stopPropagation()}
              >
                <Link href={`/dashboard/inspections/${item.inspection_id}`}>
                  <ExternalLink className="w-4 h-4 mr-1" />
                  View Inspection
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-5 border rounded-lg border-red-300 bg-red-50 ${
        onClick ? "cursor-pointer hover:bg-red-100 transition-colors" : ""
      }`}
      onClick={onClick}
    >
      <div className="space-y-4">
        {/* Header with Question */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Flag className="w-5 h-5 text-red-600" />
              <h3 className="text-base font-semibold text-gray-900">
                Question
              </h3>
              {item.question_field_type && (
                <Badge variant="secondary" className="text-xs">
                  {item.question_field_type}
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-800 leading-relaxed pl-7">
              {item.question_text}
            </p>
          </div>
          {showInspectionLink && (
            <Button
              variant="ghost"
              size="sm"
              asChild
              onClick={(e) => e.stopPropagation()}
            >
              <Link href={`/dashboard/inspections/${item.inspection_id}`}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Inspection
              </Link>
            </Button>
          )}
        </div>

        {/* Response Value - Prominently Displayed */}
        <div className="bg-white p-3 rounded-lg border-2 border-red-200 shadow-sm">
          <p className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
            Response
          </p>
          <div className="text-base text-gray-900 font-medium break-words">
            {formatResponseValue()}
          </div>
        </div>

        {/* Flag Reason - Detailed Explanation */}
        {item.flag_reason && (
          <div className="bg-red-100 p-3 rounded-lg border-2 border-red-300">
            <p className="text-xs font-semibold text-red-800 mb-2 uppercase tracking-wide flex items-center gap-2">
              <Flag className="w-3 h-3" />
              Why This Was Flagged
            </p>
            <p className="text-sm text-red-900 leading-relaxed">
              {item.flag_reason}
            </p>
          </div>
        )}

        {/* Inspector Notes */}
        {item.inspector_notes && (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-xs font-semibold text-blue-700 mb-2 uppercase tracking-wide">
              Inspector Notes
            </p>
            <p className="text-sm text-blue-900 leading-relaxed">
              {item.inspector_notes}
            </p>
          </div>
        )}

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 pt-3 border-t border-red-200">
          <div>
            <span className="font-semibold text-gray-700">Template:</span>
            <p className="text-gray-800 mt-0.5">{item.template_name}</p>
          </div>
          {item.site_name && (
            <div>
              <span className="font-semibold text-gray-700">Site:</span>
              <p className="text-gray-800 mt-0.5">{item.site_name}</p>
            </div>
          )}
          {item.section_name && (
            <div>
              <span className="font-semibold text-gray-700">Section:</span>
              <p className="text-gray-800 mt-0.5">{item.section_name}</p>
            </div>
          )}
          {item.inspector_name && (
            <div>
              <span className="font-semibold text-gray-700">Inspector:</span>
              <p className="text-gray-800 mt-0.5">{item.inspector_name}</p>
            </div>
          )}
          <div>
            <span className="font-semibold text-gray-700">Created:</span>
            <p className="text-gray-800 mt-0.5">
              {format(new Date(item.created_at), "MMM d, yyyy")}
            </p>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Score:</span>
            <p className="text-gray-800 mt-0.5">
              {item.points_earned}/{item.points_possible} pts
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
