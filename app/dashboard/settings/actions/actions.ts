'use server'

import { GET, POST } from '@/app/backend/apiMethods'
import { revalidateTag } from 'next/cache'
export async function inviteUser(
  formData: FormData,
  userId: string,
  role: string,
) {
  const email = formData.get('email')

  const data = {
    email,
    user: userId,
    role,
  }

  const res = await POST('/invites/create', data)
  revalidateTag('invites')
  return res
}

export async function getInvites(userId: string) {
  return await GET(`/invites/${userId}`, ['invites'])
}
