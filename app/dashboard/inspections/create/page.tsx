import { CreateInspectionForm } from '../components/create-inspection-form'

export default function CreateInspectionPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Create Inspection</h1>
      </div>

      <CreateInspectionForm />
    </div>
  )
}
