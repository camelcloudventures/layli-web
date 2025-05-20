'use server'

import { GET } from '@/app/backend/apiMethods'
import type { AuditTemplate, TemplatesResponse } from '@/lib/types/audit-types'

export type AuditTemplateApiResponse =
  | AuditTemplate
  | { data: AuditTemplate }
  | null

export async function getTemplates(): Promise<TemplatesResponse | null> {
  return await GET<TemplatesResponse>('/audit-template/get', ['templates'])
}

export async function getTemplate(
  id: string,
): Promise<AuditTemplateApiResponse> {
  return await GET<AuditTemplateApiResponse>(`/audit-template/get/${id}`, [
    'templates',
  ])
}

// export async function createTemplate(template: Template) {
//   return await POST('/templates', template, ['templates'])
// }

// export async function updateTemplate(template: Template) {
//   return await UPDATE('/templates', template, ['templates'])
// }

// export async function deleteTemplate(template: Template) {
//   return await DELETE('/templates', template, ['templates'])
// }
