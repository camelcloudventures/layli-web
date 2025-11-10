"use client";

import Link from "next/link";
import Image from "next/image";
import { FileText, MoreVertical, Copy, Edit, Trash2, Eye } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { AuditTemplate } from "@/lib/types/audit-types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import HasPermission from "@/app/dashboard/components/has-permission";
import { Permission } from "@/lib/auth/auth";

interface TemplateGridProps {
  templates: AuditTemplate[];
}

export function TemplateGrid({ templates }: TemplateGridProps) {
  console.log("templates", templates);
  const formatDate = (date: string) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  const countQuestionsInTemplate = (template: AuditTemplate): number => {
    return template.pages.reduce((pageTotal, page) => {
      return (
        pageTotal +
        page.sections.reduce((sectionTotal, section) => {
          return sectionTotal + section.questions.length;
        }, 0)
      );
    }, 0);
  };

  const deleteTemplate = (templateId: string) => {
    // Retrieve current templates
    const savedTemplates = localStorage.getItem("auditTemplates");
    if (!savedTemplates) return;

    try {
      const parsedTemplates = JSON.parse(savedTemplates);
      const updatedTemplates = parsedTemplates.filter(
        (template: AuditTemplate) => template.id !== templateId
      );
      localStorage.setItem("auditTemplates", JSON.stringify(updatedTemplates));

      // Reload page to reflect changes
      window.location.reload();
    } catch (e) {
      console.error("Error deleting template:", e);
    }
  };

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {templates.map((template) => (
        <Card key={template.id} className="flex flex-col overflow-hidden">
          <div className="relative h-48 w-full bg-muted">
            {template.photo ? (
              <Image
                src={template.photo || "/placeholder.svg"}
                alt={template.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <FileText className="h-16 w-16 text-muted-foreground" />
              </div>
            )}
          </div>
          <CardContent className="flex-1 p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{template.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {template.description}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/templates/${template.id}/preview`}>
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </Link>
                  </DropdownMenuItem>
                  <HasPermission permission={Permission.EDIT_TEMPLATES}>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/templates/${template.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                  </HasPermission>
                  <DropdownMenuItem>
                    <Copy className="mr-2 h-4 w-4" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600"
                    onSelect={() => deleteTemplate(template.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="secondary">
                {template.pages.length}{" "}
                {template.pages.length === 1 ? "Page" : "Pages"}
              </Badge>
              <Badge variant="secondary">
                {countQuestionsInTemplate(template)} Questions
              </Badge>
            </div>
          </CardContent>
          <CardFooter className="border-t bg-muted/50 p-3">
            <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
              <span>
                Created: {formatDate(template.created_at?.toString() || "")}
              </span>
              <Button asChild size="sm" variant="ghost">
                <Link href={`/dashboard/templates/${template.id}/preview`}>
                  Preview
                </Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
