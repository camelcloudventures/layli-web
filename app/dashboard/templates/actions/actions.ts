'use server'

import { DELETE, GET, POST, UPDATE } from '@/app/backend/apiMethods'
import type { AuditTemplate, TemplatesResponse } from '@/lib/types/audit-types'

export type AuditTemplateApiResponse =
  | AuditTemplate
  | { data: AuditTemplate }
  | null

export async function getTemplates(
  page: number = 1,
): Promise<TemplatesResponse | null> {
  return await GET<TemplatesResponse>(`/audit-template/get?page=${page}`, [
    'templates',
  ])
}

export async function getTemplate(
  id: string,
): Promise<AuditTemplateApiResponse> {
  return await GET<AuditTemplateApiResponse>(`/audit-template/get/${id}`, [
    'templates',
  ])
}

export async function createTemplate(formData: FormData, createdBy: string) {
  try {
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const photo = formData.get('photo') as string
    const pages = JSON.parse(formData.get('pages') as string)

    const templateData = {
      title,
      description,
      photo,
      pages,
      createdBy,
    }

    console.log('templateData', templateData)

    const res = await POST('/audit-template/create', templateData, true, [
      'templates',
    ])

    console.log('res', res)

    return res
  } catch (error) {
    console.error('Error creating template:', error)
    return { error: 'Failed to create template' }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateTemplate(template: any) {
  return await UPDATE(`/audit-template/update/${template.id}`, template, [
    'templates',
  ])
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function deleteTemplate(template: any) {
  return await DELETE('/audit-template/delete', template, ['templates'])
}
