'use server'

import { DELETE, GET, POST, UPDATE } from '@/app/backend/apiMethods'
import { revalidatePath, revalidateTag } from 'next/cache'
import type { AuditTemplate, TemplatesResponse } from '@/lib/types/audit-types'
import { uploadImage } from '@/utils/common'

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
  return await GET<AuditTemplateApiResponse>(`/audit-template/get/${id}`)
}

export async function createTemplate(formData: FormData, createdBy: string) {
  try {
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const photo = formData.get('photo') as string
    const pages = JSON.parse(formData.get('pages') as string)

    // If there's a photo, upload it to the template-images bucket
    let photoUrl = photo
    if (photo && photo.startsWith('data:')) {
      const file = dataURLtoFile(photo, 'template-cover.jpg')
      const { fileUrl, error } = await uploadImage({ file }, 'template-images')
      if (error || !fileUrl) {
        console.error('Error uploading image:', error)
        return { error: 'Failed to upload template image' }
      }
      photoUrl = fileUrl
    }

    const templateData = {
      title,
      description,
      photo: photoUrl,
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
    console.log('error from createTemplate', error)
    return { error: 'Failed to create template' }
  }
}

// Helper function to convert data URL to File object
function dataURLtoFile(dataurl: string, filename: string): File {
  const arr = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)?.[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateTemplate(template: any) {
  try {
    // If there's a photo and it's a data URL, upload it to the template-images bucket
    let photoUrl = template.photo
    console.log('template.photo', template.photo)
    if (template.photo && template.photo.startsWith('data:')) {
      const file = dataURLtoFile(template.photo, 'template-cover.jpg')
      const { fileUrl, error } = await uploadImage({ file }, 'template-images')
      if (error || !fileUrl) {
        console.error('Error uploading image:', error)
        return { error: 'Failed to upload template image' }
      }
      photoUrl = fileUrl
    }

    console.log('photoUrl', photoUrl)

    const templateData = {
      ...template,
      photo: photoUrl,
    }

    const res = await UPDATE(
      `/audit-template/update/${template.id}`,
      templateData,
      ['templates'],
    )

    revalidatePath(`/dashboard/templates/${template.id}/edit`)
    revalidateTag('templates')

    return res
  } catch (error) {
    console.error('Error updating template:', error)
    return { error: 'Failed to update template' }
  }
}

export async function deleteTemplate(templateId: string) {
  const res = await DELETE(`/audit-template/delete/${templateId}`, {}, [
    'templates',
  ])

  revalidatePath(`/dashboard/templates/${templateId}/preview`)
  return res
}

export async function deletePage(pageId: string, templateId: string) {
  console.log('deleting page', pageId, templateId)
  const res = await DELETE(
    `/audit-template/delete/page/${pageId}/${templateId}`,
    {},
    ['templates'],
  )

  // Revalidate the template path
  revalidatePath(`/dashboard/templates/${templateId}/preview`)

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
