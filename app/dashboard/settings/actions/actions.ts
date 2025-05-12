'use server'

import { GET, POST } from '@/app/backend/apiMethods'

export async function inviteUser(
  formData: FormData,
  userId: string,
  role: string,
) {
  console.log('userId', userId)
  console.log('called')
  const email = formData.get('email')

  const data = {
    email,
    user: userId,
    role,
  }

  const res = await POST('/invites/create', data)
  return res
}

export async function getInvites(userId: string) {
  const res = await GET(`/invites/${userId}`)
  return res
}
