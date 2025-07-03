import { CreateInspectionForm } from './components/create-inspection-form'
import {
  getActiveUsers,
  getSites,
} from '@/app/dashboard/schedules/actions/actions'
import { getTemplates } from '@/app/dashboard/templates/actions/actions'

export default async function CreateInspectionPage() {
  const sites = await getSites()
  const users = await getActiveUsers()
  const templates = await getTemplates(1)

  return (
    <div className="container mx-auto py-6">
      <CreateInspectionForm
        sites={sites}
        users={users.data}
        templates={templates?.data || []}
      />
    </div>
  )
}
