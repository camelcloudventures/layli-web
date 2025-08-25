"use client";

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
