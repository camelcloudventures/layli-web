'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import type { Inspection } from '@/lib/types/inspection-types'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { InspectionList } from './components/inspection-list'
import { getAllInspections } from './actions/actions'

interface ApiResponse {
  success?: string
  error?: string
  data?: Inspection[]
  pagination?: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

export default function InspectionsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [inspections, setInspections] = useState<Inspection[]>([])

  useEffect(() => {
    const fetchInspections = async () => {
      try {
        const result = (await getAllInspections()) as ApiResponse
        if (result.error) {
          toast.error(result.error)
          return
        }
        setInspections(result.data || [])
      } catch (error) {
        console.error('Error fetching inspections:', error)
        toast.error('Failed to load inspections')
      } finally {
        setLoading(false)
      }
    }

    fetchInspections()
  }, [])

  const handleCreateInspection = () => {
    router.push('/dashboard/inspections/create')
  }

  //log out the status of the inspections
  // console.log(
  //   'inspections',
  //   inspections.map((inspection) => inspection.status),
  // )

  console.log(
    'inspections',
    inspections,
    // inspections[0]?.pages[0].sections[0].questions[0].response_options,
  )

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Inspections</h1>

      <Card>
        <CardContent className="pt-6">
          <InspectionList
            inspections={inspections}
            loading={loading}
            //@ts-expect-error - inspections is not typed
            onCreateInspection={handleCreateInspection}
          />
        </CardContent>
      </Card>
    </div>
  )
}
