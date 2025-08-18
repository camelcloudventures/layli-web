import { TemplatesClient } from "./templates-client";

interface PageProps {
  searchParams: Promise<{ search?: string; page?: string }>;
}

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AuditTemplatesPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  return <TemplatesClient resolvedParams={resolvedParams} />;
}
