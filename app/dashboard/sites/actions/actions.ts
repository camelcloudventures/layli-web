import { GET } from '@/app/backend/apiMethods'
import { Site } from '@/lib/types'

export async function getSites() {
  return await GET('/sites', ['sites'])
}

export async function createSite(formData: FormData) {
  console.log('formData', formData)
  revalidatePath('/dashboard/sites')
}
