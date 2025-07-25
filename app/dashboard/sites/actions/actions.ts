import { GET } from '@/app/backend/apiMethods'
import { revalidatePath } from 'next/cache'

export async function getSites() {
  return await GET('/sites', ['sites'])
}

export async function createSite(formData: FormData) {
  console.log('formData', formData)
  revalidatePath('/dashboard/sites')
}
