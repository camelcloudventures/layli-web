'use server'

import { DELETE, GET, POST, UPDATE } from '@/app/backend/apiMethods'
import { revalidatePath } from 'next/cache'
import type { AuditTemplate, TemplatesResponse } from '@/lib/types/audit-types'

export type AuditTemplateApiResponse =
  | AuditTemplate
  | { data: AuditTemplate }
  | null

export async function getTemplates(
  page: number,
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

    const res = await POST('/audit-template/create', templateData, true, [
      'templates',
    ])

    // Revalidate the templates path
    revalidatePath('/dashboard/templates')

    return res
  } catch (error) {
    console.error('Error creating template:', error)
    return { error: 'Failed to create template' }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateTemplate(template: any) {
  const res = await UPDATE(`/audit-template/update/${template.id}`, template, [
    'templates',
  ])

  // Revalidate the template path
  revalidatePath(`/dashboard/templates/preview/${template.id}`)
  revalidatePath('/dashboard/templates')

  return res
}

export async function deleteTemplate(templateId: string) {
  const res = await DELETE(`/audit-template/delete/${templateId}`, {}, [
    'templates',
  ])

  // Revalidate the templates path
  revalidatePath('/dashboard/templates')

  return res
}

export async function deletePage(pageId: string, templateId: string) {
  const res = await DELETE(
    `/audit-template/delete/page/${pageId}/${templateId}`,
    {},
    ['templates'],
  )

  // Revalidate the template path
  revalidatePath(`/dashboard/templates/preview/${templateId}`)

  return res
}

export async function deleteSection(sectionId: string, pageId: string) {
  const res = await DELETE(
    `/audit-template/delete/section/${sectionId}/${pageId}`,
    {},
    ['templates'],
  )

  // Revalidate all template paths since we don't know the template ID here
  revalidatePath('/dashboard/templates', 'layout')

  return res
}

export async function deleteQuestion(questionId: string, sectionId: string) {
  const res = await DELETE(
    `/audit-template/delete/question/${questionId}/${sectionId}`,
    {},
    ['templates'],
  )

  // Revalidate all template paths since we don't know the template ID here
  revalidatePath('/dashboard/templates', 'layout')

  return res
}
