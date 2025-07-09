import { CreateInspectionForm } from './components/create-inspection-form'
import {
  getActiveUsers,
  getSites,
} from '@/app/dashboard/schedules/actions/actions'
import { getTemplates } from '@/app/dashboard/templates/actions/actions'

export const dynamic = 'force-dynamic'

export default async function CreateInspectionPage() {
  const sites = await getSites()
  const users = await getActiveUsers()
  const templates = await getTemplates(1)

  return (
    <div className="container mx-auto py-6">
      <CreateInspectionForm
        sites={sites}
        //@ts-expect-error - users is not typed
        users={users?.data || []}
        templates={templates?.data || []}
      />
    </div>
  )
}
