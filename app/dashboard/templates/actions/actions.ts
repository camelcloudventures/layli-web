'use server'

import { GET, POST } from '@/app/backend/apiMethods'
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

export async function createTemplate(formData: FormData) {
  try {
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const photo = formData.get('photo') as string
    const pages = JSON.parse(formData.get('pages') as string)
    const id = formData.get('id') as string

    const templateData = {
      id,
      title,
      description,
      photo,
      pages,
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

// export async function updateTemplate(template: Template) {
//   return await UPDATE('/templates', template, ['templates'])
// }

// export async function deleteTemplate(template: Template) {
//   return await DELETE('/templates', template, ['templates'])
// }
