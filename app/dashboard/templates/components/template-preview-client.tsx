"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TemplatePreviewContent } from "./template-preview-content";
import type { AuditTemplate } from "@/lib/types/audit-types";

interface TemplatePreviewClientProps {
  template: AuditTemplate;
}

export function TemplatePreviewClient({
  template,
}: TemplatePreviewClientProps) {
  return <TemplatePreviewContent template={template} />;
}
