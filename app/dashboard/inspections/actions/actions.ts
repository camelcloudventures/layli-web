'use server'

import { GET, POST } from '@/app/backend/apiMethods'
import { Page } from '@/lib/types/audit-types'

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
  const res = await GET(`/inspections`)
  return res
}

export async function getInspection(inspectionId: string) {
  const res = await GET(`/inspections/${inspectionId}`)
  return res
}
