'use server'

import { GET, PATCH } from '@/app/backend/apiMethods'
import { revalidateTag } from 'next/cache'

export async function getNotifications() {
  return await GET('/notifications', ['notifications'])
}

export async function markNotificationAsRead(id: string) {
  return await PATCH(`/notifications/${id}/status`, ['notifications'])
}

export async function markAllAsRead(ids: string[]) {
  for (const id of ids) {
    markNotificationAsRead(id)
    revalidateTag('notifications')
  }
}
