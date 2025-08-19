import { TemplatesClient } from "./templates-client";

interface PageProps {
  searchParams: Promise<{ search?: string; page?: string }>;
}

export default async function AuditTemplatesPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  return <TemplatesClient resolvedParams={resolvedParams} />;
}
