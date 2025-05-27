'use server'

import { DELETE, GET, POST, UPDATE } from '@/app/backend/apiMethods'
import type { SchedulesResponse } from '@/lib/types/schedule-types'
import { revalidateTag } from 'next/cache'
import { createClient } from '@supabase/supabase-js'

export async function getSchedules(
  page: number,
): Promise<SchedulesResponse | null> {
  return await GET<SchedulesResponse>(`/schedules/get?page=${page}`, [
    'schedules',
  ])
}

export async function createSchedule(formData: FormData) {
  const title = formData.get('title') as string
  const template_id = formData.get('template_id') as string
  const site_id = formData.get('site_id') as string
  const assignee_id = formData.get('assignee_id') as string
  const frequency = formData.get('frequency') as string
  const priority = formData.get('priority') as string

  const scheduleData = {
    title,
    template_id,
    site_id,
    assignee_id,
    frequency,
    priority,
  }

  const res = await POST('/schedules/create', scheduleData, true, ['schedules'])

  revalidateTag('schedules')

  return res
}

export async function getActiveUsers(adminId: string) {
  return await GET(`/invites/active-users/${adminId}`, ['users'])
}

export async function getTemplates() {
  // Replace with your actual API endpoint or DB query for templates
  return await GET('/audit-template/get', ['templates'])
}

export async function getSites() {
  const client = await createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
  const { data, error } = await client.from('sites').select('*')
  if (error) throw error
  return data || []
}

export async function updateSchedule(formData: FormData) {
  try {
    const id = formData.get('id') as string
    const title = formData.get('title') as string
    const template_id = formData.get('template_id') as string
    const site_id = formData.get('site_id') as string
    const assignee_id = formData.get('assignee_id') as string
    const frequency = formData.get('frequency') as string
    const priority = formData.get('priority') as string

    const scheduleData = {
      title,
      template_id,
      site_id,
      assignee_id,
      frequency,
      priority,
    }

    const res = await UPDATE(`/schedules/update/${id}`, scheduleData, [
      'schedules',
    ])
    revalidateTag('schedules')
    return res
  } catch (error) {
    console.error('Error updating schedule:', error)
    return { error: 'Failed to update schedule' }
  }
}

export async function deleteSchedule(id: string) {
  const res = await DELETE(`/schedules/delete/${id}`, true, ['schedules'])
  revalidateTag('schedules')
  return res
}
