import { getInspection } from '../../actions/actions'
import { DoInspectionForm } from './components/do-inspection-form'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function EditInspectionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const result = await getInspection(id)

  if (!result) {
    notFound()
  }

  //@ts-expect-error - result is not typed
  return <DoInspectionForm inspection={result.data} />
}
