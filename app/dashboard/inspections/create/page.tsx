import { CreateInspectionForm } from './components/create-inspection-form'
import { getSites } from '@/app/dashboard/schedules/actions/actions'

export default async function CreateInspectionPage() {
  const sites = await getSites()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Create Inspection</h1>
      </div>

      <CreateInspectionForm sites={sites} />
    </div>
  )
}
