'use server'

import { GET, PATCH } from '@/app/backend/apiMethods'

export async function getNotifications() {
  return await GET('/notifications', ['notifications'])
}

export async function markNotificationAsRead(id: string) {
  return await PATCH(`/notifications/${id}/status`, { is_read: true }, [
    'notifications',
  ])
}

export async function markAllAsRead(ids: string[]) {
  for (const id of ids) {
    const res = await markNotificationAsRead(id)
    console.log('res', res)
  }
}
