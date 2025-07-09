'use server'

import { GET, POST, PUT } from '@/app/backend/apiMethods'
import { Page } from '@/lib/types/audit-types'
import { Response } from '@/lib/types/inspection-types'
import {
  revalidatePath,
  revalidateTag,
} from 'next/dist/server/web/spec-extension/revalidate'

export async function createInspection(data: {
  title: string
  description: string
  assignee_ids: string[]
  site_id: string
  prepared_by: string
  due_date: FormDataEntryValue | null
  template_id?: number
  pages?: Omit<Page, 'id' | 'template_id'>[]
}) {
  console.log('Creating inspection with data:', data)
  const res = await POST(`/inspections/create`, data)
  console.log('Create inspection response:', res)
  return res
}

export async function getAllInspections() {
  const res = await GET(`/inspections`, ['inspections'])
  return res
}

export async function getInspection(inspectionId: string) {
  const res = await GET(`/inspections/${inspectionId}/get`)
  console.log('getInspection response:', res)
  return res
}

export async function saveResponse(
  inspection_id: string,
  question_id: string,
  response: Response,
) {
  console.log('saveResponse question_id:', question_id)
  console.log('saveResponse inspection_id:', inspection_id)
  console.log('response going  to the backend', response)
  console.log('location data', response.location_data)
  console.log('response value', response.response_value)

  if (response.location_data) {
    console.log('!!!!!!--------------------location data is not null')
    console.log('location data', response.location_data)
    console.log('response value', response.response_value)
  }

  // Format the response data to match API expectations
  const formattedResponse = {
    selected_options: response.selected_options || [],
    response_value: response.response_value,
    inspector_notes: response.inspector_notes || '',
    file_attachments: response.file_attachments || [],
    ...(response?.location_data && { location_data: response.location_data }),
  }

  console.log('formattedResponse', formattedResponse)

  const res = await POST(
    `/inspections/${inspection_id}/responses/${question_id}`,
    formattedResponse,
  )
  console.log('saveResponse response:', res)
  revalidatePath(`/dashboard/inspections/${inspection_id}/edit`)
  return res
}

export async function completeInspection(inspection_id: string) {
  const res = await POST(`/inspections/${inspection_id}/complete`, {})
  console.log('completed res', res)
  revalidatePath(`/dashboard/inspections/${inspection_id}`)
  return res
}

export async function updateResponse(
  inspection_id: string,
  question_id: string,
  response: Response,
) {
  const res = await PUT(
    `/inspections/${inspection_id}/responses/${question_id}`,
    response,
  )
  revalidatePath(`/dashboard/inspections/${inspection_id}/edit`)
  return res
}

export async function pauseInspection(inspection_id: string) {
  const res = await POST(`/inspections/${inspection_id}/pause`, {})
  revalidateTag('inspections')
  return res
}
