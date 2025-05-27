'use server'

import { GET } from '@/app/backend/apiMethods'
import type { SchedulesResponse } from '@/lib/types/schedule-types'

export async function getSchedules(
  page: number,
): Promise<SchedulesResponse | null> {
  return await GET<SchedulesResponse>(`/schedules/get?page=${page}`, [
    'schedules',
  ])
}
