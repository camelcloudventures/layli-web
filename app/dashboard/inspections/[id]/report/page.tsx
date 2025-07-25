import { Suspense } from 'react'
import { getInspection } from '@/app/dashboard/inspections/actions/actions'
import { InspectionReport } from '@/app/dashboard/inspections/[id]/report/components/inspection-report'
import { Loading } from '@/app/dashboard/inspections/[id]/report/components/loading'
import { notFound } from 'next/navigation'
import { Inspection } from '@/app/dashboard/inspections/[id]/report/types/inspection-types'

interface InspectionReportPageProps {
  params: Promise<{
    id: string
  }>
}

interface GetInspectionResponse {
  success?: string
  error?: string
  data?: Inspection
}

export default async function InspectionReportPage({
  params,
}: InspectionReportPageProps) {
  const { id } = await params
  const inspectionData = (await getInspection(id)) as GetInspectionResponse

  if (!inspectionData?.data) {
    notFound()
  }

  const inspection = inspectionData.data

  // Only show completed inspections
  if (inspection.status !== 'completed') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Inspection Not Completed
          </h2>
          <p className="text-gray-600">
            This inspection has not been completed yet. Please complete the
            inspection to view the report.
          </p>
        </div>
      </div>
    )
  }

  return (
    <Suspense fallback={<Loading />}>
      <InspectionReport inspection={inspection} />
    </Suspense>
  )
}
