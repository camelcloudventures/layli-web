"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { AuditTemplate } from "@/lib/types/audit-types";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { AuditTemplatesSkeleton } from "./audit-template-loading-skeleton";

interface TemplateSearchProps {
  templates: AuditTemplate[];
  searchParams: { search?: string };
  page: number;

  isLoading: boolean;
}

export function TemplateSearch({
  templates,
  searchParams,

  isLoading,
}: TemplateSearchProps) {
  const searchQuery = searchParams.search || "";

  const filteredTemplates = templates.filter(
    (template) =>
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <form>
            <Input
              placeholder="Search templates..."
              className="pl-8"
              name="search"
              defaultValue={searchQuery}
            />
          </form>
        </div>
      </div>
      {isLoading ? (
        <AuditTemplatesSkeleton />
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm"
              >
                <div className="relative h-48 w-full bg-muted">
                  {template.photo ? (
                    <Image
                      src={template?.photo}
                      width={600}
                      height={192}
                      style={{
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                      alt={template.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Search className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 p-4">
                  <div>
                    <h3 className="font-semibold">{template.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {template.description}
                    </p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                      {template?.pages?.length}{" "}
                      {template?.pages?.length === 1 ? "Page" : "Pages"}
                    </span>
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                      {template?.pages?.reduce(
                        (total, page) =>
                          total +
                          page.sections.reduce(
                            (sectionTotal, section) =>
                              sectionTotal + section.questions.length,
                            0
                          ),
                        0
                      )}{" "}
                      Questions
                    </span>
                  </div>
                </div>
                <div className="border-t bg-muted/50 p-3">
                  <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
                    <span>
                      Created: {formatDate(template.created_at || new Date())}
                    </span>
                    <Link
                      href={`/dashboard/templates/${template.id}/preview`}
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-3"
                    >
                      Preview
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* <Pagination page={page} totalPages={totalPages} /> */}
        </>
      )}
    </div>
  );
}
