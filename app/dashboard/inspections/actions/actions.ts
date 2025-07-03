'use server'

import { GET, POST } from '@/app/backend/apiMethods'

export async function createInspection(
  formData: FormData,
  assignedTo: string[],
  locationId: string,
  preparedBy: string,
) {
  const inspectionName = formData.get('inspection-name')

  const scheduledDate = formData.get('scheduled-date')

  // Parse pages from formData
  const pages = JSON.parse(formData.get('pages') as string)
  // ...after you build updatePages as before

  console.log('Sections:', pages[0].sections)

  // If you want to see the full nested structure (including questions/options):
  console.log('Sections (full):', JSON.stringify(pages[0].sections, null, 2))
  const inspections = {
    title: inspectionName,
    location: locationId,
    assignee_ids: assignedTo,
    prepared_by: preparedBy,
    due_date: scheduledDate,
    pages,
  }

  console.log('inspections', inspections)

  const res = await POST(`/inspections/create`, inspections)
  console.log('res', res)
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
