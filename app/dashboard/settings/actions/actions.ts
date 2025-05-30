'use server'

import { GET, POST, UPDATE } from '@/app/backend/apiMethods'
import { revalidateTag } from 'next/cache'
export async function inviteUser(
  formData: FormData,
  userId: string,
  role: string,
  orgId: string,
) {
  const email = formData.get('email')

  const data = {
    email,
    user: userId,
    role,
  }
  console.log('orgId', orgId)

  console.log('data', data)
  const res = await POST(`/organizations/invite-member/${orgId}`, data)
  revalidateTag('invites')
  return res
}

export async function getInvites(userId: string) {
  return await GET(`/invites/${userId}`, ['invites'])
}

export async function updateUserRole(userId: string, role: string) {
  const res = await UPDATE(`/invites/update/${userId}`, { role })
  revalidateTag('invites')
  return res
}
