'use server'

import { GET } from '@/app/backend/apiMethods'
import { Action } from '@/lib/types'
import { revalidatePath } from 'next/cache'

export async function getActions(): Promise<{ data: Action[] } | null> {
  const result = await GET('/actions', ['actions'])
  return result as { data: Action[] } | null
}

export async function createAction(formData: FormData) {
  console.log('formData', formData)
  revalidatePath('/dashboard/actions')
}

export async function updateAction(formData: FormData) {
  console.log('formData', formData)
  revalidatePath('/dashboard/actions')
}

export async function deleteAction(id: string) {
  console.log('id', id)
  revalidatePath('/dashboard/actions')
}
